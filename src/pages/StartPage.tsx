import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DigiFormInputSearch } from "@digi/arbetsformedlingen-react";
import {
  FormInputSearchVariation,
  FormInputType,
} from "@digi/arbetsformedlingen";

export default function StartPage() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = term.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange(e: any) {
    const value = e?.target?.value ?? e?.detail?.value ?? "";
    setTerm(String(value));
  }

  return (
    <section className="hero">
      <h1>Platsbanken</h1>
      <p>Hitta ditt nästa jobb som utvecklare</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus
        urna sed urna ultricies ac tempor dui sagittis. In condimentum facilisis
        porta.
      </p>

      <form onSubmit={onSubmit} role="search" aria-label="Job search">
        <DigiFormInputSearch
          afLabel=""
          afVariation={FormInputSearchVariation.MEDIUM}
          afType={FormInputType.SEARCH}
          afButtonText="Search"
          value={term}
          onChange={handleChange}
        />
        <input type="hidden" name="q" value={term} />
      </form>
    </section>
  );
}
