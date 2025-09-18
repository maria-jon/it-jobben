/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../services/serviceBase";
import "./LocationDropdown.css";

//Server-provider facet shape for a municipality
type Municipality = { code: string; name: string; count: number };

//Helper: append query params to base url
function joinUrl(base: string, extra?: string) {
  if (!extra || !extra.trim()) return base;
  const e = extra.trim();
  if (e.startsWith("?"))
    return base + (base.includes("?") ? e.replace("?", "&") : e);
  if (e.startsWith("&")) return base + e;
  return base + (base.includes("?") ? `&${e}` : `?${e}`);
}

//Fallback cities if facets are empty
const FALLBACK_TOP5 = [
  { code: "0180", name: "Stockholm" },
  { code: "1480", name: "Göteborg" },
  { code: "1280", name: "Malmö" },
  { code: "0380", name: "Uppsala" },
  { code: "1980", name: "Västerås" },
];

export const LocationDropdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL as string;

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  //Fetch facets when URL changes
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

        //Most results first
        rows.sort((a, b) => b.count - a.count);
        setMunicipalities(rows);
      } catch {
        //Safe fallback
        setMunicipalities([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search, baseURL]);

  //Read current selection from URL
  const usp = new URLSearchParams(location.search);
  const selectedValue =
    usp.get("remote") === "true" ? "remote" : usp.get("municipality") ?? "";

  //Choose top 5 cities
  const top5 =
    municipalities.length > 0
      ? municipalities.slice(0, 5)
      : FALLBACK_TOP5.map((f) => ({ code: f.code, name: f.name, count: 0 }));

  //Build menu list
  const menuItems = useMemo(
    () =>
      [
        { value: "", label: "Alla orter" },
        { value: "remote", label: "Distans (remote)" },
        ...top5.map((m) => ({ value: m.code, label: m.name })),
      ] as { value: string; label: string }[],
    [top5]
  );

  //Push selection to URL
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

  //Apply menu click+close
  const handleSelect = (val: string) => {
    if (val === "remote") updateUrl(undefined, true);
    else if (val) updateUrl(val);
    else updateUrl();
    setOpen(false);
  };

  // Close on outside click / Esc
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  //UI: single yellow trugger + dark popover
  return (
    <div className="location-filter" ref={wrapRef}>
      {/* ONLY the yellow text trigger */}
      <button
        type="button"
        className="filter-label"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={loading}
      >
        Efter plats <span aria-hidden>{open ? "▴" : "▾"}</span>
      </button>

      {/* Popover under the label */}
      <div
        className={`filter-menu ${open ? "" : "hidden"}`}
        role="menu"
        aria-label="Välj plats"
      >
        {menuItems.map((o) => {
          const active = selectedValue === o.value;
          return (
            <button
              key={o.value || "all"}
              role="menuitemradio"
              aria-checked={active}
              className={active ? "menu-item-active" : undefined}
              onClick={() => handleSelect(o.value)}
              type="button"
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
