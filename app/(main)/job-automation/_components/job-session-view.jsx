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
  Mail,
  FileText,
  ExternalLink,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Send,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Progress } from "../../../../components/ui/progress";
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
  findJobContacts,
  createJobApplication,
  applyToJobWithAI,
  scrapeLinkedInJobs
} from "../../../../actions/ai-job-automation";

const JobSessionView = ({ sessionId, initialJobs }) => {
  const [jobs, setJobs] = useState(initialJobs || []);
  const [selectedJob, setSelectedJob] = useState(null);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [scrapingLoading, setScrapingLoading] = useState(false);
  const [sortBy, setSortBy] = useState("score");
  const [filterStatus, setFilterStatus] = useState("all");

  // Add refresh functionality
  const handleRefreshJobs = async () => {
    setScrapingLoading(true);
    try {
      const result = await scrapeLinkedInJobs(sessionId, 50);
      if (result.success) {
        setJobs(result.jobs);
        toast.success(`Refreshed! Found ${result.jobs.length} jobs`);
      } else {
        toast.error("Failed to refresh jobs: " + result.error);
      }
    } catch (error) {
      toast.error("Error refreshing jobs");
    } finally {
      setScrapingLoading(false);
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
      ANALYZING: "bg-yellow-500",
      MATCHED: "bg-green-500",
      APPLIED: "bg-purple-500",
      REJECTED: "bg-red-500",
      INTERVIEW_SCHEDULED: "bg-orange-500",
      ARCHIVED: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const handleFindContacts = async (jobId) => {
    setContactsLoading(true);
    try {
      const result = await findJobContacts(jobId);
      if (result.success) {
        toast.success(`Found ${result.contacts.length} contacts for this job`);
        // Update local state to reflect contact attempts
        setJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { ...job, _count: { ...job._count, contactAttempts: (job._count?.contactAttempts || 0) + 1 }}
            : job
        ));
      } else {
        toast.error("Failed to find contacts: " + result.error);
      }
    } catch (error) {
      toast.error("Error finding contacts");
    } finally {
      setContactsLoading(false);
    }
  };

  const handleApplyToJob = async (jobId, contactId) => {
    setApplicationLoading(true);
    try {
      const result = await createJobApplication(jobId, contactId, true);
      if (result.success) {
        toast.success("Application submitted successfully!");
        // Update job status in local state
        setJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { 
                ...job, 
                status: "APPLIED", 
                _count: { 
                  ...job._count, 
                  applications: (job._count?.applications || 0) + 1 
                }
              }
            : job
        ));
      } else {
        toast.error("Failed to submit application: " + result.error);
      }
    } catch (error) {
      toast.error("Error submitting application");
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleAIApply = async (jobId) => {
    setApplicationLoading(true);
    try {
      const result = await applyToJobWithAI(jobId);
      if (result.success) {
        toast.success("AI application process completed!");
        // Update job status in local state
        setJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { 
                ...job, 
                status: "APPLIED", 
                _count: { 
                  ...job._count, 
                  applications: (job._count?.applications || 0) + 1 
                }
              }
            : job
        ));
      } else {
        toast.error("AI application failed: " + result.error);
      }
    } catch (error) {
      toast.error("Error in AI application");
    } finally {
      setApplicationLoading(false);
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
              {job.applicantsCount && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{job.applicantsCount} applicants</span>
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
                      <div>Employment: {job.employmentType || 'Full-time'}</div>
                      <div>Experience: {job.experienceLevel || 'Mid-level'}</div>
                      {job.salaryInfo && <div>Salary: {job.salaryInfo}</div>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Match Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>AI Match Score: {job.aiMatchScore || 0}%</div>
                      <div>Priority: {job.priority || 'LOW'}</div>
                      <div>Source: {job.source || 'Unknown'}</div>
                      <div>Remote: {job.remote ? 'Yes' : 'No'}</div>
                      <div>Applications: {job._count?.applications || 0}</div>
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
                  {(job._count?.contactAttempts || 0) === 0 ? (
                    <Button 
                      onClick={() => handleFindContacts(job.id)}
                      disabled={contactsLoading}
                      className="flex items-center gap-2"
                    >
                      {contactsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                      Find Contacts
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleApplyToJob(job.id, "contact-id")}
                      disabled={applicationLoading || (job._count?.applications || 0) > 0}
                      className="flex items-center gap-2"
                    >
                      {applicationLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (job._count?.applications || 0) > 0 ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {(job._count?.applications || 0) > 0 ? "Applied" : "Apply Now"}
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
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Quick Apply Button */}
          {(job._count?.contactAttempts || 0) === 0 && job.status !== "APPLIED" && (
            <Button 
              size="sm" 
              onClick={() => handleAIApply(job.id)}
              disabled={applicationLoading}
            >
              {applicationLoading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Zap className="h-3 w-3 mr-1" />
              )}
              AI Apply
            </Button>
          )}

          {(job._count?.applications || 0) > 0 && (
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
              Found {jobs.length} matching positions
            </p>
          </div>
        </div>
        
        {/* Refresh Button */}
        <Button 
          onClick={handleRefreshJobs}
          disabled={scrapingLoading}
          variant="outline"
        >
          {scrapingLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Jobs
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
              {jobs.filter(j => j.status === 'APPLIED').length}
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
            <option value="matched">High Match</option>
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
          <Button onClick={handleRefreshJobs} disabled={scrapingLoading}>
            {scrapingLoading ? (
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