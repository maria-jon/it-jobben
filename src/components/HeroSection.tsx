import { DigiFormInputSearch } from "@digi/arbetsformedlingen-react";
import {
  FormInputSearchVariation,
  FormInputType,
} from "@digi/arbetsformedlingen";
import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
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
      <h1>Hitta ditt nästa jobb som utvecklare</h1>
      <p>
        Sök bland hundratals annonser för programmerare och utvecklare i hela
        Sverige.
      </p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit…</p>

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
