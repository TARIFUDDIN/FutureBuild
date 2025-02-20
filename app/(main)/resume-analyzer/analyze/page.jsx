// app/resume-analyzer/analyze/page.jsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import ResumeUploader from "../_components/resume-uploader";

const AnalyzePage = () => {
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
          <h1 className="text-6xl font-bold gradient-title">Analyze Resume</h1>
          <p className="text-muted-foreground">
            Get AI-powered feedback on your resume to increase your chances of landing interviews
          </p>
        </div>
      </div>
      
      <ResumeUploader />
    </div>
  );
};

export default AnalyzePage;