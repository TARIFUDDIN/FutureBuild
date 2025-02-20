// app/resume-analyzer/_components/analysis-result.jsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Progress } from "../../../../@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Award, CheckCircle, AlertTriangle, FileType, List, Lightbulb } from "lucide-react";

export default function AnalysisResult({ result, hideStartNew = false, onStartNew }) {
  if (!result) return null;
  
  // Determine score color based on ATS score
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Resume Analysis Results
          </CardTitle>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">ATS Score:</span>
              <span className={`text-2xl font-bold ${getScoreColor(result.atsScore)}`}>
                {result.atsScore}/100
              </span>
            </div>
            <Progress
              value={result.atsScore}
              className="w-32 h-2 mt-1"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="keywords" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="keywords" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              <span className="hidden md:inline">Keywords</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-1">
              <FileType className="h-4 w-4" />
              <span className="hidden md:inline">Structure</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden md:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="action" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden md:inline">Action Items</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="keywords" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Missing Keywords</h3>
                <Badge variant="outline" className="bg-amber-50">
                  {result.missingKeywords.length} keywords missing
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                These industry-specific keywords could help your resume pass ATS filters and catch recruiters' attention.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="structure" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Structure & Formatting</h3>
                <Badge variant="outline" className="bg-amber-50">
                  {result.structureIssues.length} issues found
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                These structural improvements will make your resume more readable and professional.
              </p>
              
              <div className="space-y-3">
                {result.structureIssues.map((issue, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 rounded-md bg-slate-50">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm">{issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Content Suggestions</h3>
                <Badge variant="outline" className="bg-blue-50">
                  {result.contentSuggestions.length} suggestions
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Enhance your resume content with these suggestions to better highlight your qualifications.
              </p>
              
              <div className="space-y-3">
                {result.contentSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 rounded-md bg-blue-50">
                    <Lightbulb className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="action" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Action Items</h3>
                <Badge variant="outline" className="bg-green-50">
                  {result.actionItems.length} priority actions
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Focus on these specific actions to immediately improve your resume's effectiveness.
              </p>
              
              <div className="space-y-3">
                {result.actionItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 rounded-md bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {!hideStartNew && (
        <CardFooter className="flex gap-2">
          <Button onClick={onStartNew} variant="outline" className="w-1/2">
            Analyze Another Resume
          </Button>
          <Button className="w-1/2">
            Download Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}