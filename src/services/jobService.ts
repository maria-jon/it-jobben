const baseURL = import.meta.env.VITE_BASE_URL;
const jobURL = import.meta.env.VITE_JOB_URL;

import type { AfResponse } from "../models/AfResponse";
import type { Job } from "../models/Job";
import { get } from "./serviceBase";

export const getJobs = async (queryParams?: string): Promise<{hits: Job[]; total: number}> => {
    try {
        const joinChar = baseURL.includes("?") ? "&" : "?";
        const url = queryParams ? `${baseURL}${joinChar}${queryParams}` : baseURL;
        const data = await get<AfResponse>(url);
        console.log(data.hits)
        console.log(data.total)
        return {
            hits: data.hits, 
            total: data.total.value,
        }
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
