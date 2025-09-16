import { useContext } from "react";
import { SavedJobsContext } from "../context/SavedJobsContext";
import { JobCard } from "../components/JobCard";
import type { Job } from "../models/Job";
import { TypographyHeadingJumboLevel, TypographyHeadingJumboVariation } from "@digi/arbetsformedlingen";
import { DigiLayoutBlock, DigiLayoutContainer, DigiTypography, DigiTypographyHeadingJumbo } from "@digi/arbetsformedlingen-react";

export const SavedJobsPage = () => {
    const { savedJobs } = useContext(SavedJobsContext); 

return (
    <>
        <DigiLayoutBlock afVerticalPadding afMarginTop>
          <DigiTypography>
            <DigiTypographyHeadingJumbo
              afText="Här ser du dina sparade jobb"
              afLevel={TypographyHeadingJumboLevel.H1}
              afVariation={TypographyHeadingJumboVariation.PRIMARY}
            />
            <DigiLayoutContainer afVerticalPadding afNoGutter>
              <p>
                Om du hittar ett jobb som känns intressant eller som du vill spara 
                till senare kan du favoritmarkera det så kommer det upp här på din sida. 
              </p>
              <p>
                Har du inte sparat några jobb ännu kan du gå till saidan "Alla jobb" 
                där du kan bärja leta efter ditt nästa drömjobb!
              </p>
            </DigiLayoutContainer>
          </DigiTypography>
        </DigiLayoutBlock>

        {savedJobs.length === 0 
            ? (
            <DigiLayoutBlock
                afVerticalPadding
                afMarginTop
                afMarginBottom
                aria-labelledby="popular-dev-heading"
                >
                <DigiTypography>
                    <h2 id="popular-dev-heading">Du har inte sparat några jobb ännu</h2>
                </DigiTypography>
            </DigiLayoutBlock>
            ) : ( 
                <>
                    <DigiLayoutBlock afVerticalPadding afMarginTop>
                        <DigiTypography>
                            <h2 id="popular-dev-heading">Dina sparade jobb</h2>
                        </DigiTypography>
                    </DigiLayoutBlock>

                    {savedJobs.map((job: Job) => (
                        <JobCard key={job.id} job={job} buttonAction="remove" />
                    ))}
                </>
            )
        }
    </>
)}