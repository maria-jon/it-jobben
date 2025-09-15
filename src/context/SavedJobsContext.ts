import { createContext } from "react";
import type { Job } from "../models/Job";

export type SavedJobsContextType = {
  savedJobs: Job[];
  addJob: (job: Job) => void;
  removeSavedJob: (job: Job) => void;
};

export const SavedJobsContext = createContext<SavedJobsContextType> ({
  savedJobs: [],
  addJob: () => {},
  removeSavedJob: () => {},
});




