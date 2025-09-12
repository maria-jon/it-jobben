import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import type { Job } from "../models/Job";

export const useJobsSearch = (queryParams?: string, page: number = 1, limit = 20) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const offset = (page - 1) * limit

    const cleanQuery = queryParams?.trim().replace(/^\?/, "") ?? "";

    const finalQuery = cleanQuery
      ? `${cleanQuery}&offset=${offset}&limit=${limit}`
      : `offset=${offset}&limit=${limit}`;

    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
      const data = await getJobs(finalQuery);
        if (!cancelled) {
          setJobs(data.hits);   
          setTotal(data.total); 
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            (err as Error).message || "Något gick fel vid hämtning av jobb."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      cancelled = true;
    };
  }, [queryParams, page, limit]);

  return { jobs, loading, error, total } as const;
};
