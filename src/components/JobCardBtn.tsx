import { ButtonSize, ButtonVariation } from "@digi/arbetsformedlingen"
import { DigiButton, DigiIconHeartSolid, DigiIconTrash } from "@digi/arbetsformedlingen-react"
import type { Job } from "../models/Job";
import { useContext } from "react";
import { SavedJobsContext } from "../context/SavedJobsContext";

type JobCardBtnProps = {
    job: Job;
    action: "save" | "remove";
}

export const JobCardBtn = ({job, action}: JobCardBtnProps) => {
    const { addJob, removeSavedJob } = useContext(SavedJobsContext);

    const handleClick = () => {
        if (action === "save") addJob(job);
        if (action === "remove") removeSavedJob(job);
    }

    const text = action === "save" ? "Spara som favorit" : "Ta bort";
    const Icon = action === "save" ? DigiIconHeartSolid : DigiIconTrash;

    return (
    <>
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
        onAfOnClick={handleClick}>
        {text}
        <Icon slot="icon-secondary" />
    </DigiButton>
    </>
    )
}