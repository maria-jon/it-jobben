/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DigiFormSelectFilter,
  type IListItem,
} from "@digi/arbetsformedlingen-react";
import { get } from "../services/serviceBase";

type Municipality = { code: string; name: string; count: number };

function joinUrl(base: string, extra?: string) {
  if (!extra || !extra.trim()) return base;
  const e = extra.trim();
  if (e.startsWith("?"))
    return base + (base.includes("?") ? e.replace("?", "&") : e);
  if (e.startsWith("&")) return base + e;
  return base + (base.includes("?") ? `&${e}` : `?${e}`);
}

export const LocationDropdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL as string;

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        params.delete("municipality");
        params.delete("offset");

        const url = joinUrl(
          baseURL,
          `${params.toString()}&limit=0&facets=municipality`
        );
        const data = await get<any>(url);

        const buckets =
          data?.facets?.municipality ??
          data?.facets?.municipalities ??
          data?.aggregations?.municipality ??
          [];

        const rows: Municipality[] = buckets.map((b: any) => ({
          code: String(b.id ?? b.value ?? b.code ?? ""),
          name: String(b.label ?? b.name ?? b.title ?? b.id ?? ""),
          count: Number(b.count ?? b.doc_count ?? 0),
        }));

        rows.sort((a, b) => b.count - a.count);
        setMunicipalities(rows);
      } catch (err) {
        console.error("Failed to fetch municipality facets:", err);
        setMunicipalities([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search, baseURL]);

  const usp = new URLSearchParams(location.search);
  const selectedValue =
    usp.get("remote") === "true" ? "remote" : usp.get("municipality") ?? "";

  // Build items in AF format (text + value)
  const items: IListItem[] = useMemo(
    () => [
      { value: "", text: "Alla orter" },
      { value: "remote", text: "Distans (remote)" },
      ...municipalities.map<IListItem>((m) => ({
        value: m.code,
        text: `${m.name} (${m.count})`,
      })),
    ],
    [municipalities]
  );

  // DigiFormSelectFilter expects value as IListItem[]
  const selectedItems: IListItem[] = selectedValue
    ? items.filter((i) => i.value === selectedValue)
    : [];

  const updateUrl = (municipality?: string, isRemote?: boolean) => {
    const p = new URLSearchParams(location.search);
    p.delete("offset");
    if (municipality) {
      p.delete("remote");
      p.set("municipality", municipality);
    } else if (isRemote) {
      p.delete("municipality");
      p.set("remote", "true");
    } else {
      p.delete("municipality");
      p.delete("remote");
    }
    navigate(`/search?${p.toString()}`, { replace: true });
  };

  return (
    <DigiFormSelectFilter
      label="Efter plats"
      items={items}
      value={selectedItems}
      isLoading={loading}
      onValueChange={(vals: IListItem[]) => {
        const val = vals?.[0]?.value;
        if (val === "remote") updateUrl(undefined, true);
        else if (val) updateUrl(val);
        else updateUrl();
      }}
    />
  );
};
