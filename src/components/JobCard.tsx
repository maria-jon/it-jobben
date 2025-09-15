import type { Job } from "../models/Job";

import { 
    DigiInfoCardMulti, 
    DigiTypography, 
    DigiTypographyTime, 
} from "@digi/arbetsformedlingen-react";
import { 
    InfoCardMultiHeadingLevel, 
    InfoCardMultiType, 
    TypographyTimeVariation, 
    TypographyVariation, 
} from "@digi/arbetsformedlingen";

import './JobCard.css';
import { JobCardBtn } from "./JobCardBtn";

type JobCardProps = {
    job: Job;
    buttonAction: "save" | "remove";
}

export const JobCard = ({ job, buttonAction }: JobCardProps) => {

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

            <JobCardBtn job={job} action={buttonAction} />

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