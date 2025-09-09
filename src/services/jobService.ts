const baseURL = import.meta.env.VITE_BASE_URL;
import type { AfResponse } from "../models/AfResponse";
import { get } from "./serviceBase";

export const getJobs = async () => {
    try {
        const data = await get <AfResponse>(baseURL);
        console.log(data.hits)
        return data.hits;
    } catch {
        console.log("hej hej")
        throw new Error ("Ojdå, något blev tokitg!")
        
    }
}