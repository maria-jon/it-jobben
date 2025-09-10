import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobCounts } from "../services/popularJobsService";

type Item = { term: string; count: number };

const DEV_TERMS: string[] = [
  "programmerare",
  "utvecklare",
  "systemutvecklare",
  "frontend",
  "backend",
  "fullstack",
  "JavaScript",
  "TypeScript",
  "Java",
  "C#",
  "Python",
  "DevOps",
  "Cloud",
  "Data engineer",
  "QA",
];

export default function PopularJobsBlock() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getJobCounts(DEV_TERMS);
        setItems(data);
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
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.75rem",
          marginTop: "0.5rem",
        }}
      >
        {items.map(({ term, count }) => (
          <Link
            key={term}
            to={`/search?q=${encodeURIComponent(term)}`}
            aria-label={`Visa ${count} annonser för ${term}`}
            style={{
              display: "block",
              padding: "0.5rem 0.75rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              textDecoration: "none",
            }}
          >
            {term} {count ? `(${count})` : ""}
          </Link>
        ))}
      </div>
    </section>
  );
}
