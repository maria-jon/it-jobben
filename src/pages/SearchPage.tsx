import { useEffect, useState } from "react";
import { JobCard } from "../components/JobCard";
import type { Job } from "../models/Job";
import { getJobs, sortJobsByApplicationDate, sortJobsByPublishedDateAsc, sortJobsByPublishedDateDesc } from "../services/jobService";
import { DigiContextMenu } from "@digi/arbetsformedlingen-react";

export default function SearchPage() {
  const [jobs, setJobs] = useState<Job[]>(
    JSON.parse(localStorage.getItem("jobs") || "[]"),
  );
  
  useEffect(() => {
    const getData = async () => {
      const jobs = await getJobs();
      setJobs(jobs);
    };

    if (jobs.length > 0) return;

    getData();
  });

const handleSortApplicationClick = async () => {
    try {
      const data = await sortJobsByApplicationDate();
      setJobs(data); 
    } catch (err) {
      console.error("Kunde inte hämta sorterade jobb", err);
    }
  };

const handleSortPublishedClickAsc = async () => {
    try {
      const data = await sortJobsByPublishedDateAsc();
      setJobs(data); 
    } catch (err) {
      console.error("Kunde inte hämta sorterade jobb", err);
    }
  };

const handleSortPublishedClickDesc = async () => {
    try {
      const data = await sortJobsByPublishedDateDesc();
      setJobs(data); 
    } catch (err) {
      console.error("Kunde inte hämta sorterade jobb", err);
    }
  };

const menuItems = [
    { id: 0, title: "Ansökningsdatum", onClick: handleSortApplicationClick},
    { id: 1, title: "Publiceringsdatum (äldst först)", onClick: handleSortPublishedClickAsc},
    { id: 2, title: "Publiceringsdatum (nyast först)", onClick: handleSortPublishedClickDesc },
  ];

  return (
    <>
      <h1>Sök jobb</h1>

      <DigiContextMenu
        afTitle="Sortera efter"
        afMenuItems={menuItems}
        onAfChangeItem={(e: CustomEvent) => {
          const clickedItem = e.detail.item;
          clickedItem.onClick?.(); 
        }}
        >
      </DigiContextMenu>

      {jobs.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
    </>
  );
}
