
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getResumeAnalyses } from "@/actions/resume-analyzer";
import RecentAnalyses from "../_components/recent-analyses";

const HistoryPage = async () => {
  const analyses = await getResumeAnalyses();
  
  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href="/resume-analyzer">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Resume Analyzer
          </Button>
        </Link>
        
        <div>
          <h1 className="text-6xl font-bold gradient-title">Analysis History</h1>
          <p className="text-muted-foreground">
            Track your resume improvements over time
          </p>
        </div>
      </div>
      
      {analyses.length > 0 ? (
        <div className="mt-8">
          <RecentAnalyses analyses={analyses} showAll />
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No analyses yet</h3>
          <p className="text-muted-foreground mb-6">
            Upload your resume to get started with AI-powered feedback
          </p>
          <Link href="/resume-analyzer/analyze">
            <Button>
              Analyze Your Resume
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;