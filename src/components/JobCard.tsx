import type { Job } from "../models/Job";

type JobCardProps = {
    job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {

    return(
        <>
            <h2>{job.headline}</h2>
            <h3>{job.employer.name}</h3>
            <p>{job.occupation.label}</p>
            <p>Sista ansökningsdag: {job.application_deadline}</p>
            <p>Publicerat: {job.publication_date}</p>
        </>
    )
}
