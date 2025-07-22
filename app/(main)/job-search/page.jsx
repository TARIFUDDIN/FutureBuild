import { redirect } from "next/navigation";
import JobSearchView from "./_components/job-search-view";

// Force dynamic rendering to avoid prerender issues
export const dynamic = 'force-dynamic';

export default async function JobSearchPage() {
  console.log("🔍 Job Search: Loading job search page (auth handled by middleware)");
  
  // Since middleware already handles authentication and onboarding redirects,
  // we can directly load the page content
  return (
    <div className="container mx-auto">
      <JobSearchView />
    </div>
  );
}