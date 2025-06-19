"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

import { 
  Target, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  GraduationCap, 
  Video,
  Award,
  Users,
  Briefcase,
  Star,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Zap,
  Brain,
  Trophy,
  Clock,
  Shield
} from "lucide-react";

const JobSpecificResults = ({ analysis }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-600";
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-rose-600";
  };

  const getMatchLevel = (score) => {
    if (score >= 85) return { 
      level: "Exceptional Match", 
      color: "emerald", 
      description: "Outstanding qualifications - you're a top candidate",
      icon: Trophy
    };
    if (score >= 70) return { 
      level: "Strong Match", 
      color: "blue", 
      description: "Solid qualifications with minor gaps to address",
      icon: Shield
    };
    if (score >= 50) return { 
      level: "Moderate Match", 
      color: "amber", 
      description: "Some potential but requires skill development",
      icon: Clock
    };
    return { 
      level: "Development Needed", 
      color: "red", 
      description: "Significant preparation required for this role",
      icon: AlertTriangle
    };
  };

  const matchLevel = getMatchLevel(analysis.overallScore);
  const MatchIcon = matchLevel.icon;

  return (
    <div className="space-y-10 my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center space-y-6 py-8">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-transparent bg-clip-text mb-4">
            Job Match Analysis
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full"></div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Badge 
            variant="outline" 
            className={`px-6 py-3 text-lg font-bold border-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105
              ${matchLevel.color === 'emerald' ? 'border-emerald-400 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300' : 
                matchLevel.color === 'blue' ? 'border-blue-400 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300' : 
                matchLevel.color === 'amber' ? 'border-amber-400 text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300' : 
                'border-red-400 text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-300'}`}
          >
            <MatchIcon className="w-5 h-5 mr-2" />
            <span className="font-extrabold">{matchLevel.level}</span>
          </Badge>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            {matchLevel.description}
          </p>
        </div>
      </div>

      {/* Job Information Grid */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0">
          <CardTitle className="flex items-center gap-4 text-3xl font-black">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Briefcase className="h-8 w-8" />
            </div>
            <span>Position Overview</span>
          </CardTitle>
          <CardDescription className="text-purple-100 text-lg font-medium">
            Key details about this opportunity
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Position", value: analysis.jobInfo?.jobTitle || "Not specified", icon: Target },
              { label: "Company", value: analysis.jobInfo?.companyName || "Not specified", icon: Briefcase },
              { label: "Location", value: analysis.jobInfo?.location || "Not specified", icon: Star },
              { label: "Experience", value: analysis.jobInfo?.experienceRequired || "Not specified", icon: Clock }
            ].map((item, index) => (
              <div key={index} className="group p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
                    <item.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {item.label}
                  </h3>
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overall Match Score - Hero Section */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <CardTitle className="flex items-center gap-4 text-3xl font-black">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Target className="h-8 w-8" />
            </div>
            <span>Match Score Analysis</span>
          </CardTitle>
          <CardDescription className="text-indigo-100 text-lg font-medium">
            Comprehensive evaluation of your profile against job requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <div className="flex flex-col xl:flex-row items-center gap-12">
            {/* Score Circle */}
            <div className="relative flex-shrink-0">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full"></div>
                <span className={`text-7xl font-black tracking-tighter z-10 ${getScoreColor(analysis.overallScore)}`}>
                  {Math.round(analysis.overallScore)}%
                </span>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    className="text-gray-200 dark:text-gray-700" 
                    strokeWidth="8" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="42" 
                    cx="50" 
                    cy="50" 
                  />
                  <circle 
                    className={`${getScoreBackground(analysis.overallScore)} transition-all duration-1000 ease-out`} 
                    strokeWidth="8" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="42" 
                    cx="50" 
                    cy="50" 
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - analysis.overallScore / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <Badge className="px-4 py-2 font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
                  Overall Score
                </Badge>
              </div>
            </div>
            
            {/* Detailed Breakdown */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skills Breakdown */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                    <Zap className="h-6 w-6 text-purple-600" />
                    Skills Breakdown
                  </h3>
                  
                  {[
                    { name: "Skills Match", score: analysis.detailedScoring?.skillsMatch || 0, icon: Brain },
                    { name: "Experience", score: analysis.detailedScoring?.experienceRelevance || 0, icon: Trophy },
                    { name: "Education", score: analysis.detailedScoring?.educationMatch || 0, icon: GraduationCap }
                  ].map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {item.name}
                          </span>
                        </div>
                        <span className={`text-lg font-black ${getScoreColor(item.score)}`}>
                          {Math.round(item.score)}%
                        </span>
                      </div>
                      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getScoreGradient(item.score)} transition-all duration-1000 ease-out rounded-full`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Assessment Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                    <Award className="h-6 w-6 text-purple-600" />
                    Assessment
                  </h3>
                  
                  <div className="mb-6">
                    <Badge className={`px-4 py-2 text-base font-bold border-0 ${
                      matchLevel.color === 'emerald' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                      matchLevel.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      matchLevel.color === 'amber' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      <MatchIcon className="w-4 h-4 mr-2" />
                      {matchLevel.description}
                    </Badge>
                  </div>
                  
                  <p className="text-base font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                    {analysis.overallAssessment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Skills Analysis Tabs */}
      <Tabs defaultValue="required" className="w-full">
        <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 mb-6 h-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          {[
            { value: "required", label: "Required Skills", icon: CheckCircle, color: "emerald" },
            { value: "preferred", label: "Preferred Skills", icon: Star, color: "blue" },
            { value: "additional", label: "Your Edge", icon: TrendingUp, color: "purple" },
            { value: "missing", label: "Growth Areas", icon: AlertTriangle, color: "amber" }
          ].map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="py-4 px-6 font-bold text-base rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg transition-all duration-300"
            >
              <tab.icon className="h-5 w-5 mr-3" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="required">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-black">
                <div className="bg-white/20 p-3 rounded-xl">
                  <CheckCircle className="h-6 w-6" />
                </div>
                Required Skills You Possess
              </CardTitle>
              <CardDescription className="text-emerald-100 text-lg font-medium">
                Essential qualifications that make you a viable candidate
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-4">
                {analysis.skillsAnalysis?.requiredSkillsFound && analysis.skillsAnalysis.requiredSkillsFound.length > 0 ? (
                  analysis.skillsAnalysis.requiredSkillsFound.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700 py-2 px-4 text-base font-bold rounded-xl hover:scale-105 transition-transform duration-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-500">No required skills detected in your resume</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferred">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-black">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Star className="h-6 w-6" />
                </div>
                Preferred Skills You Have
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg font-medium">
                Bonus qualifications that set you apart from other candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-4">
                {analysis.skillsAnalysis?.preferredSkillsFound && analysis.skillsAnalysis.preferredSkillsFound.length > 0 ? (
                  analysis.skillsAnalysis.preferredSkillsFound.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 py-2 px-4 text-base font-bold rounded-xl hover:scale-105 transition-transform duration-200"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-500">No preferred skills detected</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-black">
                <div className="bg-white/20 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                Your Competitive Edge
              </CardTitle>
              <CardDescription className="text-purple-100 text-lg font-medium">
                Additional skills that demonstrate your expertise and versatility
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-4">
                {analysis.skillsAnalysis?.additionalSkills && analysis.skillsAnalysis.additionalSkills.length > 0 ? (
                  analysis.skillsAnalysis.additionalSkills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 py-2 px-4 text-base font-bold rounded-xl hover:scale-105 transition-transform duration-200"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-500">No additional relevant skills identified</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="missing">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
            <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
              <CardTitle className="flex items-center gap-4 text-2xl font-black">
                <div className="bg-white/20 p-3 rounded-xl">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                Skills Development Opportunities
              </CardTitle>
              <CardDescription className="text-amber-100 text-lg font-medium">
                Strategic skills to develop for this role and career advancement
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {analysis.skillsAnalysis?.requiredSkillsMissing && analysis.skillsAnalysis.requiredSkillsMissing.length > 0 && (
                  <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 rounded-2xl border-l-4 border-red-500">
                    <h4 className="font-black text-red-800 dark:text-red-300 mb-4 text-xl flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6" />
                      Critical Skills Gap
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {analysis.skillsAnalysis.requiredSkillsMissing.map((skill, index) => (
                        <Badge 
                          key={index} 
                          className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 py-2 px-4 text-base font-bold rounded-xl"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {analysis.skillsAnalysis?.preferredSkillsMissing && analysis.skillsAnalysis.preferredSkillsMissing.length > 0 && (
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 rounded-2xl border-l-4 border-amber-500">
                    <h4 className="font-black text-amber-800 dark:text-amber-300 mb-4 text-xl flex items-center gap-3">
                      <Star className="h-6 w-6" />
                      Enhancement Opportunities
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {analysis.skillsAnalysis.preferredSkillsMissing.map((skill, index) => (
                        <Badge 
                          key={index} 
                          className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 py-2 px-4 text-base font-bold rounded-xl"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Experience Analysis - Enhanced */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600 text-white border-0">
          <CardTitle className="flex items-center gap-4 text-3xl font-black">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Users className="h-8 w-8" />
            </div>
            Experience Analysis
          </CardTitle>
          <CardDescription className="text-slate-100 text-lg font-medium">
            How your professional background aligns with role requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Experience Requirements */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h4 className="font-black text-2xl mb-6 flex items-center gap-3">
                {analysis.experienceAnalysis?.meetsCriteria ? (
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-7 w-7 text-red-600" />
                )}
                Experience Requirements
              </h4>
              
              <div className="space-y-4">
                {[
                  { label: "Your Experience", value: analysis.experienceAnalysis?.candidateExperience || "Not specified", icon: Trophy },
                  { label: "Required", value: analysis.experienceAnalysis?.requiredExperience || "Not specified", icon: Target },
                  { 
                    label: "Status", 
                    value: analysis.experienceAnalysis?.meetsCriteria ? "Meets Requirements" : "Below Requirements",
                    icon: analysis.experienceAnalysis?.meetsCriteria ? CheckCircle : AlertCircle,
                    color: analysis.experienceAnalysis?.meetsCriteria ? "text-emerald-600" : "text-red-600"
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className={`h-5 w-5 ${item.color || 'text-gray-600 dark:text-gray-400'}`} />
                      <span className="font-bold text-gray-700 dark:text-gray-300">{item.label}:</span>
                    </div>
                    <span className={`font-black text-lg ${item.color || 'text-gray-900 dark:text-gray-100'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Relevant Experience */}
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <h4 className="font-black text-2xl mb-6 flex items-center gap-3">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
                Relevant Experience
              </h4>
              
              <div className="space-y-3">
                {analysis.experienceAnalysis?.relevantExperience && analysis.experienceAnalysis.relevantExperience.length > 0 ? (
                  analysis.experienceAnalysis.relevantExperience.map((exp, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{exp}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-500">No specific relevant experience identified</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Experience Gaps */}
          {analysis.experienceAnalysis?.experienceGaps && analysis.experienceAnalysis.experienceGaps.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border border-amber-300 dark:border-amber-800 shadow-lg">
              <h4 className="font-black text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-3 text-xl">
                <AlertTriangle className="h-6 w-6" />
                Experience Gaps to Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.experienceAnalysis.experienceGaps.map((gap, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white/60 dark:bg-gray-800/40 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    <span className="font-semibold text-amber-900 dark:text-amber-200">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strengths and Weaknesses - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0">
            <CardTitle className="flex items-center gap-3 text-2xl font-black">
              <div className="bg-white/20 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
              Competitive Advantages
            </CardTitle>
            <CardDescription className="text-emerald-100 font-medium">
              What makes you stand out from other candidates
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analysis.strengthsForThisRole && analysis.strengthsForThisRole.length > 0 ? (
                analysis.strengthsForThisRole.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-all duration-200">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200 leading-relaxed">{strength}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-500">No specific strengths identified for this role</p>
                </div>
              )}
            </div>

            {analysis.competitiveAdvantage && analysis.competitiveAdvantage.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-emerald-200 dark:border-emerald-800">
                <h5 className="font-black text-emerald-800 dark:text-emerald-300 mb-4 text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Unique Value Proposition:
                </h5>
                <div className="space-y-2">
                  {analysis.competitiveAdvantage.map((advantage, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-emerald-100/50 dark:bg-emerald-900/10 rounded-lg">
                      <Star className="h-4 w-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span className="font-medium text-emerald-800 dark:text-emerald-300">{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50">
          <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white border-0">
            <CardTitle className="flex items-center gap-3 text-2xl font-black">
              <div className="bg-white/20 p-3 rounded-xl">
                <TrendingDown className="h-6 w-6" />
              </div>
              Areas for Improvement
            </CardTitle>
            <CardDescription className="text-red-100 font-medium">
              Development opportunities to strengthen your candidacy
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analysis.weaknessesForThisRole && analysis.weaknessesForThisRole.length > 0 ? (
                analysis.weaknessesForThisRole.map((weakness, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-red-50/80 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <span className="font-semibold text-red-900 dark:text-red-200 leading-relaxed">{weakness}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-500">No specific weaknesses identified</p>
                </div>
              )}
            </div>

            {analysis.redFlags && analysis.redFlags.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-red-200 dark:border-red-800">
                <h5 className="font-black text-red-800 dark:text-red-300 mb-4 text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Potential Concerns:
                </h5>
                <div className="space-y-2">
                  {analysis.redFlags.map((flag, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-100/50 dark:bg-red-900/10 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                      <span className="font-medium text-red-800 dark:text-red-300">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Improvement Suggestions */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0">
          <CardTitle className="flex items-center gap-4 text-3xl font-black">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Lightbulb className="h-8 w-8" />
            </div>
            Strategic Improvement Plan
          </CardTitle>
          <CardDescription className="text-violet-100 text-lg font-medium">
            Actionable recommendations to enhance your candidacy for this role
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysis.improvementSuggestions && analysis.improvementSuggestions.length > 0 ? (
              analysis.improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="group p-6 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          suggestion.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30' : 
                          suggestion.priority === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30' : 
                          'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          <Lightbulb className={`h-5 w-5 ${
                            suggestion.priority === 'High' ? 'text-red-600' : 
                            suggestion.priority === 'Medium' ? 'text-amber-600' : 
                            'text-blue-600'
                          }`} />
                        </div>
                        <h4 className="font-black text-lg text-gray-900 dark:text-gray-100">{suggestion.area}</h4>
                      </div>
                      <p className="text-base font-medium text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {suggestion.suggestion}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={`px-3 py-1 text-sm font-bold border-0 ${
                      suggestion.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                      suggestion.priority === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}
                  >
                    {suggestion.priority} Priority
                  </Badge>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-500">No specific improvement suggestions available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interview Readiness */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-0">
          <CardTitle className="flex items-center gap-4 text-3xl font-black">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Award className="h-8 w-8" />
            </div>
            Interview Readiness Assessment
          </CardTitle>
          <CardDescription className="text-teal-100 text-lg font-medium">
            Your preparation level and focus areas for interview success
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Readiness Score */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-2xl border border-teal-200 dark:border-teal-800">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-black ${getScoreColor(analysis.interviewReadiness?.score || 0)}`}>
                    {Math.round(analysis.interviewReadiness?.score || 0)}%
                  </span>
                </div>
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-gray-200 dark:text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="36" cx="50" cy="50" />
                  <circle 
                    className={`${getScoreBackground(analysis.interviewReadiness?.score || 0)} transition-all duration-1000`} 
                    strokeWidth="8" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="36" 
                    cx="50" 
                    cy="50" 
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - (analysis.interviewReadiness?.score || 0) / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h4 className="font-black text-xl text-teal-800 dark:text-teal-300 text-center">Interview Readiness</h4>
              <p className="text-sm font-medium text-teal-600 dark:text-teal-400 text-center mt-1">Based on job match analysis</p>
            </div>

            {/* Focus Areas */}
            <div className="lg:col-span-2 space-y-6">
              {analysis.interviewReadiness?.areasToFocus && analysis.interviewReadiness.areasToFocus.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <h5 className="font-black text-blue-800 dark:text-blue-300 mb-4 text-xl flex items-center gap-3">
                    <BookOpen className="h-6 w-6" />
                    Key Focus Areas:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.interviewReadiness.areasToFocus.map((area, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                        <BookOpen className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="font-semibold text-blue-900 dark:text-blue-200">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.interviewReadiness?.potentialQuestions && analysis.interviewReadiness.potentialQuestions.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-2xl border border-purple-200 dark:border-purple-800">
                  <h5 className="font-black text-purple-800 dark:text-purple-300 mb-4 text-xl flex items-center gap-3">
                    <Brain className="h-6 w-6" />
                    Potential Interview Questions:
                  </h5>
                  <div className="space-y-3">
                    {analysis.interviewReadiness.potentialQuestions.slice(0, 3).map((question, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{index + 1}</span>
                        </div>
                        <span className="font-medium text-purple-900 dark:text-purple-200 leading-relaxed">{question}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Resources */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0">
          <CardTitle className="flex items-center gap-4 text-3xl font-black">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
            Recommended Learning Path
          </CardTitle>
          <CardDescription className="text-indigo-100 text-lg font-medium">
            Curated courses and resources to enhance your qualifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysis.recommendedCourses && analysis.recommendedCourses.map((course, index) => (
              <div key={index} className="group p-6 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-950/30">
                <a href={course[1]} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-3 flex-shrink-0 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 transition-colors">
                      <span className="font-black text-indigo-600 dark:text-indigo-400 text-lg">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-800 dark:group-hover:text-indigo-200 transition-colors mb-2 leading-tight">
                        {course[0]}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Course
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
            <CardTitle className="flex items-center gap-3 text-2xl font-black">
              <div className="bg-white/20 p-3 rounded-xl">
                <Video className="h-6 w-6" />
              </div>
              Resume Optimization
            </CardTitle>
            <CardDescription className="text-orange-100 font-medium">
              Expert tips to enhance your resume
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
              <iframe 
                className="w-full h-full"
                src={analysis.resumeVideo?.replace('watch?v=', 'embed/')} 
                title="Resume Tips" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
            <CardTitle className="flex items-center gap-3 text-2xl font-black">
              <div className="bg-white/20 p-3 rounded-xl">
                <Video className="h-6 w-6" />
              </div>
              Interview Mastery
            </CardTitle>
            <CardDescription className="text-green-100 font-medium">
              Proven strategies for interview success
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
              <iframe 
                className="w-full h-full"
                src={analysis.interviewVideo?.replace('watch?v=', 'embed/')} 
                title="Interview Tips" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Footer */}
      <div className="text-center py-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-3xl shadow-2xl">
        <h3 className="text-3xl font-black text-white mb-4">Ready to Take Action?</h3>
        <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
          Use these insights to optimize your application and prepare for your interview with confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg rounded-xl shadow-lg hover:scale-105 transition-all duration-200">
            <ChevronRight className="h-5 w-5 mr-2" />
            Optimize Resume
          </Button>
          <Button className="bg-purple-800 text-white hover:bg-purple-900 font-bold px-8 py-3 text-lg rounded-xl shadow-lg hover:scale-105 transition-all duration-200">
            <Award className="h-5 w-5 mr-2" />
            Start Preparing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobSpecificResults;