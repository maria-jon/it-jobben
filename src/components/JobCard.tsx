import type { Job } from "../models/Job";

import { 
    DigiButton,
    DigiIconHeartSolid,
    DigiInfoCardMulti, 
    DigiTypography, 
    DigiTypographyTime, 
} from "@digi/arbetsformedlingen-react";
import { 
    ButtonSize,
    ButtonVariation,
    InfoCardMultiHeadingLevel, 
    InfoCardMultiType, 
    TypographyTimeVariation, 
    TypographyVariation, 
} from "@digi/arbetsformedlingen";

import './JobCard.css';
import { useContext } from "react";
import { SavedJobsContext } from "../context/SavedJobsContext";

type JobCardProps = {
    job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
    
    const { addJob } = useContext(SavedJobsContext);

    return(
        <>
            <DigiInfoCardMulti
                afHeading={job.headline}
                afHeadingLevel={InfoCardMultiHeadingLevel.H2}
                afType={InfoCardMultiType.ENTRY}
                afLinkHref={`/ad/${job.id}`}
                style={
                    {position: "relative",} as React.CSSProperties}       
            >

            <DigiButton
                afSize={ButtonSize.MEDIUM}
                afVariation={ButtonVariation.PRIMARY}
                style={
                    {
                    position: "absolute",
                    top: "80px",
                    right: "80px",
                    } as React.CSSProperties
                }
                afFullWidth={false}
                onAfOnClick={() => addJob(job)}>
                Spara som favorit
            <DigiIconHeartSolid slot="icon-secondary" />
            </DigiButton>

            <DigiTypography
                    afVariation={TypographyVariation.SMALL}  
                >
                    <h3>{job.employer.name}</h3>
                    <p>{job.occupation.label}</p>
                    <p>
                        <span>Publicerad: </span> 
                        <DigiTypographyTime
                            afVariation={TypographyTimeVariation.PRETTY}
                            afLocale="sv-SE"
                            afDateTime={job.publication_date}
                        />
                    </p>
                    <p>
                        <span>Sista ansökningsdag: </span>
                        <DigiTypographyTime
                            afVariation={TypographyTimeVariation.PRETTY}
                            afLocale="sv-SE"
                            afDateTime={job.application_deadline}
                        />
                    </p>
                </DigiTypography>
            </DigiInfoCardMulti>
        </>
    )
}