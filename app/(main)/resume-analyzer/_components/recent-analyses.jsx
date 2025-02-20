// app/resume-analyzer/_components/recent-analyses.jsx
import Link from "next/link";
import { Card, CardContent } from "../../../../@/components/ui/card";
import { Badge } from "../../../../@/components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Progress } from "../../../../@/components/ui/progress";
import { ChevronRight, Clock, Award } from "lucide-react";

export default function RecentAnalyses({ analyses, showAll = false }) {
  // Format date to be readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  // Determine score color based on ATS score
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };
  
  // Show only the first n analyses unless showAll is true
  const displayedAnalyses = showAll ? analyses : analyses.slice(0, 3);
  
  return (
    <div className="space-y-4">
      {displayedAnalyses.map((analysis) => (
        <Card key={analysis.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg">
                    {analysis.jobTitle} Resume Analysis
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {analysis.industry || "General"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatDate(analysis.createdAt)}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-primary" />
                    <span className={`text-xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                      {analysis.atsScore}
                    </span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <Progress
                    value={analysis.atsScore}
                    className="w-24 h-1.5 mt-1"
                  />
                </div>
                
                <Link href={`/resume-analyzer/view/${analysis.id}`}>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {!showAll && analyses.length > 3 && (
        <div className="flex justify-center mt-4">
          <Link href="/resume-analyzer/history">
            <Button variant="outline">
              View All Analyses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}