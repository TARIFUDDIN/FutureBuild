// app/job-automation/session/[sessionId]/_components/job-session-view.jsx
// ENHANCED: Better job display with improved real-time updates

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  MapPin,
  Building,
  Clock,
  DollarSign,
  ExternalLink,
  Bot,
  FileText,
  Sparkles,
  RefreshCw,
  Eye,
  Heart,
  SortAsc,
  SortDesc,
  Star,
  Zap,
  Mail,
  Send,
  Loader2,
  AlertCircle,
  TrendingUp,
  Award,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { Button } from "../../../../../../components/ui/button";
import { Badge } from "../../../../../../components/ui/badge";
import { Input } from "../../../../../../components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogDescription,
} from "../../../../../../components/ui/alert-dialog";

import { 
  applyToJobWithAI, 
  getSessionJobs,
  findJobContacts,
  createJobApplication,
  bulkApplyToJobs,
  updateJobStatus
} from "../../../../../../actions/ai-job-automation";

// Custom checkbox component
const Checkbox = ({ checked, onClick, className }) => (
  <div 
    className={`w-4 h-4 border-2 border-purple-500 rounded cursor-pointer flex items-center justify-center ${
      checked ? 'bg-purple-500' : 'bg-white'
    } ${className}`}
    onClick={onClick}
  >
    {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
  </div>
);

const EnhancedJobSessionView = ({ sessionId, initialJobs = [], session = null }) => {
  const [jobs, setJobs] = useState(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("aiMatchScore");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterByType, setFilterByType] = useState("all");
  const [filterByPriority, setFilterByPriority] = useState("all");
  const [filterByStatus, setFilterByStatus] = useState("all");
  const [filterBySource, setFilterBySource] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [bulkApplyLoading, setBulkApplyLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh for real-time job updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (jobs.length < 10) { // Only auto-refresh if we have few jobs
        refreshJobs(false); // Silent refresh
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, jobs.length]);

  // Apply filters and search
  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = 
        (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.keySkillsMatch || []).some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesType = filterByType === "all" || job.employmentType === filterByType;
      const matchesPriority = filterByPriority === "all" || job.priority === filterByPriority;
      const matchesStatus = filterByStatus === "all" || job.status === filterByStatus;
      const matchesSource = filterBySource === "all" || job.source === filterBySource;
      
      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesSource;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || 0;
      let bValue = b[sortBy] || 0;
      
      if (sortBy === "aiMatchScore") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (sortBy === "createdAt") {
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, sortBy, sortOrder, filterByType, filterByPriority, filterByStatus, filterBySource]);

  const refreshJobs = useCallback(async (showToast = true) => {
    setIsLoading(true);
    try {
      const result = await getSessionJobs(sessionId);
      if (result.success) {
        setJobs(result.jobs);
        setLastRefresh(new Date());
        if (showToast) {
          toast.success(`Refreshed ${result.jobs.length} jobs`);
        }
      } else {
        if (showToast) {
          toast.error("Failed to refresh jobs: " + result.error);
        }
      }
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      if (showToast) {
        toast.error('Failed to refresh jobs');
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const handleApplyToJob = async (jobId) => {
    setApplicationLoading(true);
    try {
      const result = await applyToJobWithAI(jobId);
      if (result.success) {
        toast.success('AI application process started!', {
          description: 'Check applications tab for progress.'
        });
        await refreshJobs(false);
      } else {
        toast.error(result.error || 'Failed to start application process');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('Error applying to job: ' + error.message);
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleQuickApply = async (jobId) => {
    setApplicationLoading(true);
    try {
      const result = await createJobApplication(jobId, null, false);
      if (result.success) {
        toast.success('Application created successfully!');
        await refreshJobs(false);
      } else {
        toast.error(result.error || 'Failed to create application');
      }
    } catch (error) {
      console.error('Error creating application:', error);
      toast.error('Error creating application');
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleUpdateJobStatus = async (jobId, status) => {
    try {
      const result = await updateJobStatus(jobId, status);
      if (result.success) {
        toast.success(`Job status updated to ${status}`);
        await refreshJobs(false);
      } else {
        toast.error('Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Error updating job status');
    }
  };

  const handleFindContacts = async (jobId) => {
    setContactsLoading(true);
    try {
      const result = await findJobContacts(jobId);
      if (result.success) {
        toast.success(`Found ${result.contacts.length} contacts for this job`);
      } else {
        toast.error("Failed to find contacts: " + result.error);
      }
    } catch (error) {
      console.error('Error finding contacts:', error);
      toast.error("Error finding contacts");
    } finally {
      setContactsLoading(false);
    }
  };

  const handleBulkApply = async (useAI = true) => {
    if (selectedJobs.size === 0) {
      toast.error('Please select jobs to apply to');
      return;
    }

    setBulkApplyLoading(true);
    try {
      const jobIds = Array.from(selectedJobs);
      const result = await bulkApplyToJobs(jobIds, useAI);
      
      if (result.success) {
        const { successful, failed, errors } = result.results;
        
        if (successful > 0) {
          toast.success(`Successfully applied to ${successful} jobs!`);
        }
        if (failed > 0) {
          toast.error(`Failed to apply to ${failed} jobs`);
          console.error('Bulk apply errors:', errors);
        }
        
        setSelectedJobs(new Set());
        await refreshJobs(false);
      } else {
        toast.error(result.error || 'Bulk apply failed');
      }
    } catch (error) {
      console.error('Error in bulk apply:', error);
      toast.error('Error applying to jobs');
    } finally {
      setBulkApplyLoading(false);
    }
  };

  const toggleJobSelection = (jobId) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const selectAllJobs = () => {
    if (selectedJobs.size === filteredJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredJobs.map(job => job.id)));
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400";
    if (score >= 70) return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
    return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      HIGH: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    };
    return colors[priority] || colors.LOW;
  };

  const getStatusColor = (status) => {
    const colors = {
      DISCOVERED: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      ANALYZING: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      MATCHED: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      APPLIED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
      REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      INTERVIEW_SCHEDULED: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      INTERVIEWED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
      OFFER_RECEIVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
      ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    };
    return colors[status] || colors.DISCOVERED;
  };

  const getSourceBadgeColor = (source) => {
    const colors = {
      'JSearch': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Reed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Adzuna': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'JobsAPI': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'Enhanced Multi-Source': 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:from-purple-900/20 dark:to-blue-900/20 dark:text-purple-400'
    };
    return colors[source] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  // Get unique sources for filter
  const uniqueSources = [...new Set(jobs.map(job => job.source).filter(Boolean))];

  const JobCard = ({ job }) => {
    const hasApplied = job.applications && job.applications.length > 0;
    
    return (
      <Card 
        className={`hover:shadow-lg transition-all duration-200 cursor-pointer card-purple border-l-4 ${
          selectedJobs.has(job.id) ? 'ring-2 ring-purple-500 border-l-purple-500' : 
          job.aiMatchScore >= 85 ? 'border-l-emerald-500' :
          job.aiMatchScore >= 70 ? 'border-l-blue-500' :
          job.aiMatchScore >= 60 ? 'border-l-yellow-500' : 'border-l-gray-300'
        }`}
        onClick={() => setSelectedJob(job)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={selectedJobs.has(job.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleJobSelection(job.id);
                }}
                className="mt-1"
              />
              <div className="space-y-3 flex-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-foreground hover:text-purple-600 transition-colors">
                      {job.title || 'Software Developer'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">{job.company || 'Company'}</span>
                      <span>•</span>
                      <MapPin className="h-4 w-4" />
                      <span>{job.location || 'Remote'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(job.priority || 'LOW')} variant="secondary">
                      {job.priority || 'LOW'}
                    </Badge>
                    <Badge className={`${getMatchScoreColor(job.aiMatchScore || 0)} font-medium`}>
                      <Star className="h-3 w-3 mr-1" />
                      {job.aiMatchScore || 0}%
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.postedAt || 'Recently'}
                  </span>
                  {job.salaryInfo && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salaryInfo}
                    </span>
                  )}
                  <Badge className={getSourceBadgeColor(job.source)} variant="outline">
                    {job.source}
                  </Badge>
                </div>

                {job.keySkillsMatch && job.keySkillsMatch.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {job.keySkillsMatch.slice(0, 6).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                        {skill}
                      </Badge>
                    ))}
                    {job.keySkillsMatch.length > 6 && (
                      <Badge variant="secondary" className="text-xs">
                        +{job.keySkillsMatch.length - 6} more
                      </Badge>
                    )}
                  </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.descriptionText && job.descriptionText.substring(0, 200)}
                  {job.descriptionText && job.descriptionText.length > 200 && "..."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {job.remote && (
                <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400 border-green-600">
                  Remote
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {job.employmentType || 'Full-time'}
              </Badge>
              <Badge className={getStatusColor(job.status || 'DISCOVERED')} variant="secondary">
                {job.status || 'DISCOVERED'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {hasApplied ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Applied
                </Badge>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickApply(job.id);
                    }}
                    disabled={applicationLoading}
                    className="hover:bg-purple-50 hover:border-purple-300"
                  >
                    Quick Apply
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyToJob(job.id);
                    }}
                    disabled={applicationLoading}
                    className="btn-purple-primary"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    AI Apply
                  </Button>
                </>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(job.applyUrl, '_blank');
                }}
                className="hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/job-automation">
            <Button
              variant="outline"
              size="sm"
              className="btn-purple-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sessions
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold heading-gradient">Enhanced Job Results</h1>
            <p className="text-muted-foreground">
              Found {jobs.length} jobs • Showing {filteredJobs.length} after filters • Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-300 text-green-700' : ''}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshJobs()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {selectedJobs.size > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkApply(false)}
                disabled={bulkApplyLoading}
              >
                Quick Apply ({selectedJobs.size})
              </Button>
              <Button
                size="sm"
                onClick={() => handleBulkApply(true)}
                disabled={bulkApplyLoading}
                className="btn-purple-primary"
              >
                <Bot className="h-4 w-4 mr-2" />
                {bulkApplyLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                AI Apply to {selectedJobs.size} Jobs
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Status Alert */}
      {jobs.length < 10 && (
  <AlertDialog className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
    <AlertDialogDescription className="text-blue-800 dark:text-blue-300">
      <strong>Job scraping in progress...</strong> We're finding more jobs from multiple sources. 
      {jobs.length > 0 ? ` Found ${jobs.length} so far.` : ' This may take 30-60 seconds.'}
    </AlertDialogDescription>
  </AlertDialog>
)}

      {/* Enhanced Filters */}
      <Card className="card-purple">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, company, location, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            
            <Select value={filterByType} onValueChange={setFilterByType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterByPriority} onValueChange={setFilterByPriority}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="HIGH">High Priority</SelectItem>
                <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                <SelectItem value="LOW">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterByStatus} onValueChange={setFilterByStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DISCOVERED">Discovered</SelectItem>
                <SelectItem value="MATCHED">Matched</SelectItem>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="INTERVIEW_SCHEDULED">Interview</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBySource} onValueChange={setFilterBySource}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {uniqueSources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aiMatchScore">Match Score</SelectItem>
                <SelectItem value="title">Job Title</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="createdAt">Date Found</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            >
              {sortOrder === "desc" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={selectAllJobs}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {selectedJobs.size === filteredJobs.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Job Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="card-purple">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-400">{jobs.length}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </CardContent>
        </Card>
        <Card className="card-purple">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-400">
              {jobs.filter(job => (job.aiMatchScore || 0) >= 85).length}
            </div>
            <div className="text-sm text-muted-foreground">Excellent Match</div>
          </CardContent>
        </Card>
        <Card className="card-purple">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">
              {jobs.filter(job => (job.aiMatchScore || 0) >= 70 && (job.aiMatchScore || 0) < 85).length}
            </div>
            <div className="text-sm text-muted-foreground">Good Match</div>
          </CardContent>
        </Card>
        <Card className="card-purple">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              {jobs.filter(job => job.applications && job.applications.length > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </CardContent>
        </Card>
        <Card className="card-purple">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-400">
              {jobs.filter(job => job.remote).length}
            </div>
            <div className="text-sm text-muted-foreground">Remote Jobs</div>
          </CardContent>
        </Card>
        <Card className="card-purple">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">
              {jobs.filter(job => job.priority === 'HIGH').length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card className="card-purple">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                {jobs.length === 0 
                  ? "Jobs are still being scraped from multiple sources. Please wait a moment."
                  : "Try adjusting your search criteria or filters."}
              </p>
              {jobs.length === 0 && (
                <Button className="mt-4 btn-purple-primary" onClick={() => refreshJobs()} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Check for Jobs
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>

      {/* Enhanced Job Detail Modal */}
      <Dialog open={selectedJob !== null} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span>{selectedJob.title}</span>
                    <Badge className={getSourceBadgeColor(selectedJob.source)} variant="outline">
                      {selectedJob.source}
                    </Badge>
                  </div>
                  <Badge className={`${getMatchScoreColor(selectedJob.aiMatchScore || 0)} font-medium`}>
                    <Award className="h-3 w-3 mr-1" />
                    {selectedJob.aiMatchScore || 0}% AI Match
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {selectedJob.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedJob.postedAt || 'Recently posted'}
                    </span>
                    <Badge className={getStatusColor(selectedJob.status || 'DISCOVERED')}>
                      {selectedJob.status || 'DISCOVERED'}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Rest of the modal content - job details, description, etc. */}
                {/* This would be the same as your existing modal content */}
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedJob.applyUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Original Job
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFindContacts(selectedJob.id)}
                      disabled={contactsLoading}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {contactsLoading ? 'Finding...' : 'Find Contacts'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedJob.applications && selectedJob.applications.length > 0 ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Applied
                      </Badge>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleQuickApply(selectedJob.id);
                            setSelectedJob(null);
                          }}
                          disabled={applicationLoading}
                        >
                          Quick Apply
                        </Button>
                        <Button
                          onClick={() => {
                            handleApplyToJob(selectedJob.id);
                            setSelectedJob(null);
                          }}
                          disabled={applicationLoading}
                          className="btn-purple-primary"
                        >
                          <Bot className="h-4 w-4 mr-2" />
                          {applicationLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            'Apply with AI'
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedJobSessionView;