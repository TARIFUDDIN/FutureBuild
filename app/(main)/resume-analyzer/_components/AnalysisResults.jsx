import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { AlertDialog, AlertDialogDescription, AlertDialogTitle ,AlertDialogAction} from "../../../../components/ui/alert-dialog";
import { Progress } from "../../../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Badge } from "../../../../components/ui/badge";
import { CheckCircle, AlertCircle, Lightbulb, GraduationCap, Award, Video } from "lucide-react";

const AnalysisResults = ({ analysis }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 my-6">
      <h2 className="text-3xl font-bold">Resume Analysis Results</h2>
      
      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Name</h3>
              <p className="text-lg">{analysis.basicInfo.name || "Not detected"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Email</h3>
              <p className="text-lg">{analysis.basicInfo.email || "Not detected"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Phone</h3>
              <p className="text-lg">{analysis.basicInfo.phone || "Not detected"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Experience Level</h3>
              <Badge variant={
                analysis.experienceLevel === "Experienced" ? "default" : 
                analysis.experienceLevel === "Intermediate" ? "secondary" : "outline"
              }>
                {analysis.experienceLevel}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ATS Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            ATS Compatibility Score
          </CardTitle>
          <CardDescription>
            How well your resume would perform in Applicant Tracking Systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-5xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                  {analysis.atsScore}
                </span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-200" 
                  strokeWidth="10" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className={`${getScoreBackground(analysis.atsScore)}`} 
                  strokeWidth="10" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.atsScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-center max-w-lg">
              {analysis.overallAnalysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Tabs defaultValue="current">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Skills</TabsTrigger>
          <TabsTrigger value="recommended">Recommended Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Your Skills</CardTitle>
              <CardDescription>
                Skills extracted from your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.skills && analysis.skills.length > 0 ? (
                  analysis.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No skills detected in your resume</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommended">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Skills for {analysis.jobField}</CardTitle>
              <CardDescription>
                Adding these skills could boost your chances of getting hired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.recommendedSkills && analysis.recommendedSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Issues and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Resume Improvement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-2">Missing Keywords</h3>
                <AlertDialog>
  <AlertCircle className="h-4 w-4" />
  <AlertDialogTitle>Consider adding these keywords</AlertDialogTitle>
  <AlertDialogDescription>
    <div className="flex flex-wrap gap-2 mt-2">
      {analysis.missingKeywords.map((keyword, index) => (
        <Badge key={index} variant="outline" className="bg-amber-50">
          {keyword}
        </Badge>
      ))}
    </div>
  </AlertDialogDescription>
</AlertDialog>
              </div>
            )}

            {analysis.structureIssues && analysis.structureIssues.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-2">Structure Issues</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {analysis.structureIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.contentSuggestions && analysis.contentSuggestions.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-2">Content Suggestions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {analysis.contentSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.actionItems && analysis.actionItems.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-2">Next Steps</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {analysis.actionItems.map((item, index) => (
                    <li key={index} className="font-medium">{item}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Recommended Courses for {analysis.jobField}
          </CardTitle>
          <CardDescription>
            Courses that can help you improve your skills in this field
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.recommendedCourses && analysis.recommendedCourses.map((course, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <a href={course[1]} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                    <span className="font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary hover:underline">{course[0]}</h3>
                    <p className="text-sm text-gray-500 truncate">{course[1]}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Resume Tips Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <iframe 
                className="w-full h-full rounded-lg"
                src={analysis.resumeVideo.replace('watch?v=', 'embed/')} 
                title="Resume Tips" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Interview Tips Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <iframe 
                className="w-full h-full rounded-lg"
                src={analysis.interviewVideo.replace('watch?v=', 'embed/')} 
                title="Interview Tips" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisResults;