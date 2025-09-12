import {
  DigiFormInputSearch,
  DigiLayoutBlock,
  DigiTypography,
  DigiTypographyHeadingJumbo
} from "@digi/arbetsformedlingen-react";
import {
  FormInputSearchVariation,
  FormInputType,
  TypographyHeadingJumboLevel,
  TypographyHeadingJumboVariation
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
    <DigiLayoutBlock afVerticalPadding afMarginTop className="hero">
      <DigiTypography>
        <DigiTypographyHeadingJumbo
          afText="Hitta ditt nästa jobb som utvecklare"
          afLevel={TypographyHeadingJumboLevel.H1}
          afVariation={TypographyHeadingJumboVariation.PRIMARY}
        />
        <p>
          Välkommen till IT-jobben - en studentbyggd platsbank som samlar
          aktuella annonser direkt från Arbetsförmedlingens öppna data.
        </p>
        <p>
          Här kan du enkelt söka, filtrera och sortera bland hundratals jobb
          inom utveckling och IT. Vår vision är att göra det smidigare för
          studenter och utvecklare att hitta sitt nästa drömjobb.
        </p>

        <form onSubmit={onSubmit} role="search" aria-label="Job search">
          <DigiFormInputSearch
            afLabel="Sök jobb"
            afVariation={FormInputSearchVariation.MEDIUM}
            afType={FormInputType.SEARCH}
            afButtonText="Sök"
            value={term}
            onChange={handleChange}
          />
          <input type="hidden" name="q" value={term} />
        </form>
      </DigiTypography>
    </DigiLayoutBlock>
  );
}
