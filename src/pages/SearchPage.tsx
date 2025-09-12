import { Pagination } from "../components/Pagination";
import { JobCard } from "../components/JobCard";
import type { Job } from "../models/Job";
import { useJobsSearch } from "../hooks/useJobsSearch";
import { useState } from "react";
import { FilterAndSearchJobs } from "../components/FilterAndSearchJobs";

export const SearchPage = () => {

  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const limit = 20;

  const { jobs, total } = useJobsSearch(query, page, limit);
  
  return (
    <>
    <h1>Sök jobb</h1>
    <FilterAndSearchJobs query={query} setQuery={setQuery}/>

    {jobs.map((j: Job) => (
      <JobCard key={j.id} job={j} />
    ))}

    <Pagination total={total} limit={limit} onPageChange={setPage} page={page} />
  </>
)
}
