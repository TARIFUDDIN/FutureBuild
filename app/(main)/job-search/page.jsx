// app/job-search/page.jsx
import { getUserOnboardingStatus } from "../../../actions/user";
import { redirect } from "next/navigation";
import JobSearchView from "./_components/job-search-view";

export default async function JobSearchPage() {
  console.log("🔍 Job Search Page: Starting onboarding check...");
  
  try {
    const result = await getUserOnboardingStatus();
    console.log("🔍 Job Search Page: Onboarding result:", result);
    
    // Handle potential errors
    if (result.error) {
      console.error("❌ Job Search Page: Error checking onboarding status:", result.error);
      // If there's an authentication error, redirect to sign in
      if (result.error === "Authentication required") {
        console.log("🔄 Job Search Page: Redirecting to sign-in due to auth error");
        redirect("/sign-in");
      }
      // For other errors, don't redirect - let the page load and handle gracefully
      console.log("⚠️ Job Search Page: Non-auth error, proceeding with caution");
    }
    
    if (!result.isOnboarded) {
      console.log("🔄 Job Search Page: User not onboarded, redirecting to onboarding");
      redirect("/onboarding");
    }

    console.log("✅ Job Search Page: User is onboarded, loading page");
    return (
      <div className="container mx-auto">
        <JobSearchView />
      </div>
    );
  } catch (error) {
    console.error("💥 Job Search Page: Unexpected error:", error);
    // If there's an unexpected error, redirect to onboarding as fallback
    redirect("/onboarding");
  }
}