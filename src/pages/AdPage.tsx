import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../services/jobService";
import type { Job } from "../models/Job";

import { DigiInfoCard, DigiLayoutBlock, DigiLayoutContainer, DigiLink, DigiLinkExternal, DigiTypography, DigiTypographyHeadingJumbo, DigiTypographyMeta, DigiTypographyTime } from "@digi/arbetsformedlingen-react";
import { InfoCardBorderPosition, InfoCardHeadingLevel, InfoCardType, InfoCardVariation, LayoutBlockVariation, TypographyHeadingJumboLevel, TypographyHeadingJumboVariation, TypographyMetaVariation, TypographyTimeVariation } from "@digi/arbetsformedlingen";

import './AdPage.css';

export default function AdPage() {
  const navigate = useNavigate();

  // Find ID
  const { id: adId } = useParams<{ id: string }>();
  const id = adId ? decodeURIComponent(adId).trim() : "";

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setJob(null);
      setError("Kan inte hitta annons"); 
      setLoading(false); 
      return; 
    };

    setLoading(true);
    setError(null);
    setJob(null); // resets job when reloading page

    (async () => {
      // Show if cached 
      try {
        const cached = localStorage.getItem(`job:${id}`);
        if (cached && !cancelled) setJob(JSON.parse(cached) as Job);
      } catch (e) {
        console.warn("No cache", e);
      }

      // Fetch from API
      try {
        const fresh = await getJobById(id);
        if (!fresh) throw new Error("NOT_FOUND");
        if (!cancelled) {
          setError(null);
          setJob(fresh);
          localStorage.setItem(`job:${id}`, JSON.stringify(fresh));
        }
      } catch {
        if (!cancelled) {
          setJob(null);
          setError(`Kan inte hitta annons med id ${id}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p>Laddar…</p>;
  if (error || !job) {
    return (
      <>
        <DigiLink
          afHref="/"
          afOverrideLink
          afAriaLabel="Gå tillbaka"
          onAfOnClick={() => navigate(-1)}
        >
          ← Tillbaka
        </DigiLink>
        <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY}>
          <DigiInfoCard
            afType={InfoCardType.RELATED}
            afHeading="Kunde inte visa annonsen"
            afBorderPosition={InfoCardBorderPosition.LEFT}
            afVariation={InfoCardVariation.PRIMARY}
          >
            <p role="alert">{error}</p>
          </DigiInfoCard>
        </DigiLayoutBlock>
      </>
    )
  }
  if (!job) return null;

  // Arrays for must-haves
  const we = job?.must_have?.work_experiences ?? [];
  const skills = job?.must_have?.skills ?? [];
  const languages = job?.must_have?.languages ?? [];
  const education = job?.must_have?.education ?? [];

  // Booleans for conditional render
  const hasWE = Array.isArray(we) && we.length > 0;
  const hasSkills = Array.isArray(skills) && skills.length > 0;
  const hasLanguages = Array.isArray(languages) && languages.length > 0;
  const hasEducation = Array.isArray(education) && education.length > 0;

  const hasAnyMust = hasWE || hasSkills || hasLanguages || hasEducation;

  type ApplicationDetails = Job["application_details"];
  type AppItem = {
    key: keyof ApplicationDetails;
    label: string;
    description?: string;
    value: string;
    href?: string; 
  };

  /** Helper for application details
   * create conditional rendering to show correct information depending on application_details
  */
  const decideApplicationDetails = (a?: ApplicationDetails): AppItem | undefined => {
    if (!a) return;

    const clean = (v?: string | null) => (typeof v === "string" ? v.trim() : "");
    const order: (keyof ApplicationDetails)[] = ["url", "email", "information", "other", "reference", "via_af"];

    for (const key of order) {
      const val = a[key];

      if (typeof val === "string") {
        const v = clean(val);
        if (!v) continue;

        if (key === "email") return {key, label: `${v}`, description: "Maila din ansökan till", value: v, href: `mailto:${v}` };
        if (key === "url")   return { key, label: "Ansök här", description: "Ansök via arbetsgivarens webbplats", value: v, href: v };

        const label = 
        key === "information" ? "Ansökningsinfo" :
        key === "other"       ? "Övrigt" :
        /* reference */         "Referens";

        return { key, label, value: v };
      }

      if (key === "via_af" && val === true) {
        return { key, label: "Via Arbetsförmedlingen", description: "Ansök via AF-portalen", value: "Ansök via AF-portalen" };
      }
    }
    return;
  }
  const item = decideApplicationDetails(job.application_details);

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
          <DigiLayoutContainer afVerticalPadding afNoGutter>
          <DigiTypographyHeadingJumbo
            afText={job.headline}
            afLevel={TypographyHeadingJumboLevel.H1}
            afVariation={TypographyHeadingJumboVariation.PRIMARY}
          />
            <h2>{job.employer.name}</h2>
            <DigiTypographyMeta afVariation={TypographyMetaVariation.PRIMARY}>
              <p>
              {job.occupation.label}
              </p>
              <p slot="secondary">
                {job.workplace_address.municipality || job.workplace_address.country}
              </p>
            </DigiTypographyMeta>
          </DigiLayoutContainer>
          <DigiLayoutContainer afVerticalPadding afNoGutter>
            {job?.working_hours_type?.label && (
              <p>{job.working_hours_type.label}</p>
            )}
            {job?.duration?.label && (
              <p>{job.duration.label}</p>
            )}
            {job?.employment_type?.label && (
              <p>{job.employment_type.label}</p>
            )}
          </DigiLayoutContainer>
          {/** TODO 
           * fix conditional rendering to only show this if there are must haves
          */}
          {hasAnyMust && (
            <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY}>
                <h3>Krav</h3>
                {hasWE ? (
                  <DigiLayoutContainer afVerticalPadding afNoGutter>
                    <h4>Arbetslivserfarenhet</h4>
                    <ul>
                      {we.map(we => (
                        <li key={we.concept_id}>{we.label}</li>
                      ))}
                    </ul>
                  </DigiLayoutContainer>
                ) : null}

                {hasSkills && (
                  <DigiLayoutContainer afVerticalPadding afNoGutter>
                    <h4>Kompetenser</h4>
                    <ul>
                      {skills.map((s) => (
                        <li key={s.concept_id || s.label}>
                          {s.label}
                        </li>
                      ))}
                    </ul>
                  </DigiLayoutContainer>
                )}
                {hasLanguages && (
                  <DigiLayoutContainer afVerticalPadding afNoGutter>
                    <h4>Språk</h4>
                    <ul>
                      {languages.map((l) => (
                        <li key={l.concept_id || l.label}>
                          {l.label}
                        </li>
                      ))}
                    </ul>
                  </DigiLayoutContainer>
                )}
                {hasEducation && (
                  <DigiLayoutContainer afVerticalPadding afNoGutter>
                    <h4>Utbildning</h4>
                    <ul>
                      {education.map((e) => (
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
            <DigiLayoutContainer afNoGutter>
              <h4>Lön</h4>
              {job?.salary_description && (
                <p>{job?.salary_description}</p>
              )}
              {job?.salary_type?.label && (
                <p>{job?.salary_type.label}</p>
              )}
            </DigiLayoutContainer>

            <DigiLayoutContainer afNoGutter>
              <h4>Anställningsvillkor</h4>
              {job?.working_hours_type?.label && (
                <p>{job.working_hours_type.label}</p>
              )}
              {job?.duration?.label && (
                <p>{job.duration.label}</p>
              )}
              {job?.employment_type?.label && (
                <p>{job.employment_type.label}</p>
              )}
            </DigiLayoutContainer>

            <DigiLayoutContainer afNoGutter>
              <h4>Arbetsplats</h4>
              {job?.workplace_address?.municipality && (
                <p>{job.workplace_address.municipality}</p>
              )}
              {job?.workplace_address?.region && (
                <p>{job.workplace_address.region}</p>
              )}
              {job?.workplace_address?.country && (
                <p>{job.workplace_address.country}</p>
              )}
            </DigiLayoutContainer>
          </DigiLayoutContainer>

          <DigiLayoutContainer afVerticalPadding afNoGutter>
            <h3>Arbetsgivaren</h3>
            {job?.employer?.workplace && (
              <p>{job.employer.workplace}</p>
            )}
            {job?.employer?.name && (
              <p>{job.employer.name}</p>
            )}
            <DigiLinkExternal
              afHref={job.employer.url}
              afTarget="_blank"
            >
              {job.employer.url}
            </DigiLinkExternal>
          </DigiLayoutContainer>

          <DigiLayoutContainer afVerticalPadding afNoGutter>
            <DigiInfoCard
              afHeading="Sök jobbet"
              afHeadingLevel={InfoCardHeadingLevel.H2}
              afType={InfoCardType.RELATED}
              afLinkHref={item?.href}	
              afLinkText={item?.label}	
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
              <p>{item?.description}</p>
            </DigiInfoCard>
          </DigiLayoutContainer>
        </DigiTypography>
      </DigiLayoutBlock>
    </>
  );
}
