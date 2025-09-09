import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (term.trim()) navigate(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <section>
      <h1>Start Page</h1>

      <form onSubmit={onSubmit} role="search" aria-label="Job search">
        <DigiFormInputSearch
          afLabel="Search"
          afVariation={FormInputSearchVariation.MEDIUM}
          afType={FormInputType.SEARCH}
          afButtonText="Search"
          value={term}
          onChange={(e: unknown) =>
            setTerm(e?.target?.value ?? e?.detail?.value ?? "")
          }
        />

        <input type="hidden" name="q" value={term} />
      </form>
    </section>
  );
}
