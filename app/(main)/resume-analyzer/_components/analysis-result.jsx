"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Progress } from "../../../../@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Award, CheckCircle, AlertTriangle, FileType, List, Lightbulb, Download } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { useEffect, useState } from "react";

export default function AnalysisResult({ result, hideStartNew = false, onStartNew }) {
  const [debugInfo, setDebugInfo] = useState(null);
  useEffect(() => {
    if (result) {
      console.log("Analysis Result Data:", result);
      setDebugInfo({
        hasStructureIssues: Array.isArray(result.structureIssues) && result.structureIssues.length > 0,
        hasContentSuggestions: Array.isArray(result.contentSuggestions) && result.contentSuggestions.length > 0,
        hasActionItems: Array.isArray(result.actionItems) && result.actionItems.length > 0,
        resultKeys: Object.keys(result)
      });
    }
  }, [result]);

  if (!result) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">No analysis data available</div>
        </CardContent>
      </Card>
    );
  }
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };
  
  // Generate PDF report - could be implemented later
  const handleDownloadReport = () => {
    // This is a placeholder for future implementation
    alert("Download functionality will be implemented in a future update");
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      {debugInfo && (
        <div className="bg-gray-100 p-2 text-xs border-b border-gray-200">
          <details>
            <summary className="cursor-pointer font-bold">Debug Info (click to expand)</summary>
            <pre className="mt-2 whitespace-pre-wrap">
              Result Keys: {JSON.stringify(debugInfo.resultKeys, null, 2)}
              Has Structure Issues: {debugInfo.hasStructureIssues.toString()}
              Has Content Suggestions: {debugInfo.hasContentSuggestions.toString()}
              Has Action Items: {debugInfo.hasActionItems.toString()}
            </pre>
          </details>
        </div>
      )}
      
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
                  {result.missingKeywords ? result.missingKeywords.length : 0} keywords missing
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                These industry-specific keywords could help your resume pass ATS filters and catch recruiters' attention.
              </p>
              
              {result.missingKeywords && result.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">No missing keywords detected.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="structure" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Structure & Formatting</h3>
                <Badge variant="outline" className="bg-amber-50">
                  {result.structureIssues && Array.isArray(result.structureIssues) ? result.structureIssues.length : 0} issues found
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                These structural improvements will make your resume more readable and professional.
              </p>
              
              {result.structureIssues && Array.isArray(result.structureIssues) && result.structureIssues.length > 0 ? (
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
              ) : (
                <p className="text-sm italic text-muted-foreground">No structural issues detected.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Content Suggestions</h3>
                <Badge variant="outline" className="bg-blue-50">
                  {result.contentSuggestions && Array.isArray(result.contentSuggestions) ? result.contentSuggestions.length : 0} suggestions
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Enhance your resume content with these suggestions to better highlight your qualifications.
              </p>
              
              {result.contentSuggestions && Array.isArray(result.contentSuggestions) && result.contentSuggestions.length > 0 ? (
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
              ) : (
                <p className="text-sm italic text-muted-foreground">No content suggestions available.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="action" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Action Items</h3>
                <Badge variant="outline" className="bg-green-50">
                  {result.actionItems && Array.isArray(result.actionItems) ? result.actionItems.length : 0} priority actions
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Focus on these specific actions to immediately improve your resume's effectiveness.
              </p>
              
              {result.actionItems && Array.isArray(result.actionItems) && result.actionItems.length > 0 ? (
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
              ) : (
                <p className="text-sm italic text-muted-foreground">No action items available.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {!hideStartNew && (
        <CardFooter className="flex gap-2">
          <Button onClick={onStartNew} variant="outline" className="w-1/2">
            Analyze Another Resume
          </Button>
          <Button className="w-1/2" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}