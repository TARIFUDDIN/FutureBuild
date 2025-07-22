// app/(main)/onboarding/page.jsx
// FIXED: Removed dynamic server usage and headers

import { industries } from "../../../data/industries";
import OnboardingForm from "./_components/onboarding-form";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  // Remove the getUserOnboardingStatus check that causes static generation issues
  // Let the middleware and client-side handle the redirect logic
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <OnboardingForm industries={industries} />
      </div>
    </div>
  );
}