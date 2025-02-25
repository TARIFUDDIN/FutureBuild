// app/job-search/saved/page.jsx
import { auth } from "@/lib/auth";
import { getSavedJobSearches } from "@/app/actions/job-search";
import SavedJobSearchesView from "./_components/saved-job-searches-view";

export const metadata = {
  title: "Saved Job Searches | AI Career Coach",
  description: "View and manage your saved job searches",
};

export default async function SavedJobSearchesPage() {
  const session = await auth();
  
  if (!session?.user) {
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
  
  return <SavedJobSearchesView savedSearches={savedSearches} session={session} />;
}