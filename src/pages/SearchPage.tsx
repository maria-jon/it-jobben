import { useEffect, useState } from "react";
import { JobCard } from "../components/JobCard";
import type { Job } from "../models/Job";
import { getJobs } from "../services/jobService";

export default function SearchPage() {
  const [jobs, setJobs] = useState<Job[]>(
    JSON.parse(localStorage.getItem("jobs") || "[]"),
  );
  
  useEffect(() => {
    const getData = async () => {
      const jobs = await getJobs();
      setJobs(jobs);
    };

    if (jobs.length > 0) return;

    getData();
  });

  return (
    <>
      <h1>Sök jobb</h1>
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
    </>
  );
}
