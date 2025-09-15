/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { DigiContextMenu } from "@digi/arbetsformedlingen-react";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../services/serviceBase";

// Join base URL and extra query string properly
// Handles if extra starts with ? or & or neither
// Also handles if base already has ? or not
function joinUrl(base: string, extra?: string) {
  if (!extra || !extra.trim()) return base;
  const e = extra.trim();
  if (e.startsWith("?"))
    return base + (base.includes("?") ? e.replace("?", "&") : e);
  if (e.startsWith("&")) return base + e;
  return base + (base.includes("?") ? `&${e}` : `?${e}`);
}

type Kommun = { kod: string; namn: string; antal: number };

export const LocationDropdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL as string;

  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [kommuner, setKommuner] = useState<Kommun[]>([]);
  const [laddar, setLaddar] = useState(true);
  const [visaAlla, setVisaAlla] = useState(false);

  // Fetch municipalities facet on mount and when search changes
  useEffect(() => {
    (async () => {
      setLaddar(true);
      try {
        const params = new URLSearchParams(location.search);
        params.delete("municipality");
        params.delete("offset");
        const url = joinUrl(
          baseURL,
          `${params.toString()}&limit=0&facets=municipality`
        );
        const data = await get<any>(url);

        // Try to find facets in different possible structures
        const buckets =
          data?.facets?.municipality ??
          data?.facets?.municipalities ??
          data?.aggregations?.municipality ??
          [];

        const rows: Kommun[] = buckets.map((b: any) => ({
          kod: String(b.id ?? b.value ?? b.code ?? ""),
          namn: String(b.label ?? b.name ?? b.title ?? b.id ?? ""),
          antal: Number(b.count ?? b.doc_count ?? 0),
        }));

        rows.sort((a, b) => b.antal - a.antal);
        setKommuner(rows);
      } catch (e) {
        console.error("Kunde inte hämta kommun-facet:", e);
        setKommuner([]);
      } finally {
        setLaddar(false);
      }
    })();
  }, [location.search, baseURL]);

  //Add or update municipality or remote in URL
  // Remove offset (go to first page)
  const sättKommun = (kod: string) => {
    const p = new URLSearchParams(location.search);
    p.delete("remote");
    p.set("municipality", kod);
    p.delete("offset");
    navigate(`/search?${p.toString()}`, { replace: true });
  };

  const sättDistans = () => {
    const p = new URLSearchParams(location.search);
    p.delete("municipality");
    p.set("remote", "true");
    p.delete("offset");
    navigate(`/search?${p.toString()}`, { replace: true });
  };

  const rensa = () => {
    const p = new URLSearchParams(location.search);
    p.delete("municipality");
    p.delete("remote");
    p.delete("offset");
    navigate(`/search?${p.toString()}`, { replace: true });
  };

  // Meny items
  const synligaKommuner = visaAlla ? kommuner : kommuner.slice(0, 20);

  const meny = [
    { id: 0, title: "Alla orter", onClick: rensa },
    { id: 1, title: "Distans (remote)", onClick: sättDistans },
    ...synligaKommuner.map((k, i) => ({
      id: 100 + i,
      title: `${k.namn} (${k.antal})`,
      onClick: () => sättKommun(k.kod),
    })),
    ...(kommuner.length > 20 && !visaAlla
      ? [
          {
            id: 9999,
            title: "Visa fler…",
            onClick: () => setVisaAlla(true),
          },
        ]
      : []),
  ];

  // Title for dropdown
  const aktuellTitel = (() => {
    const muni = urlParams.get("municipality");
    const remote = urlParams.get("remote");
    if (remote === "true") return "Ort: Distans";
    if (muni) {
      const träff = kommuner.find((k) => k.kod === muni);
      return träff ? `Ort: ${träff.namn}` : "Ort";
    }
    return laddar ? "Ort (laddar…)" : "Ort";
  })();

  return (
    <DigiContextMenu
      afTitle={aktuellTitel}
      afMenuItems={meny}
      onAfChangeItem={(e: CustomEvent) => {
        const item = (e as any).detail?.item;
        item?.onClick?.();
      }}
    />
  );
};
