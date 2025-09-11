import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import type { Job } from "../models/Job";

export const useJobsSearch = (queryParams?: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const cleanQuery =
    queryParams && queryParams.trim().length > 0
      ? queryParams.replace(/^\?/, "") 
      : "";

    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
      const data =
        cleanQuery.length > 0
          ? await getJobs(cleanQuery)
          : await getJobs();

        if (!cancelled) {
          setJobs(data);
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
  }, [queryParams]);

  return { jobs, loading, error } as const;
};
