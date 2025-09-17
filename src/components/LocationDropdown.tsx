/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DigiFormSelectFilter } from "@digi/arbetsformedlingen-react";
import { get } from "../services/serviceBase";

type Municipality = { code: string; name: string; count: number };
type AFListItem = { value: string; text: string; label?: string };

function joinUrl(base: string, extra?: string) {
  if (!extra || !extra.trim()) return base;
  const e = extra.trim();
  if (e.startsWith("?"))
    return base + (base.includes("?") ? e.replace("?", "&") : e);
  if (e.startsWith("&"))
    return base + (base.includes("?") ? e : `?${e.slice(1)}`);
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

        const rows: Municipality[] = buckets.map(
          (b: any): Municipality => ({
            code: String(b.id ?? b.value ?? b.code ?? ""),
            name: String(b.label ?? b.name ?? b.title ?? b.id ?? ""),
            count: Number(b.count ?? b.doc_count ?? 0),
          })
        );

        rows.sort((a: Municipality, b: Municipality) => b.count - a.count);

        setMunicipalities(rows);
      } catch (e) {
        console.error("Failed to fetch municipality facets:", e);
        setMunicipalities([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search, baseURL]);

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

  const items: AFListItem[] = useMemo(
    () => [
      { value: "", text: "Alla orter", label: "Alla orter" },
      { value: "remote", text: "Distans (remote)", label: "Distans (remote)" },
      ...municipalities.map<AFListItem>((m) => ({
        value: m.code,
        text: `${m.name} (${m.count})`,
        label: `${m.name} (${m.count})`,
      })),
    ],
    [municipalities]
  );

  const usp = new URLSearchParams(location.search);
  const selectedValue =
    usp.get("remote") === "true" ? "remote" : usp.get("municipality") ?? "";

  return (
    <DigiFormSelectFilter
      {...({
        afLabel: "Efter plats",
        afItems: items,
        afValue: selectedValue,
        afIsLoading: loading,
        onAfSelect: (e: any) => {
          const val = e?.detail?.value as string | undefined;
          if (val === "remote") updateUrl(undefined, true);
          else if (val) updateUrl(val);
          else updateUrl();
        },
      } as any)}
    />
  );
};
