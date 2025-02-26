"use client";

import React, { useState } from "react";
import { SearchIcon, MapPinIcon, BriefcaseIcon, DollarSignIcon, FilterIcon, BookmarkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import {
  JOB_SUGGESTIONS,
  LOCATION_SUGGESTIONS,
  EXPERIENCE_RANGES,
  SALARY_RANGES,
  JOB_TYPES,
  searchJobsAcrossPortals,
  getFeaturedCompanies,
} from "./job-portal-service";
import { saveJobSearch, trackJobPortalClick } from "../../../../actions/job-search";

const JobSearchView = ({ session }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");
  const [jobType, setJobType] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filteredJobSuggestions, setFilteredJobSuggestions] = useState([]);
  const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState([]);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Handle search across job portals
  const handleSearch = () => {
    console.log('Searching with:', {
      jobTitle,
      location,
      experienceLevel,
      salaryRange,
      jobType
    });

    setIsSearching(true);
    const results = searchJobsAcrossPortals(jobTitle, location, experienceLevel, salaryRange, jobType);
    setSearchResults(results);
    setIsSearching(false);
  };

  // Handle saving the search
 // Handle saving the search
const handleSaveSearch = async () => {
  try {
    if (!jobTitle) {
      toast.error("Job title required", { description: "Please enter a job title to save your search" });
      return;
    }

    setIsSaving(true);
    const portals = searchResults.map(result => result.portalId);
    
    const result = await saveJobSearch({
      jobTitle,
      location,
      experienceLevel,
      salaryRange,
      jobType,
      portals
    });
    
    if (result.success) {
      toast.success("Search saved", { description: "Your job search has been saved successfully" });
      // Add this line to redirect after successful save
      window.location.href = "/job-search/saved-jobs";
    } else {
      // Display the specific error message from the server
      if (result.error === "Authentication required") {
        toast.error("Login required", { description: "Your session may have expired. Please login again." });
      } else {
        throw new Error(result.error || "Failed to save search");
      }
    }
  } catch (error) {
    toast.error("Error", { description: error.message || "Something went wrong" });
  } finally {
    setIsSaving(false);
  }
};
  // Handle job input change and suggestions
  const handleJobInputChange = (e) => {
    const value = e.target.value;
    setJobTitle(value);

    if (value.length >= 2) {
      const filtered = JOB_SUGGESTIONS.filter((item) =>
        item.text.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFilteredJobSuggestions(filtered);
      setShowJobSuggestions(filtered.length > 0);
    } else {
      setShowJobSuggestions(false);
    }
  };

  // Handle location input change and suggestions
  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    if (value.length >= 2) {
      const filtered = LOCATION_SUGGESTIONS.filter((item) =>
        item.text.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFilteredLocationSuggestions(filtered);
      setShowLocationSuggestions(filtered.length > 0);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  // Handle selecting a suggestion
  const handleSuggestionSelect = (suggestion, type) => {
    if (type === "job") {
      setJobTitle(suggestion.text);
      setShowJobSuggestions(false);
    } else if (type === "location") {
      setLocation(suggestion.text);
      setShowLocationSuggestions(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            AI-Powered Job Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="flex items-center border rounded-md ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <SearchIcon className="ml-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Job title, skills, or keywords"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={jobTitle}
                    onChange={handleJobInputChange}
                    onFocus={() => setShowJobSuggestions(filteredJobSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowJobSuggestions(false), 100)}
                  />
                </div>
                {showJobSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                    <ul className="py-1">
                      {filteredJobSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 hover:bg-muted cursor-pointer"
                          onMouseDown={() => handleSuggestionSelect(suggestion, "job")}
                        >
                          {suggestion.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex items-center border rounded-md ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <MapPinIcon className="ml-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={location}
                    onChange={handleLocationInputChange}
                    onFocus={() => setShowLocationSuggestions(filteredLocationSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 100)}
                  />
                </div>
                {showLocationSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                    <ul className="py-1">
                      {filteredLocationSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 hover:bg-muted cursor-pointer"
                          onMouseDown={() => handleSuggestionSelect(suggestion, "location")}
                        >
                          {suggestion.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced filters */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <FilterIcon className="h-4 w-4" />
                    Advanced Filters
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Experience Level</label>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE_RANGES.map((range) => (
                            <SelectItem key={range.id} value={range.id}>
                              {range.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Salary Range</label>
                      <Select value={salaryRange} onValueChange={setSalaryRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select salary range" />
                        </SelectTrigger>
                        <SelectContent>
                          {SALARY_RANGES.map((range) => (
                            <SelectItem key={range.id} value={range.id}>
                              {range.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Type</label>
                      <Select value={jobType} onValueChange={setJobType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          {JOB_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSearch} // Use handleSearch for searching
                className="flex-1"
                disabled={!jobTitle || isSearching}
              >
                {isSearching ? "Searching..." : "Search Across All Job Portals"}
              </Button>

              {searchResults.length > 0 && (
                <Button
                  onClick={handleSaveSearch} // Use handleSaveSearch for saving
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={isSaving}
                >
                  <BookmarkIcon className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Search"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseIcon className="h-5 w-5" />
              Job Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((result, index) => (
                <a
                  key={index}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handlePortalClick(result)}
                  className="no-underline"
                >
                  <div className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:bg-muted/50">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: result.color }}
                      >
                        <i className={result.icon}></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{result.portal}</h3>
                        <p className="text-sm text-muted-foreground">{result.title}</p>
                        <div className="mt-2 text-sm flex items-center text-primary">
                          View Jobs <span className="ml-1">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5" />
            Featured Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Companies</TabsTrigger>
              <TabsTrigger value="tech">Tech Giants</TabsTrigger>
              <TabsTrigger value="indian_tech">Indian Tech</TabsTrigger>
              <TabsTrigger value="global_corps">Global Corps</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFeaturedCompanies().map((company) => (
                  <CompanyCard key={company.name} company={company} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tech">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFeaturedCompanies("tech").map((company) => (
                  <CompanyCard key={company.name} company={company} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="indian_tech">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFeaturedCompanies("indian_tech").map((company) => (
                  <CompanyCard key={company.name} company={company} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="global_corps">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFeaturedCompanies("global_corps").map((company) => (
                  <CompanyCard key={company.name} company={company} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Company Card component
const CompanyCard = ({ company }) => {
  return (
    <a
      href={company.careersUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline"
    >
      <div className="border rounded-lg p-4 h-full hover:shadow-md transition-all duration-200 hover:bg-muted/50">
        <div className="flex items-start">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center text-white mr-3"
            style={{ backgroundColor: company.color }}
          >
            <i className={company.icon}></i>
          </div>
          <div>
            <h3 className="font-medium text-foreground">{company.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{company.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {company.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default JobSearchView;