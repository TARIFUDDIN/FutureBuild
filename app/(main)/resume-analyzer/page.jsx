// app/resume-analyzer/page.jsx
import { getResumeAnalyses } from '../../../actions/analyzeResume';
import { Card, CardContent } from "../../../@/components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { Upload, FileText, BarChart3 } from "lucide-react";
import RecentAnalyses from "./_components/recent-analyses";

const ResumeAnalyzerPage = async () => {
  const analyses = await getResumeAnalyses();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Resume Analyzer
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Analyze New Resume</h3>
            <p className="text-muted-foreground mb-6">
              Upload your resume to get personalized feedback and improvement suggestions
            </p>
            <Link href="/resume-analyzer/analyze">
              <Button className="w-full">
                Start Analysis
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">View Past Analyses</h3>
            <p className="text-muted-foreground mb-6">
              Track your resume improvements over time and review previous feedback
            </p>
            <Link href="/resume-analyzer/history">
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {analyses.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Recent Analyses</h2>
          <RecentAnalyses analyses={analyses.slice(0, 3)} />
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzerPage;