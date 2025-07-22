import { getUserOnboardingStatus } from "../../../actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";
import { getIndustryInsights } from "../../../actions/dashboard";

// Force dynamic rendering to avoid prerender issues
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  console.log("🏠 Dashboard: Checking onboarding status...");
  
  try {
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
      <div className="container mx-auto py-8">
        <DashboardView insights={insights} />
      </div>
    );
    
  } catch (error) {
    // Handle expected redirect errors (these are normal and not actually errors)
    if (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT')) {
      console.log("🔄 Dashboard: Performing redirect (normal behavior)");
      throw error; // Re-throw to allow redirect to work
    }
    
    // Only log truly unexpected errors
    console.error("💥 Dashboard: Actual unexpected error:", error.message);
    redirect("/onboarding");
  }
}