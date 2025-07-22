import { getUserOnboardingStatus } from "../../../actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";
import { getIndustryInsights } from "../../../actions/dashboard";

// Force dynamic rendering to avoid prerender issues
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  try {
    console.log("🏠 Dashboard: Checking onboarding status...");
    
    const result = await getUserOnboardingStatus();
    
    // Handle authentication errors
    if (result.error === "Authentication required") {
      console.log("🔒 Dashboard: User not authenticated, redirecting to sign-in");
      redirect("/sign-in");
    }
    
    // Handle user not found
    if (result.error === "User not found") {
      console.log("👤 Dashboard: User not found in database, redirecting to onboarding");
      redirect("/onboarding");
    }
    
    // Check if user completed onboarding
    if (!result.isOnboarded) {
      console.log("📋 Dashboard: User not onboarded, redirecting to onboarding");
      redirect("/onboarding");
    }

    console.log("✅ Dashboard: User is onboarded, loading dashboard");
    
    // Get industry insights
    const insights = await getIndustryInsights();
    
    return (
      <div className="container mx-auto">
        <DashboardView insights={insights} />
      </div>
    );
    
  } catch (error) {
    console.error("💥 Dashboard: Unexpected error:", error);
    
    // Handle redirect errors (these are expected)
    if (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    // For other errors, redirect to onboarding as fallback
    redirect("/onboarding");
  }
}