/* eslint-disable @typescript-eslint/no-explicit-any */
const cache = new Map<string, any>();

// TODO: Add taxonomy API URL in .env
const BASE_TAX_URL = import.meta.env.VITE_TAXONOMY_BASE_URL ?? "";

// Fallback data if no API URL is provided
const FALLBACK_COUNTIES = [
  { id: "01", name: "Stockholms län" },
  { id: "14", name: "Västra Götalands län" },
];
const FALLBACK_MUNICIPALITIES: Record<string, { id: string; name: string }[]> =
  {
    "01": [{ id: "0180", name: "Stockholm" }],
    "14": [{ id: "1480", name: "Göteborg" }],
  };

// Simple GET request helper
async function httpGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

// Fetch counties from taxonomy service with caching
export async function fetchCounties(): Promise<{ id: string; name: string }[]> {
  const key = "counties";
  if (cache.has(key)) return cache.get(key);

  if (!BASE_TAX_URL) {
    cache.set(key, FALLBACK_COUNTIES);
    return FALLBACK_COUNTIES;
  }

  // TODO: update to correct endpoint and map -> {id, name}
  // Example form: `${BASE_TAX_URL}/counties`
  try {
    const data = await httpGet<any>(`${BASE_TAX_URL}/counties`);
    const rows = data.items.map((d: any) => ({ id: d.id, name: d.name }));
    cache.set(key, rows);
    return rows;
  } catch {
    cache.set(key, FALLBACK_COUNTIES);
    return FALLBACK_COUNTIES;
  }
}

// Fetch municipalities for a given county with caching
export async function fetchMunicipalitiesByCounty(
  countyId: string
): Promise<{ id: string; name: string }[]> {
  const key = `municipalities:${countyId}`;
  if (cache.has(key)) return cache.get(key);

  if (!BASE_TAX_URL) {
    const rows = FALLBACK_MUNICIPALITIES[countyId] ?? [];
    cache.set(key, rows);
    return rows;
  }

  // TODO: update to correct endpoint and map -> {id, name}
  try {
    const data = await httpGet<any>(
      `${BASE_TAX_URL}/municipalities?county_id=${countyId}`
    );
    const rows = data.items.map((d: any) => ({ id: d.id, name: d.name }));
    cache.set(key, rows);
    return rows;
  } catch {
    const rows = FALLBACK_MUNICIPALITIES[countyId] ?? [];
    cache.set(key, rows);
    return rows;
  }
}
