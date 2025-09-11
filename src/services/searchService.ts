import { getJobs } from "./jobService";
import type { Job } from "../models/Job";

export async function searchJobs(q: string, sort?: string): Promise<Job[]> {
  if (!q.trim()) return [];
  const qp = sort
    ? `q=${encodeURIComponent(q)}&${sort.replace(/^\?/, "")}`
    : `q=${encodeURIComponent(q)}`;
  return await getJobs(qp);
}
