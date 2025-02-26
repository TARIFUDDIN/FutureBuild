"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { 
  BookmarkIcon, 
  SearchIcon, 
  MapPinIcon, 
  BriefcaseIcon,
  TrashIcon,
  ArrowRightIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../@/components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../components/ui/alert-dialog";
import { 
  JOB_PORTALS,
  EXPERIENCE_RANGES,
  SALARY_RANGES,
  JOB_TYPES,
  searchJobsAcrossPortals
} from "../../_components/job-portal-service";
import { deleteSavedJobSearch } from "../../../../../actions/job-search";

const SavedJobSearchesView = ({ savedSearches, session }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSearchId, setSelectedSearchId] = useState(null);

  const handleDelete = async (searchId) => {
    setIsDeleting(true);
    try {
      const result = await deleteSavedJobSearch(searchId);
      
      if (result.success) {
        toast.success("Search deleted", {
          description: "Your saved job search has been deleted",
        });
      } else {
        throw new Error(result.error || "Failed to delete search");
      }
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsDeleting(false);
      setSelectedSearchId(null);
    }
  };

  const handleRunSearch = (search) => {
    const params = new URLSearchParams();
    params.set("job", search.jobTitle);
    if (search.location) params.set("location", search.location);
    if (search.experienceLevel) params.set("experience", search.experienceLevel);
    if (search.salaryRange) params.set("salary", search.salaryRange);
    if (search.jobType) params.set("type", search.jobType);
    
    router.push(`/job-search?${params.toString()}`);
  };

  // Function to get text label for IDs
  const getExperienceText = (id) => {
    const exp = EXPERIENCE_RANGES.find(e => e.id === id);
    return exp ? exp.text : id;
  };
  
  const getSalaryText = (id) => {
    const salary = SALARY_RANGES.find(s => s.id === id);
    return salary ? salary.text : id;
  };
  
  const getJobTypeText = (id) => {
    const type = JOB_TYPES.find(t => t.id === id);
    return type ? type.text : id;
  };

  // Function to get portal names from IDs
  const getPortalNames = (portalIds) => {
    if (!portalIds || !portalIds.length) return "All portals";
    
    return portalIds
      .map(id => {
        const portal = JOB_PORTALS.find(p => p.id === id);
        return portal ? portal.name : id;
      })
      .join(", ");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5" />
            Your Saved Job Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savedSearches.length === 0 ? (
            <div className="text-center py-12">
              <BookmarkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved searches yet</h3>
              <p className="text-muted-foreground mb-6">
                Save your job searches to quickly access them later
              </p>
              <Button onClick={() => router.push('/job-search')}>
                Go to Job Search
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedSearches.map((search) => (
                <div 
                  key={search.id} 
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{search.jobTitle}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {search.location && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3 w-3" />
                            <span>{search.location}</span>
                          </div>
                        )}
                        {search.experienceLevel && (
                          <div className="flex items-center gap-1">
                            <BriefcaseIcon className="h-3 w-3" />
                            <span>{getExperienceText(search.experienceLevel)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {search.jobType && (
                          <Badge variant="outline">{getJobTypeText(search.jobType)}</Badge>
                        )}
                        {search.salaryRange && (
                          <Badge variant="outline">{getSalaryText(search.salaryRange)}</Badge>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <span>Portals: {getPortalNames(search.portals)}</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <span>Saved {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRunSearch(search)}
                        className="flex items-center gap-1"
                      >
                        <span>Run Search</span>
                        <ArrowRightIcon className="h-3 w-3" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setSelectedSearchId(search.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete your saved search for "{search.jobTitle}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(search.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting && selectedSearchId === search.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedJobSearchesView;