import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../services/jobService";
import type { Job } from "../models/Job";


import { DigiInfoCard, DigiLayoutBlock, DigiLayoutContainer, DigiLink, DigiLinkExternal, DigiTypography, DigiTypographyMeta, DigiTypographyTime } from "@digi/arbetsformedlingen-react";
import { InfoCardBorderPosition, InfoCardHeadingLevel, InfoCardType, InfoCardVariation, LayoutBlockVariation, TypographyMetaVariation, TypographyTimeVariation } from "@digi/arbetsformedlingen";

/** Helper for conditional rendering
   * Takes value and only renders element if value exists
  */
type InfoProps = { value?: string | null };

const Info = ({ value }: InfoProps) => {
  const v = value?.trim();
  if (!v) return null; 
  return (
    <div>
      {v}
    </div>
  );
};

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
              <Info value={job?.working_hours_type?.label} />
              <Info value={job?.duration?.label} />
              <Info value={job?.employment_type?.label} />
            </p>
          </DigiLayoutContainer>
          {/* TODO 
          * fix conditional rendering to only show this if there are must haves
          */}
          {!!job.must_have && (
            <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY}>
                <h3>Krav</h3>
                {!!job.must_have?.work_experiences?.length && (
                  <DigiLayoutContainer afVerticalPadding afNoGutter>
                    <h4>Arbetslivserfarenhet</h4>
                    <ul>
                      {job.must_have.work_experiences.map((we) => (
                        <li key={we.concept_id || we.label}>
                          {we.label}
                        </li>
                      ))}
                    </ul>
                  </DigiLayoutContainer>
                )}
                {!!job.must_have?.skills?.length && (
                  <DigiLayoutContainer afVerticalPadding afNoGutter>
                    <h4>Kompetenser</h4>
                    <ul>
                      {job.must_have.skills.map((s) => (
                        <li key={s.concept_id || s.label}>
                          {s.label}
                        </li>
                      ))}
                    </ul>
                  </DigiLayoutContainer>
                )}
                {!!job.must_have?.languages?.length && (
                  <DigiLayoutContainer afVerticalPadding afNoGutter>
                    <h4>Språk</h4>
                    <ul>
                      {job.must_have.languages.map((l) => (
                        <li key={l.concept_id || l.label}>
                          {l.label}
                        </li>
                      ))}
                    </ul>
                  </DigiLayoutContainer>
                )}
                {!!job.must_have?.education?.length && (
                  <DigiLayoutContainer afVerticalPadding afNoGutter>
                    <h4>Utbildning</h4>
                    <ul>
                      {job.must_have.education.map((e) => (
                        <li key={e.concept_id || e.label}>
                          {e.label}
                        </li>
                      ))}
                    </ul>
                  </DigiLayoutContainer>
                )}
            </DigiLayoutBlock>
          )}
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
              <Info value={job?.salary_description} />
              <Info value={job?.salary_type?.label} />
            </p>

            <h4>Anställningsvillkor</h4>
            <p>
              <Info value={job?.working_hours_type?.label} />
              <Info value={job?.duration?.label} />
              <Info value={job?.employment_type?.label} />
            </p>

            <h4>Arbetsplats</h4>
            <p>
              <span>Arbetplatsen ligger i </span>
              <Info value={job?.workplace_address.municipality} />
              <Info value={job?.workplace_address.region} />
            </p>
          </DigiLayoutContainer>
          <DigiLayoutContainer afVerticalPadding afNoGutter>
            <h3>Arbetsgivaren</h3>
            <p>
              <Info value={job?.employer.workplace} />
              <Info value={job.employer.name} />
              <DigiLinkExternal
                afHref={job.employer.url}
                afTarget="_blank"
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
