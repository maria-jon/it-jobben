import { Pagination } from "../components/Pagination";
import { JobCard } from "../components/JobCard";
import type { Job } from "../models/Job";
import { useJobsSearch } from "../hooks/useJobsSearch";
import { useState } from "react";
import { FilterAndSearchJobs } from "../components/FilterAndSearchJobs";
import { 
  DigiLayoutBlock, 
  DigiTypography, 
  DigiTypographyHeadingJumbo 
} from "@digi/arbetsformedlingen-react";
import { 
  TypographyHeadingJumboLevel, 
  TypographyHeadingJumboVariation 
} from "@digi/arbetsformedlingen";

export const SearchPage = () => {

  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const limit = 20;

  const { jobs, total, loading, error } = useJobsSearch(query, page, limit);
  
  return ( 
  <>
    <DigiLayoutBlock afMarginTop afMarginBottom afVerticalPadding>
      <DigiTypography>
        <DigiTypographyHeadingJumbo
          afText="Sök jobb"
          afLevel={TypographyHeadingJumboLevel.H1}
          afVariation={TypographyHeadingJumboVariation.PRIMARY}
        />
        <FilterAndSearchJobs query={query} setQuery={setQuery}/>
      </DigiTypography>
    </DigiLayoutBlock>

    {jobs.map((j: Job) => (
      <JobCard key={j.id} job={j} />
    ))}

    {loading && <p>Söker…</p>}
    {error && <p className="text-red-600">{error}</p>}
    {!loading && !jobs.length && query && (
      <p>Inga jobb för den sökningen hittades, testa att söka på något annat.</p>
    )}

    <Pagination total={total} limit={limit} onPageChange={setPage} page={page} />
  </>
)
}
