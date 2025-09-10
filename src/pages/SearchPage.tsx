import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { JobCard } from "../components/JobCard";
import type { Job } from "../models/Job";
import { HandleSorting } from "../components/HandleSorting";
import { useJobsSearch } from "../hooks/useJobsSearch";

export default function SearchPage() {
  const location = useLocation();

  //Keep track of the query string in state
  const [query, setQuery] = useState<string>(location.search || "");

  // If the URL changes, update the query state
  useEffect(() => {
    setQuery(location.search || "");
  }, [location.search]);

  //Use custom hook to fetch jobs
  const { jobs, loading, error } = useJobsSearch(query);

  //Manage sorting changes
  const handleSorting = (sortQuery?: string) => {
    const usp = new URLSearchParams(query || "");
    const clean = (sortQuery ?? "").replace(/^\?/, "").replace(/^&/, "");
    const s = new URLSearchParams(clean).get("sort");

    if (s) usp.set("sort", s);
    else usp.delete("sort");

    // Update automat the URL too
    setQuery(`?${usp.toString()}`);
  };

  return (
    <>
      <h1>Sök jobb</h1>
      <HandleSorting onSort={handleSorting} />

      {loading && <p>Söker…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading &&
        !jobs.length &&
        (new URLSearchParams(query).get("q") ?? "") && (
          <p>Inga jobb hittades.</p>
        )}

      {jobs.map((j: Job) => (
        <JobCard key={j.id} job={j} />
      ))}
    </>
  );
}
