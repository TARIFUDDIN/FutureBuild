// app/resume-analyzer/_components/resume-uploader.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../@/components/ui/label";
import { Upload, FileText, Loader2 } from "lucide-react";
import { analyzeResume, extractResumeText } from "../../../../actions/analyzeResume";
import { toast } from "sonner";
import AnalysisResult from "./analysis-result";

export default function ResumeUploader() {
  
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type: Please upload a PDF or Word document (.pdf, .doc, or .docx)");

      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Invalid file type: Please upload a PDF or Word document (.pdf, .doc, or .docx)");

      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };
  
  const handleAnalyze = async () => {
    if (!file) {
      toast.error("File too large: Maximum file size is 5MB");

      return;
    }
    
    setIsUploading(true);
    
    try {
      // Read the file
      const buffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);
      
      // Extract text from resume
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // This would normally use the server action, but we're simulating here
      // const resumeText = await extractResumeText(fileBuffer, file.type);
      
      // For demo purposes, read text directly (this would be replaced with proper extraction)
      const resumeText = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      });
      
      // Analyze the resume
      const analysis = await analyzeResume(resumeText, jobTitle);
      setAnalysisResult(analysis);
      
      toast.success("Analysis complete: Your resume has been successfully analyzed");

    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error(`Analysis failed: ${error.message || "Failed to analyze resume. Please try again."}`);

    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setFileName("");
    setJobTitle("");
    setAnalysisResult(null);
  };
  
  if (analysisResult) {
    return (
      <div className="mt-6">
        <AnalysisResult 
          result={analysisResult} 
          onStartNew={resetForm}
        />
      </div>
    );
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          We'll analyze your resume against industry standards and provide personalized feedback
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Target Job Title (Optional)</Label>
          <Input 
            id="jobTitle"
            placeholder="e.g., Software Engineer, Marketing Manager"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={isUploading || isAnalyzing}
          />
          <p className="text-xs text-muted-foreground">
            Specifying a job title helps us provide more targeted feedback
          </p>
        </div>
        
        <div>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              file ? "border-primary bg-primary/5" : "border-gray-300"
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="h-10 w-10 text-primary mb-2" />
                <p className="font-medium">{fileName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setFileName("");
                  }}
                  className="mt-2"
                  disabled={isUploading || isAnalyzing}
                >
                  Change file
                </Button>
              </div>
            ) : (
              <>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading || isAnalyzing}
                />
                <label
                  htmlFor="resume-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF or Word Document (max. 5MB)
                  </p>
                </label>
              </>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleAnalyze}
          disabled={!file || isUploading || isAnalyzing}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Resume"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}