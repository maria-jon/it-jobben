/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../services/serviceBase";
import "./LocationDropdown.css";

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

  // Current selection from URL
  const usp = new URLSearchParams(location.search);
  const selectedValue =
    usp.get("remote") === "true" ? "remote" : usp.get("municipality") ?? "";

  // Options for the <select>
  const options = useMemo(
    () => [
      { value: "", label: "Alla orter" },
      { value: "remote", label: "Distans (remote)" },
      ...municipalities.map((m) => ({
        value: m.code,
        label: `${m.name} (${m.count})`,
      })),
    ],
    [municipalities]
  );

  // Top 5 chips (by count)
  const topCities = useMemo(() => municipalities.slice(0, 5), [municipalities]);

  // URL updater
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

  const handleSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const val = e.target.value;
    if (val === "remote") updateUrl(undefined, true);
    else if (val) updateUrl(val);
    else updateUrl();
  };

  const handleChip = (val: string) => {
    if (val === "remote") updateUrl(undefined, true);
    else if (val) updateUrl(val);
    else updateUrl();
  };

  return (
    <div className="location-filter" aria-label="Efter plats">
      {/* Accessible label kept for screen readers */}
      <label className="visually-hidden" htmlFor="location-select">
        Efter plats
      </label>

      {/* Pill-styled select */}
      <span className="pill-select-wrap">
        <select
          className="pill-select"
          id="location-select"
          value={selectedValue}
          onChange={handleSelect}
          disabled={loading}
          aria-busy={loading}
          aria-label="Efter plats"
        >
          {options.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </span>

      {/* Quick chips: top 5 cities */}
      <div className="city-chips" role="group" aria-label="Snabbval ort">
        {/* Remote chip first */}
        <button
          type="button"
          className="city-chip"
          aria-pressed={selectedValue === "remote"}
          onClick={() => handleChip("remote")}
          disabled={loading}
          title="Distans (remote)"
        >
          Distans
        </button>

        {topCities.map((m) => (
          <button
            key={m.code}
            type="button"
            className="city-chip"
            aria-pressed={selectedValue === m.code}
            onClick={() => handleChip(m.code)}
            disabled={loading}
            title={m.name}
          >
            {m.name}
          </button>
        ))}

        {/* All chip */}
        <button
          type="button"
          className="city-chip"
          aria-pressed={selectedValue === ""}
          onClick={() => handleChip("")}
          disabled={loading}
          title="Alla orter"
        >
          Alla
        </button>
      </div>
    </div>
  );
};
