// app/(main)/job-automation/page.jsx
// UPDATED: Ensures proper redirection to job session with real jobs

import { getJobSearchSessions, getJobApplications } from "../../../actions/ai-job-automation";
import AIJobAutomationView from "./_components/ai-job-automation-view";

export default async function JobAutomationPage({ searchParams }) {
  try {
    // Check for error from redirect
    const error = searchParams?.error;
    
    // Get initial data
    const [sessionsResult, applicationsResult] = await Promise.all([
      getJobSearchSessions(),
      getJobApplications()
    ]);

    const sessions = sessionsResult.success ? sessionsResult.sessions : [];
    const applications = applicationsResult.success ? applicationsResult.applications : [];

    // Enhanced analytics calculation
    const analytics = {
      totalSessions: sessions.length,
      totalJobs: sessions.reduce((acc, session) => acc + (session._count?.jobs || 0), 0),
      totalApplications: applications.length,
      responseRate: applications.length > 0 ? Math.round((applications.filter(app => app.status === 'REPLIED').length / applications.length) * 100) : 0,
      interviewsScheduled: applications.filter(app => app.status === 'INTERVIEW_REQUESTED' || app.status === 'INTERVIEW_SCHEDULED').length,
      emailsSent: applications.filter(app => app.status === 'SENT' || app.status === 'DELIVERED' || app.status === 'OPENED' || app.status === 'REPLIED').length,
      emailsOpened: applications.filter(app => app.status === 'OPENED' || app.status === 'REPLIED').length,
      emailsReplied: applications.filter(app => app.status === 'REPLIED').length,
      activeApplications: applications.filter(app => 
        !['REJECTED', 'FAILED', 'COMPLETED'].includes(app.status)
      ).length,
      successRate: applications.length > 0 ? Math.round((applications.filter(app => 
        ['REPLIED', 'INTERVIEW_REQUESTED', 'INTERVIEW_SCHEDULED'].includes(app.status)
      ).length / applications.length) * 100) : 0,
      
      // Additional analytics for better insights
      highMatchJobs: sessions.reduce((acc, session) => {
        const sessionJobs = session._count?.jobs || 0;
        // Estimate high match jobs (80%+ match score)
        return acc + Math.floor(sessionJobs * 0.3); // Assume 30% are high match
      }, 0),
      pendingApplications: applications.filter(app => 
        ['PENDING', 'RESUME_GENERATING', 'EMAIL_FINDING', 'EMAIL_GENERATING', 'EMAIL_SENDING'].includes(app.status)
      ).length,
      applicationRate: sessions.reduce((acc, session) => acc + (session._count?.jobs || 0), 0) > 0 
        ? Math.round((applications.length / sessions.reduce((acc, session) => acc + (session._count?.jobs || 0), 0)) * 100) 
        : 0
    };

    return (
      <div className="min-h-screen bg-background">
        {/* Purple gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-violet-900/10 to-indigo-900/20 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold heading-gradient mb-2">
                AI Job Automation Center
              </h1>
              <p className="text-muted-foreground text-lg">
                Automate your entire job search process with AI-powered applications and real job scraping
              </p>
              
              {/* Show error message if session creation failed */}
              {error === 'session-creation-failed' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">
                    Failed to create job search session. Please try again or contact support if the issue persists.
                  </p>
                </div>
              )}
            </div>
            
            {/* Pass enhanced data to the component */}
            <AIJobAutomationView 
              initialAnalytics={analytics} 
              initialSessions={sessions}
              initialApplications={applications}
              error={error}
            />
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading job automation data:', error);
    
    // Fallback analytics if data loading fails
    const fallbackAnalytics = {
      totalSessions: 0,
      totalJobs: 0,
      totalApplications: 0,
      responseRate: 0,
      interviewsScheduled: 0,
      emailsSent: 0,
      emailsOpened: 0,
      emailsReplied: 0,
      activeApplications: 0,
      successRate: 0,
      highMatchJobs: 0,
      pendingApplications: 0,
      applicationRate: 0
    };

    return (
      <div className="min-h-screen bg-background">
        {/* Purple gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-violet-900/10 to-indigo-900/20 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold heading-gradient mb-2">
                AI Job Automation Center
              </h1>
              <p className="text-muted-foreground text-lg">
                Automate your entire job search process with AI-powered applications
              </p>
              
              {/* Show error message */}
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  Unable to load job automation data. Please refresh the page or try again later.
                </p>
              </div>
            </div>
            
            <AIJobAutomationView 
              initialAnalytics={fallbackAnalytics} 
              initialSessions={[]}
              initialApplications={[]}
              error="data-loading-failed"
            />
          </div>
        </div>
      </div>
    );
  }
}