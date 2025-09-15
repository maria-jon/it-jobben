import { Outlet } from "react-router"
import { Header } from "../fixtures/Header"
import { Footer } from "../fixtures/Footer"
import { useState } from "react";
import type { Job } from "../models/Job";
import { SavedJobsContext } from "../context/SavedJobsContext";

export const Layout = () => {
    const [savedJobs, setSavedJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("savedJobs");
    return saved ? JSON.parse(saved) : [];
    });

    const addJob = (job: Job) => {
        if (!savedJobs.find((j) => j.id === job.id)) {
        const newSavedJobs = [...savedJobs, job];
        setSavedJobs(newSavedJobs);                
        localStorage.setItem("savedJobs", JSON.stringify(newSavedJobs)); 
        }};

    const removeSavedJob = (job: Job) => {
        const newSavedJobs = (savedJobs.filter(j => j.id !== job.id));
        setSavedJobs(newSavedJobs);
        localStorage.setItem("savedJobs", JSON.stringify(newSavedJobs));
    }

    return (
        <>
        <header >
            <Header />
        </header>
        <main>
            <SavedJobsContext.Provider value={{savedJobs, addJob, removeSavedJob}}>
            <Outlet />
            </SavedJobsContext.Provider>
        </main>
        <footer>
            <Footer />
        </footer>
        </>
    )
}