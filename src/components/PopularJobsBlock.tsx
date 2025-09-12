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

const GROUPS: { id: string; label: string }[] = [
  { id: "2512", label: "Mjukvaru- & systemutvecklare m.fl." },
  { id: "2514", label: "Systemtestare & testledare" },
  { id: "2516", label: "IT-säkerhetsspecialister" },
  { id: "3515", label: "Webbmaster / webbadministratörer" },
];

// A block to show popular job categories for developers with counts
// Uses occupation-group query param to filter on job ads
export default function PopularJobsBlock() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const withCounts = await Promise.all(
          GROUPS.map(async (g) => ({
            id: g.id,
            label: g.label,
            count: await getCountForQuery(
              `occupation-group=${encodeURIComponent(g.id)}&limit=0`
            ),
          }))
        );
        withCounts.sort((a, b) => b.count - a.count);
        setRows(withCounts);
      } catch {
        setErr("Kunde inte hämta Data/IT-grupper just nu.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <section aria-busy="true">Laddar kategorier…</section>;
  if (err) return <section role="alert">{err}</section>;

  return (
    <DigiLayoutBlock afVerticalPadding afMarginTop afMarginBottom aria-labelledby="popular-dev-heading">
      <DigiTypography>
        <h2 id="popular-dev-heading">Flest annonser just nu </h2>
        <DigiLayoutColumns
          afElement={LayoutColumnsElement.DIV}
          afVariation={LayoutColumnsVariation.TWO}
        >
          {rows.map(({ id, label, count }) => (
            <DigiLinkInternal
              key={id}
              afHref={`/search?occupation-group=${encodeURIComponent(
                id
              )}&sort=pubdate-desc`}
              hideVisitedColor
              afAriaLabel={`Visa ${count} annonser: ${label}`}
            >
              {label} {count ? `(${count})` : ""}
            </DigiLinkInternal>
          ))}
        </DigiLayoutColumns>
      </DigiTypography>
    </DigiLayoutBlock>
  );
}
