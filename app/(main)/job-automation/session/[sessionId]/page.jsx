// app/(main)/job-automation/session/[sessionId]/page.jsx
// SIMPLIFIED: Only job display and basic application tracking

import { getSessionJobs } from "../../../../../actions/ai-job-automation";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import JobSessionView from "./_components/job-session-view";

// Loading component for better UX
function JobSessionLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Status card skeleton */}
        <div className="p-6 border rounded-lg space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
        
        {/* Jobs loading skeleton */}
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 border rounded-lg space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function JobSessionPage({ params }) {
  const { sessionId } = await params;
  
  console.log('🔍 Loading job session page for:', sessionId);
  
  try {
    const result = await getSessionJobs(sessionId);
    
    if (!result.success) {
      console.error('❌ Failed to get session jobs:', result.error);
      
      // Handle specific error cases
      if (result.error === 'Authentication required') {
        console.log('🔒 User not authenticated, redirecting to sign-in');
        redirect("/sign-in");
        return;
      }
      
      if (result.error === 'Session not found or access denied') {
        console.log('🚫 Session not found or unauthorized access');
        redirect("/job-automation?error=session-not-found");
        return;
      }
      
      // General error - redirect to job automation with error
      redirect("/job-automation?error=session-load-failed");
      return;
    }

    console.log(`✅ Successfully loaded ${result.jobs?.length || 0} jobs for session ${sessionId}`);

    return (
      <div className="min-h-screen bg-background">
        {/* Purple gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-violet-900/10 to-indigo-900/20 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="container mx-auto py-6">
            <Suspense fallback={<JobSessionLoading />}>
              <JobSessionView 
                sessionId={sessionId}
                initialJobs={result.jobs || []}
                session={result.session || null}
              />
            </Suspense>
          </div>
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('💥 Critical error in JobSessionPage:', error);
    
    // Handle redirect errors (these are expected)
    if (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    // For other errors, redirect with error message
    redirect("/job-automation?error=critical-error");
  }
}