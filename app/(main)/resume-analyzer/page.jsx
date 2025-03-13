// app/resume-analyzer/page.jsx
import ResumeUploader from "./_components/ResumeUploader";

const ResumeAnalyzerPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-4xl font-bold">Ai Resume Analyzer</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-8">
        <ResumeUploader />
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;