import HeroSection from "../components/HeroSection";
import { JobData } from "../components/JobData";
import PopularJobsBlock from "../components/PopularJobsBlock";

export default function StartPage() {
  return (
    <>
      <HeroSection />
      <PopularJobsBlock />
      <JobData />
    </>
  );
}
