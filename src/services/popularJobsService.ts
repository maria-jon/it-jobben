/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "./serviceBase";
import type { AfResponse } from "../models/AfResponse";

const baseURL = import.meta.env.VITE_BASE_URL as string;

// Joins base URL with extra query parameters correctly
function joinUrl(base: string, extra?: string) {
  if (!extra || !extra.trim()) return base;
  const e = extra.trim();
  if (e.startsWith("?"))
    return base + (base.includes("?") ? e.replace("?", "&") : e);
  if (e.startsWith("&")) return base + e;
  return base + (base.includes("?") ? `&${e}` : `?${e}`);
}

// Get total count of jobs for a given query (without fetching all jobs)
export async function getCountForQuery(extraQuery: string): Promise<number> {
  const url = joinUrl(
    baseURL,
    extraQuery.includes("limit=") ? extraQuery : `${extraQuery}&limit=0`
  );
  const data = await get<AfResponse>(url);

  const total =
    typeof (data as any)?.total === "number"
      ? (data as any).total
      : (data as any)?.total?.value;
  return Number(total ?? 0);
}
