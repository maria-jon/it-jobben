import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../services/jobService";
import type { Job } from "../models/Job";


import { DigiLayoutBlock, DigiLink, DigiTypography, DigiTypographyMeta, DigiTypographyPreamble } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation, TypographyMetaVariation } from "@digi/arbetsformedlingen";

export default function AdPage() {
  const navigate = useNavigate();

  // Find ID
  const { id: adId } = useParams<{ id: string }>();
  const id = adId ? decodeURIComponent(adId).trim() : "";

  const [job, setJob] = useState<Job>(
    JSON.parse(localStorage.getItem("job") || "[]"),
  );
  const [hasFetched, setHasFetched] = useState(false);
  
  useEffect(() => {
    const getData = async () => {
      try {
        const job = await getJobById(id);
        setJob(job);
      } catch {
        throw new Error (`Kan inte hitta annons med id ${id}`)
      } finally {
        setHasFetched(true);
      }
    }
    if(hasFetched) return;

    getData();
  });

  localStorage.setItem("job", JSON.stringify(job));

  return (
    <>
      <DigiLink
        afHref="/"
        afOverrideLink={true}
        afAriaLabel="Gå tillbaka"
        onAfOnClick={() => navigate(-1)}
      >	 
        ← Tillbaka
      </DigiLink>
      <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY}>
        <DigiTypography>
          <h2>{job.headline}</h2>
          <h3>{job.employer.name}</h3>
          <DigiTypographyPreamble>
            Jag är en ingress. Använd mig direkt efter huvudrubrik.
          </DigiTypographyPreamble>
          <DigiTypographyMeta
            afVariation={TypographyMetaVariation.PRIMARY}
          >
            <p>
            {job.occupation.label}
            </p>
            <p slot="secondary">
              {job.workplace_address.municipality || job.workplace_address.country}
            </p>
          </DigiTypographyMeta>
          {/* TODO 
          * create conditional rendering to only show this if there are must haves
          * render work_experiences
          */}
          <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY}>
            <DigiTypography>
            <h3>Kvalifikationer</h3>
            <p>
              {job.must_have.skills}
              {job.must_have.languages}
              {/*job.must_have.work_experiences*/}
              {job.must_have.education}
              {job.must_have.education_level}
            </p>
            </DigiTypography>
          </DigiLayoutBlock>
          <p>
            {job.description.text}
          </p>
        </DigiTypography>
      </DigiLayoutBlock>
    </>
  );
}
