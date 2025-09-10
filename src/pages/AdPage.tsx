import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../services/jobService";
import type { Job } from "../models/Job";


import { DigiInfoCard, DigiLayoutBlock, DigiLayoutContainer, DigiLink, DigiLinkExternal, DigiTypography, DigiTypographyMeta, DigiTypographyTime } from "@digi/arbetsformedlingen-react";
import { InfoCardBorderPosition, InfoCardHeadingLevel, InfoCardType, InfoCardVariation, LayoutBlockVariation, LinkVariation, TypographyMetaVariation, TypographyTimeVariation } from "@digi/arbetsformedlingen";

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
          <header>
            <h2>{job.headline}</h2>
            <h3>{job.employer.name}</h3>
            <DigiTypographyMeta afVariation={TypographyMetaVariation.PRIMARY}>
              <p>
              {job.occupation.label}
              </p>
              <p slot="secondary">
                {job.workplace_address.municipality || job.workplace_address.country}
              </p>
            </DigiTypographyMeta>
          </header>
          <DigiLayoutContainer afVerticalPadding afNoGutter>
            <p>
              {job.working_hours_type.label}
              <br />
              {job.duration.label}
              <br />
              {job.employment_type.label}
            </p>
          </DigiLayoutContainer>
          {/* TODO 
          * create conditional rendering to only show this if there are must haves
          * render work_experiences
          */}
          <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY}>
              <h3>Kvalifikationer</h3>
              <p>
                {job.must_have.skills}
                {job.must_have.languages}
                {/*job.must_have.work_experiences*/}
                {job.must_have.education}
                {job.must_have.education_level}
              </p>
          </DigiLayoutBlock>
          <DigiLayoutContainer afVerticalPadding afNoGutter>
            <h3>Om jobbet</h3>
            <p>
              {job.description.text}
            </p>
          </DigiLayoutContainer>
          <DigiLayoutContainer afVerticalPadding afNoGutter>
            <h3>Om anställningen</h3>
            <h4>Lön</h4>
            <p>
              {job.salary_description}
              <br />
              {job.salary_type.label}
            </p>
            <h4>Anställningsvillkor</h4>
            <p>
              {job.employment_type.label}
              <br /> 
              {job.duration.label}
              <br /> 
              {job.working_hours_type.label}
            </p>
            <h4>Arbetsplats</h4>
            <p>
              <span>Arbetplatsen ligger i </span>
              <strong>{job.workplace_address.municipality}</strong>, 
              {job.workplace_address.region}
            </p>
          </DigiLayoutContainer>
          <DigiLayoutContainer afVerticalPadding afNoGutter>
            <h3>Arbetsgivaren</h3>
            <p>
              {job.employer.workplace}
              <br />
              {job.employer.name}
              <br /> 
              <DigiLinkExternal
                afHref={job.employer.url}
                afTarget="_blank"
                afVariation={LinkVariation.SMALL}
              >
                {job.employer.url}
              </DigiLinkExternal>
            </p>
          </DigiLayoutContainer>
          {/* TODO 
          * create conditional rendering to show correct information depending on application_details
          * (application via email, url, etc)
          */}
          <DigiInfoCard
            afHeading="Sök jobbet"
            afHeadingLevel={InfoCardHeadingLevel.H2}
            afType={InfoCardType.RELATED}
            afLinkHref={job.application_details.url}	
            afLinkText="Sök jobbet"	
            afVariation={InfoCardVariation.SECONDARY}	
            afBorderPosition={InfoCardBorderPosition.TOP}
          >
            <p>
              <span>Ansök senast: </span>
                <DigiTypographyTime
                  afVariation={TypographyTimeVariation.DISTANCE}
                  afLocale="sv-SE"
                  afDateTime={job.application_deadline}
                />
                <span> (
                  <DigiTypographyTime
                    afVariation={TypographyTimeVariation.PRETTY}
                    afLocale="sv-SE"
                    afDateTime={job.application_deadline}
                  />)
                </span>
            </p>
          </DigiInfoCard>
        </DigiTypography>
      </DigiLayoutBlock>
    </>
  );
}
