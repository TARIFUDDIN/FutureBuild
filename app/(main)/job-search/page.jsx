// app/job-search/page.jsx
import { getUserOnboardingStatus } from "../../../actions/user";
import { redirect } from "next/navigation";
import JobSearchView from "./_components/job-search-view";

export default async function JobSearchPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  
  return (
    <div className="container mx-auto">
      <JobSearchView />
    </div>
  );
}