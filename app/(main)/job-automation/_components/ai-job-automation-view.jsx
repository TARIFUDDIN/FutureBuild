// app/(main)/job-automation/_components/ai-job-automation-view.jsx
"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Plus,
  Eye,
  Bot,
  ArrowRight,
  Loader2,
  RefreshCw,
  Building2,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Progress } from "../../../../components/ui/progress";
import { Textarea } from "../../../../components/ui/textarea";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  createJobSearchSessionAndRedirect,
  getJobSearchSessions,
  getJobApplications,
} from "../../../../actions/ai-job-automation";

const AIJobAutomationView = ({ initialAnalytics, initialSessions = [], initialApplications = [] }) => {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [sessions, setSessions] = useState(initialSessions);
  const [applications, setApplications] = useState(initialApplications);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewSearchOpen, setIsNewSearchOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadSessions();
    loadApplications();
  }, []);

  const loadSessions = async () => {
    try {
      const result = await getJobSearchSessions();
      if (result.success) {
        setSessions(result.sessions || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const result = await getJobApplications();
      if (result.success) {
        setApplications(result.applications || []);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadSessions(), loadApplications()]);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // New search function - simplified for job scraping only
  const handleNewSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🚀 Starting job search:', searchQuery);
      
      // Show loading toast
      const loadingToast = toast.loading("Starting job search...", {
        description: "Scraping real jobs from multiple sources"
      });

      // This will create session, start real job scraping, and redirect automatically
      await createJobSearchSessionAndRedirect(searchQuery);
      
      // Code won't reach here due to redirect, but just in case:
      toast.dismiss(loadingToast);
      toast.success("Job search session created! Redirecting...");
      
    } catch (error) {
      setIsLoading(false);
      
      // Handle expected redirect properly
      if (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT')) {
        // This is expected - redirect is happening
        return;
      }
      
      console.error('Search error:', error);
      toast.error('Error starting job search: ' + error.message);
    }
  };

  const handleViewSession = (sessionId) => {
    console.log('🔍 Navigating to session:', sessionId);
    window.location.href = `/job-automation/session/${sessionId}`;
  };

  const StatCard = ({ title, value, icon: Icon, color = "text-primary", change = null }) => (
    <Card className="card-purple">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="purple-gradient-subtle border-purple-200 dark:border-purple-800">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold heading-gradient">Job Search Engine</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Real job scraping from multiple sources with intelligent matching
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Search className="h-4 w-4" />
                  Multi-Source Job Scraping
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  AI Match Scoring
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Real Job Data
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Dialog open={isNewSearchOpen} onOpenChange={setIsNewSearchOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="btn-purple-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Job Search
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="heading-gradient">Start New Job Search</DialogTitle>
                    <DialogDescription>
                      Describe what kind of job you're looking for and we'll scrape real jobs from multiple sources!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Job Search Query</label>
                      <Textarea
                        placeholder="e.g., I want fullstack developer jobs in India with React and Node.js"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="purple-gradient-subtle p-4 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">🔍 What we'll do:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Scrape REAL jobs from Adzuna, Reed, JSearch APIs</li>
                        <li>• Parse your requirements intelligently</li>
                        <li>• Score job matches based on your criteria</li>
                        <li>• Show company information and job details</li>
                        <li>• Allow easy job application tracking</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={handleNewSearch} 
                      disabled={isLoading || !searchQuery.trim()}
                      className="w-full btn-purple-primary"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Starting Job Search...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Start Job Search
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Search Sessions"
          value={analytics?.totalSessions || 0}
          icon={Search}
          color="text-blue-400"
          change="Active searches"
        />
        <StatCard
          title="Jobs Found"
          value={analytics?.totalJobs || 0}
          icon={TrendingUp}
          color="text-green-400"
          change="From real sources"
        />
        <StatCard
          title="Applications"
          value={analytics?.totalApplications || 0}
          icon={CheckCircle}
          color="text-purple-400"
          change="Tracked applications"
        />
        <StatCard
          title="High Matches"
          value={analytics?.highMatchJobs || 0}
          icon={BarChart3}
          color="text-orange-400"
          change="80%+ match score"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Job Search Sessions</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Job Search Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Job Search Sessions</h3>
            <Button variant="outline" size="sm" onClick={loadSessions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {sessions.length === 0 ? (
              <Card className="card-purple">
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No job searches yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first job search to see results here
                  </p>
                  <Button onClick={() => setIsNewSearchOpen(true)} className="btn-purple-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Start First Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              sessions.map((session) => (
                <Card key={session.id} className="card-purple hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{session.sessionName}</h4>
                          <Badge variant="outline">{session.jobTitle}</Badge>
                          {session.location && (
                            <Badge variant="secondary">{session.location}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {session.searchQuery}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {session._count?.jobs || 0} jobs
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {session._count?.applications || 0} applications
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewSession(session.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Jobs
                        </Button>
                        {session.isActive && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Job Applications</h3>
            <Button variant="outline" size="sm" onClick={loadApplications}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {applications.length === 0 ? (
              <Card className="card-purple">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground">
                    Applications will appear here when you start applying to jobs
                  </p>
                </CardContent>
              </Card>
            ) : (
              applications.map((application) => (
                <Card key={application.id} className="card-purple hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{application.job.title}</h4>
                          <Badge variant="outline">{application.job.company}</Badge>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            {application.status === 'APPLIED' ? 'Applied' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{application.job.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            {application.job.aiMatchScore || 'N/A'}% match
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Applied {new Date(application.appliedAt || application.createdAt).toLocaleDateString()}
                        </div>
                        {application.applicationUrl && (
                          <Button variant="outline" size="sm" className="mt-2" asChild>
                            <a href={application.applicationUrl} target="_blank" rel="noopener noreferrer">
                              View Application
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-purple">
              <CardHeader>
                <CardTitle>Search Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Sessions</span>
                    <span>{analytics?.totalSessions || 0}</span>
                  </div>
                  <Progress value={Math.min((analytics?.totalSessions || 0) * 10, 100)} />
                  
                  <div className="flex justify-between text-sm">
                    <span>Jobs Found</span>
                    <span>{analytics?.totalJobs || 0}</span>
                  </div>
                  <Progress value={Math.min((analytics?.totalJobs || 0) / 10, 100)} />
                  
                  <div className="flex justify-between text-sm">
                    <span>Applications Tracked</span>
                    <span>{analytics?.totalApplications || 0}</span>
                  </div>
                  <Progress value={(analytics?.totalApplications || 0) / Math.max(analytics?.totalJobs || 1, 1) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card className="card-purple">
              <CardHeader>
                <CardTitle>Job Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Match Jobs</span>
                    <span className="text-lg font-semibold text-green-400">
                      {analytics?.highMatchJobs || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Applied Jobs</span>
                    <span className="text-lg font-semibold text-blue-400">
                      {analytics?.appliedJobs || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Application Rate</span>
                    <span className="text-lg font-semibold text-purple-400">
                      {analytics?.applicationRate || 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-purple">
            <CardHeader>
              <CardTitle>Job Scraping Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {analytics?.averageJobsPerSession || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Jobs per Search</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {analytics?.applicationRate || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Application Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round((analytics?.highMatchJobs || 0) / Math.max(analytics?.totalJobs || 1, 1) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">High Match Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIJobAutomationView;