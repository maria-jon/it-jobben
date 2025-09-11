import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCountForQuery } from "../services/popularJobsService";

type Item = { label: string; qp: string; count?: number };

const ITEMS: Item[] = [
  { label: "Mjukvaru- & systemutvecklare m.fl.", qp: "occupation-group=2512" },
  { label: "Systemtestare & testledare", qp: "occupation-group=2514" },
  { label: "IT-säkerhetsspecialister", qp: "occupation-group=2516" },
  { label: "Webbmaster/webbadm.", qp: "occupation-group=3515" },
];

export default function PopularJobsBlock() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const withCounts = await Promise.all(
          ITEMS.map(async (it) => ({
            ...it,
            count: await getCountForQuery(it.qp),
          }))
        );
        setItems(withCounts);
      } catch {
        setError("Kunde inte hämta annonsstatistik just nu.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <section aria-busy="true">Laddar populära utvecklarroller…</section>;
  }

  if (error) {
    return <section role="alert">{error}</section>;
  }

  return (
    <section
      aria-labelledby="popular-dev-heading"
      style={{ marginTop: "2rem" }}
    >
      <h2 id="popular-dev-heading">Flest annonser just nu </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: ".75rem",
          marginTop: ".5rem",
        }}
      >
        {items.map(({ label, qp, count }) => (
          <Link
            key={label}
            to={`/search?${qp}&sort=pubdate-desc`}
            aria-label={`Visa ${count ?? 0} annonser: ${label}`}
            style={{
              display: "block",
              padding: ".5rem .75rem",
              border: "1px solid #ccc",
              borderRadius: ".5rem",
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
