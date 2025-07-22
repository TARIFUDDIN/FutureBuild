import { getUserOnboardingStatus } from "../../../actions/user";
import { redirect } from "next/navigation";
import JobSearchView from "./_components/job-search-view";

// Force dynamic rendering to avoid prerender issues
export const dynamic = 'force-dynamic';

export default async function JobSearchPage() {
  try {
    console.log("🔍 Job Search: Checking onboarding status...");
    
    const result = await getUserOnboardingStatus();
    
    // Handle authentication errors
    if (result.error === "Authentication required") {
      console.log("🔒 Job Search: User not authenticated, redirecting to sign-in");
      redirect("/sign-in");
    }
    
    // Handle user not found
    if (result.error === "User not found") {
      console.log("👤 Job Search: User not found in database, redirecting to onboarding");
      redirect("/onboarding");
    }
    
    // Check if user completed onboarding
    if (!result.isOnboarded) {
      console.log("📋 Job Search: User not onboarded, redirecting to onboarding");
      redirect("/onboarding");
    }

    console.log("✅ Job Search: User is onboarded, loading job search");
    
    return (
      <div className="container mx-auto">
        <JobSearchView />
      </div>
    );
    
  } catch (error) {
    console.error("💥 Job Search: Unexpected error:", error);
    
    // Handle redirect errors (these are expected)
    if (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    // For other errors, redirect to onboarding as fallback
    redirect("/onboarding");
  }
}