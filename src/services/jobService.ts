const baseURL = import.meta.env.VITE_BASE_URL;
const jobURL = import.meta.env.VITE_JOB_URL;
const sortApplicationDate = import.meta.env.VITE_APPLICATIONDATE_ASC 
const sortPublishedDateAsc = import.meta.env.VITE_PUBL_DATE_ASC 
const sortPublishedDateDesc = import.meta.env.VITE_PUBL_DATE_DESC

import type { AfResponse } from "../models/AfResponse";
import type { Job } from "../models/Job";
import { get } from "./serviceBase";

export const getJobs = async () => {
    try {
        const data = await get<AfResponse>(baseURL);
        console.log(data.hits)
        return data.hits;
    } catch {
        throw new Error ("Ojdå, något blev tokitg!")
        
    }
}

export const getJobById = async (id: string) => {
    try {
    const data = await get<Job>(`${jobURL}${id}`);
    console.log(data)
    return data;
    } catch {
        throw new Error ("Kunde inte hitta den specifika jobbannonsen :(")
    }
}

export const sortJobsByApplicationDate = async () => {
    try {
        const data = await get<AfResponse>(sortApplicationDate);
        return data.hits;
    } catch {
        throw new Error ("Ojdå, något blev tokitg!")
    }
}

export const sortJobsByPublishedDateAsc = async () => {
    try {
        const data = await get<AfResponse>(sortPublishedDateAsc);
        return data.hits;
    } catch {
        throw new Error ("Ojdå, något blev tokitg!")
    }
}

export const sortJobsByPublishedDateDesc = async () => {
    try {
        const data = await get<AfResponse>(sortPublishedDateDesc);
        return data.hits;
    } catch {
        throw new Error ("Ojdå, något blev tokitg!")
    }
}