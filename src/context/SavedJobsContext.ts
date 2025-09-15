import { createContext } from "react";
import type { Job } from "../models/Job";

export type SavedJobsContextType = {
  savedJobs: Job[];
  addJob: (job: Job) => void;
//   removeJob: (id: number) => void;
};

export const SavedJobsContext = createContext<SavedJobsContextType> ({
  savedJobs: [],
  addJob: () => {},
});




