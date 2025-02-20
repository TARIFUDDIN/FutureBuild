import { redirect } from "next/navigation";
import { industries } from "../../../data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "../../../actions/user";

export default async function OnboardingPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (isOnboarded) {
    redirect("/dashboard"); 
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <OnboardingForm industries={industries} />
    </main>
  );
}
