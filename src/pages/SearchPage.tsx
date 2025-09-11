import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DigiFormInputSearch } from "@digi/arbetsformedlingen-react";
import { JobCard } from "../components/JobCard";
import { HandleSorting } from "../components/HandleSorting";
import { useJobsSearch } from "../hooks/useJobsSearch";
import type { Job } from "../models/Job";

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // URL q parameter
  const params = new URLSearchParams(location.search);
  const q = params.get("q") ?? "";

  // Input state localt
  const [term, setTerm] = useState(q);

  //URL state keep in sync with q
  const [query, setQuery] = useState<string>(location.search || "");
  useEffect(() => {
    setQuery(location.search || "");
    // sync input when URL change (back/forward)
    setTerm(q);
  }, [location.search, q]);

  const { jobs, loading, error } = useJobsSearch(query);

  // Search submit -> navigate with q i URL
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = term.trim();
    if (!next) return;
    const usp = new URLSearchParams(location.search);
    usp.set("q", next);
    // Remove page; to reset to first page on new search
    navigate(
      { pathname: "/search", search: `?${usp.toString()}` },
      { replace: true }
    );
  };

  // Sorting change -> navigate with sort in URL
  const handleSorting = (sortQuery?: string) => {
    const usp = new URLSearchParams(location.search);

    if (sortQuery) {
      // Clean leading ? or & if any
      const cleaned = sortQuery.replace(/^\?&?/, "");
      // Extract value of sort param
      const value = new URLSearchParams(cleaned).get("sort");
      if (value) usp.set("sort", value);
    } else {
      usp.delete("sort");
    }

    navigate(`/search?${usp.toString()}`, { replace: true });
  };

  return (
    <>
      <h1>Sök jobb</h1>

      <form
        onSubmit={onSubmit}
        role="search"
        aria-label="Job search"
        style={{ marginBottom: 12 }}
      >
        <DigiFormInputSearch
          afLabel=""
          afButtonText="Sök"
          value={term}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e: any) =>
            setTerm(e?.target?.value ?? e?.detail?.value ?? "")
          }
        />
      </form>

      <HandleSorting onSort={handleSorting} />

      {loading && <p>Söker…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !jobs.length && q && <p>Inga jobb hittades för ”{q}”.</p>}

      {jobs.map((j: Job) => (
        <JobCard key={j.id} job={j} />
      ))}
    </>
  );
}
