import { useContext } from "react";
import { SavedJobsContext } from "../context/SavedJobsContext";
import { JobCard } from "../components/JobCard";
import type { Job } from "../models/Job";

export const SavedJobsPage = () => {
    const { savedJobs } = useContext(SavedJobsContext); 

    if (savedJobs.length === 0) 
        return <p>Du har inte sparat några jobb ännu</p>

return (
    <>
        {savedJobs.map((job: Job) => (
            <JobCard key={job.id} job={job} />
        ))}
    </>
)
}