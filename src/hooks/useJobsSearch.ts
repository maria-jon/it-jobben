import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import type { Job } from "../models/Job";

export const useJobsSearch = (queryParams?: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!queryParams) {
      setJobs([]);
      return;
    }

    let cancelled = false;
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobs(queryParams);
        if (!cancelled) setJobs(data ?? []);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
        setJobs([]); 
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      cancelled = true;
    };
  }, [queryParams]);

  return { jobs, loading, error } as const;
};
