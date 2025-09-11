import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOccupationGroupsForField } from "../services/taxonomyService";
import { getCountForQuery } from "../services/popularJobsService";

type Row = { concept_id: string; label: string; count: number };

export default function PopularJobsBlock() {
  const fieldId = (import.meta.env.VITE_OCC_FIELD_ID as string) || "3";
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        //Get all groups for field
        const groups = await getOccupationGroupsForField(fieldId);

        //Count for each group
        const withCounts = await Promise.all(
          groups.map(async (g) => ({
            concept_id: g.concept_id,
            label: g.label,
            count: await getCountForQuery(
              `occupation-group=${encodeURIComponent(g.concept_id)}&limit=0`
            ),
          }))
        );

        //Sort by count desc and take top 8
        withCounts.sort((a, b) => b.count - a.count);
        setRows(withCounts.slice(0, 8));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setErr("Kunde inte hämta Data/IT-grupper just nu.");
      } finally {
        setLoading(false);
      }
    })();
  }, [fieldId]);

  if (loading)
    return <section aria-busy="true">Laddar Data/IT-kategorier…</section>;
  if (err) return <section role="alert">{err}</section>;

  return (
    <section
      aria-labelledby="popular-dev-heading"
      style={{ marginTop: "2rem" }}
    >
      <h2 id="popular-dev-heading">Flest annonser just nu (Data/IT)</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: ".75rem",
          marginTop: ".5rem",
        }}
      >
        {rows.map(({ concept_id, label, count }) => (
          <Link
            key={concept_id}
            to={`/search?occupation-group=${encodeURIComponent(
              concept_id
            )}&sort=pubdate-desc`}
            aria-label={`Visa ${count} annonser: ${label}`}
            style={{
              display: "block",
              padding: "0.5rem 0.75rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              textDecoration: "none",
            }}
          >
            {label} {count ? `(${count})` : ""}
          </Link>
        ))}
      </div>
    </section>
  );
}
