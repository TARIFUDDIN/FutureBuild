
import { checkUser } from "../../../../lib/checkUser";
import { getSavedJobSearches } from "../../../../actions/job-search";
import SavedJobSearchesView from "./_components/saved-job-view";


export const metadata = {
  title: "Saved Job Searches | AI Career Coach",
  description: "View and manage your saved job searches",
};
export default async function SavedJobSearchesPage() {
  const user = await checkUser();
  console.log("User after checkUser:", user);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
        <p className="text-muted-foreground mb-6">
          Please sign in to view your saved job searches.
        </p>
        <a href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
          Sign In
        </a>
      </div>
    );
  }
  
  // Ensure user session is passed to the component
  const { success, savedSearches, error } = await getSavedJobSearches();
  
  if (!success) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Error Loading Saved Searches</h1>
        <p className="text-muted-foreground">
          {error || "Something went wrong. Please try again later."}
        </p>
      </div>
    );
  }
  
  return <SavedJobSearchesView savedSearches={savedSearches} session={user} />;
}