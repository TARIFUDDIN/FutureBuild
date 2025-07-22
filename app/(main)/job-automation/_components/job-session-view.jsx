"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  RefreshCw,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  createSimpleJobApplication,
  updateJobStatus,
  getSessionJobs
} from "../../../../actions/ai-job-automation";

const JobSessionView = ({ sessionId, initialJobs, session }) => {
  const [jobs, setJobs] = useState(initialJobs || []);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [sortBy, setSortBy] = useState("score");
  const [filterStatus, setFilterStatus] = useState("all");

  // Refresh jobs
  const handleRefreshJobs = async () => {
    setRefreshLoading(true);
    try {
      const result = await getSessionJobs(sessionId);
      if (result.success) {
        setJobs(result.jobs || []);
        toast.success(`Refreshed! Found ${result.jobs?.length || 0} jobs`);
      } else {
        toast.error("Failed to refresh jobs: " + result.error);
      }
    } catch (error) {
      toast.error("Error refreshing jobs");
    } finally {
      setRefreshLoading(false);
    }
  };

  const getJobPriorityColor = (priority) => {
    const colors = {
      HIGH: "text-red-600 bg-red-50 border-red-200",
      MEDIUM: "text-yellow-600 bg-yellow-50 border-yellow-200",
      LOW: "text-gray-600 bg-gray-50 border-gray-200",
    };
    return colors[priority] || colors.LOW;
  };

  const getStatusColor = (status) => {
    const colors = {
      DISCOVERED: "bg-blue-500",
      VIEWED: "bg-purple-500",
      APPLIED: "bg-green-500",
      REJECTED: "bg-red-500",
      ARCHIVED: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  // Simple application tracking (no automation)
  const handleSimpleApply = async (jobId) => {
    setApplicationLoading(true);
    try {
      const result = await createSimpleJobApplication(jobId);
      if (result.success) {
        toast.success("Application tracked successfully!");
        // Update job status in local state
        setJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { 
                ...job, 
                status: "APPLIED", 
                applications: [{ status: "APPLIED" }]
              }
            : job
        ));
      } else {
        toast.error("Failed to track application: " + result.error);
      }
    } catch (error) {
      toast.error("Error tracking application");
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleUpdateJobStatus = async (jobId, status) => {
    try {
      const result = await updateJobStatus(jobId, status);
      if (result.success) {
        toast.success(`Job status updated to ${status}`);
        // Update job status in local state
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status } : job
        ));
      } else {
        toast.error("Failed to update job status");
      }
    } catch (error) {
      toast.error("Error updating job status");
    }
  };

  const filteredAndSortedJobs = jobs
    .filter(job => filterStatus === "all" || job.status === filterStatus.toUpperCase())
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
        case "company":
          return (a.company || '').localeCompare(b.company || '');
        case "priority":
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case "date":
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        default:
          return 0;
      }
    });

  const JobCard = ({ job }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{job.title || 'Software Developer'}</h3>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`} />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Building2 className="h-4 w-4" />
              <span>{job.company || 'Company'}</span>
              {job.location && (
                <>
                  <MapPin className="h-4 w-4 ml-2" />
                  <span>{job.location}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              {job.postedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{job.postedAt}</span>
                </div>
              )}
              {job.salaryInfo && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{job.salaryInfo}</span>
                </div>
              )}
              {job.source && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{job.source}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {job.aiMatchScore && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{job.aiMatchScore}% match</span>
              </div>
            )}
            <Badge variant="outline" className={getJobPriorityColor(job.priority || 'LOW')}>
              {job.priority || 'LOW'}
            </Badge>
          </div>
        </div>

        {/* Skills Match */}
        {job.keySkillsMatch && job.keySkillsMatch.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Matching Skills:</div>
            <div className="flex flex-wrap gap-1">
              {job.keySkillsMatch.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.keySkillsMatch.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.keySkillsMatch.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{job.title} at {job.company}</DialogTitle>
                <DialogDescription>
                  AI Match Score: {job.aiMatchScore || 0}% • {job.location || 'Location not specified'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Job Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>Company: {job.company || 'Not specified'}</div>
                      <div>Location: {job.location || 'Not specified'}</div>
                      <div>Posted: {job.postedAt || 'Recently'}</div>
                      <div>Remote: {job.remote ? 'Yes' : 'No'}</div>
                      {job.salaryInfo && <div>Salary: {job.salaryInfo}</div>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Match Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>AI Match Score: {job.aiMatchScore || 0}%</div>
                      <div>Priority: {job.priority || 'LOW'}</div>
                      <div>Source: {job.source || 'Unknown'}</div>
                      <div>Status: {job.status || 'DISCOVERED'}</div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                {job.descriptionText && (
                  <div>
                    <h4 className="font-medium mb-2">Job Description</h4>
                    <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg max-h-60 overflow-y-auto">
                      {job.descriptionText.substring(0, 1000)}
                      {job.descriptionText.length > 1000 && "..."}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {job.keySkillsMatch && job.keySkillsMatch.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.keySkillsMatch.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  {job.status !== "APPLIED" && !job.applications?.length && (
                    <Button 
                      onClick={() => handleSimpleApply(job.id)}
                      disabled={applicationLoading}
                      className="flex items-center gap-2"
                    >
                      {applicationLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Track Application
                    </Button>
                  )}
                  
                  {job.applyUrl && (
                    <Button variant="outline" asChild>
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Apply Directly
                      </a>
                    </Button>
                  )}

                  {/* Status Update Buttons */}
                  <div className="flex gap-1">
                    {job.status !== "VIEWED" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateJobStatus(job.id, "VIEWED")}
                      >
                        Mark Viewed
                      </Button>
                    )}
                    {job.status !== "ARCHIVED" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateJobStatus(job.id, "ARCHIVED")}
                      >
                        Archive
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Quick Apply Button */}
          {job.status !== "APPLIED" && !job.applications?.length && (
            <Button 
              size="sm" 
              onClick={() => handleSimpleApply(job.id)}
              disabled={applicationLoading}
            >
              {applicationLoading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="h-3 w-3 mr-1" />
              )}
              Track Apply
            </Button>
          )}

          {(job.applications?.length > 0 || job.status === "APPLIED") && (
            <Badge variant="default" className="text-xs">
              Applied
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/job-automation">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sessions
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Job Search Results</h1>
            <p className="text-muted-foreground">
              {session?.sessionName} • Found {jobs.length} matching positions
            </p>
          </div>
        </div>
        
        {/* Refresh Button */}
        <Button 
          onClick={handleRefreshJobs}
          disabled={refreshLoading}
          variant="outline"
        >
          {refreshLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{jobs.length}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {jobs.filter(j => (j.aiMatchScore || 0) > 80).length}
            </div>
            <div className="text-sm text-muted-foreground">High Match</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {jobs.filter(j => j.status === 'APPLIED' || j.applications?.length > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {jobs.filter(j => j.remote).length}
            </div>
            <div className="text-sm text-muted-foreground">Remote Jobs</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1 text-sm bg-background"
          >
            <option value="score">AI Match Score</option>
            <option value="priority">Priority</option>
            <option value="company">Company</option>
            <option value="date">Date Found</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1 text-sm bg-background"
          >
            <option value="all">All Jobs</option>
            <option value="discovered">New</option>
            <option value="viewed">Viewed</option>
            <option value="applied">Applied</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedJobs.length} of {jobs.length} jobs
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedJobs.length === 0 && jobs.length > 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No jobs match your filters</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters to see more results
          </p>
          <Button variant="outline" onClick={() => {
            setSortBy("score");
            setFilterStatus("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* No Jobs State */}
      {jobs.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No jobs found yet</h3>
          <p className="text-muted-foreground mb-4">
            Jobs are being scraped in the background. This may take a few minutes.
          </p>
          <Button onClick={handleRefreshJobs} disabled={refreshLoading}>
            {refreshLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Check for Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobSessionView;