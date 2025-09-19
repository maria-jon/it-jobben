import { getJobs } from "./jobService";
import type { Job } from "../models/Job";

export async function searchJobs(q: string, sort?: string): Promise<{hits: Job[]; total: number}> {
 if (!q.trim()) return {hits: [], total: 0};
  const qp = sort
    ? `q=${encodeURIComponent(q)}&${sort.replace(/^\?/, "")}`
    : `q=${encodeURIComponent(q)}`;
  return await getJobs(qp);
}
