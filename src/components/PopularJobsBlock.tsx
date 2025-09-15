import {
  DigiLayoutBlock,
  DigiLayoutColumns,
  DigiLinkInternal,
  DigiTypography,
} from "@digi/arbetsformedlingen-react";
import {
  LayoutColumnsElement,
  LayoutColumnsVariation,
} from "@digi/arbetsformedlingen";

import { useEffect, useState } from "react";
import { getCountForQuery } from "../services/popularJobsService";

type Row = { id: string; label: string; count: number };

// Search keywords to show, with corresponding query strings
const KEYWORDS: { id: string; label: string; query: string }[] = [
  { id: "java", label: "Java", query: "java AND -javascript" },
  { id: "dotnet", label: ".NET", query: '".net" OR c#' },
  { id: "react", label: "React", query: 'react OR "react.js" OR reactjs' },
  { id: "frontend", label: "Frontend", query: 'frontend OR "front end"' },
];

//  Optional: filter within a specific occupation group
//  See https://jobsearch.api.jobtechdev.se/documentation/parameters/#occupation-group
const OCCUPATION_GROUP: string | null = null;

export default function PopularJobsBlock() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const withCounts: Row[] = await Promise.all(
          KEYWORDS.map(async (k) => {
            // Build query with optional occupation group filter
            const extra =
              `q=${encodeURIComponent(k.query)}` +
              (OCCUPATION_GROUP
                ? `&occupation-group=${encodeURIComponent(OCCUPATION_GROUP)}`
                : "") +
              `&limit=0`;
            // Fetch count for this query
            const count = await getCountForQuery(extra);
            return { id: k.id, label: k.label, count };
          })
        );
        // Sort by count descending
        withCounts.sort((a, b) => b.count - a.count);
        setRows(withCounts);
      } catch {
        setErr("Kunde inte hämta antal jobb just nu.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Loading and error states
  if (loading) return <section aria-busy="true">Laddar kategorier…</section>;
  if (err) return <section role="alert">{err}</section>;

  return (
    <DigiLayoutBlock
      afVerticalPadding
      afMarginTop
      afMarginBottom
      aria-labelledby="popular-dev-heading"
    >
      <DigiTypography>
        <h2 id="popular-dev-heading">Flest annonser just nu</h2>

        <DigiLayoutColumns
          afElement={LayoutColumnsElement.DIV}
          afVariation={LayoutColumnsVariation.TWO}
        >
          {rows.map(({ id, label, count }) => {
            const kw = KEYWORDS.find((k) => k.id === id)!;
            // Link to search page with this keyword and optional occupation group filter
            const href =
              `/search?q=${encodeURIComponent(kw.query)}` +
              (OCCUPATION_GROUP
                ? `&occupation-group=${encodeURIComponent(OCCUPATION_GROUP)}`
                : "") +
              `&sort=pubdate-desc`;

            return (
              <DigiLinkInternal
                key={id}
                afHref={href}
                hideVisitedColor
                afAriaLabel={`Visa ${count} annonser: ${label}`}
              >
                {label} {count ? `(${count})` : ""}
              </DigiLinkInternal>
            );
          })}
        </DigiLayoutColumns>
      </DigiTypography>
    </DigiLayoutBlock>
  );
}
