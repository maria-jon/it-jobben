import { get } from "./serviceBase";
import type { AfResponse } from "../models/AfResponse";

const baseURL = import.meta.env.VITE_BASE_URL as string;

function joinUrl(base: string, extra?: string) {
  if (!extra || !extra.trim()) return base;
  const e = extra.trim();
  if (e.startsWith("?")) return base + (base.includes("?") ? e.replace("?", "&") : e);
  if (e.startsWith("&")) return base + e;
  return base + (base.includes("?") ? `&${e}` : `?${e}`);
}

export async function getCountForQuery(extraQuery: string): Promise<number> {
  const url = joinUrl(baseURL, extraQuery);
  const data = await get<AfResponse>(url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = typeof (data as any)?.total === "number" ? (data as any).total : (data as any)?.total?.value;
  return Number(total ?? 0);
}
