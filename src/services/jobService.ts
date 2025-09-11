const baseURL = import.meta.env.VITE_BASE_URL as string;
const jobURL = import.meta.env.VITE_JOB_URL as string;

import type { AfResponse } from "../models/AfResponse";
import type { Job } from "../models/Job";
import { get } from "./serviceBase";

function joinUrl(base: string, extra?: string) {
  if (!extra || !extra.trim()) return base;
  const e = extra.trim();
  if (e.startsWith("?")) {
    // Clean leading ? if any
    return base + (base.includes("?") ? e.replace("?", "&") : e);
  }
  if (e.startsWith("&")) return base + e;
  //otherwise add ? or & depending on base
  return base + (base.includes("?") ? `&${e}` : `?${e}`);
}

export const getJobs = async (queryParams?: string): Promise<Job[]> => {
  try {
    const url = joinUrl(baseURL, queryParams);
    const data = await get<AfResponse>(url);
    return data.hits;
  } catch {
    throw new Error("Ojdå, något blev tokitg!");
  }
};

export const getJobById = async (id: string) => {
  try {
    const data = await get<Job>(`${jobURL}${id}`);
    console.log(data);
    return data;
  } catch {
    throw new Error("Kunde inte hitta den specifika jobbannonsen :(");
  }
};
