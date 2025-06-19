
"use client"
import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Target, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Progress } from "../../../../components/ui/progress";
import { analyzeResumeWithJobDescription } from "../../../../actions/analyzeResume";
import JobSpecificResults from "./JobSpecificResults";

const JobSpecificAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const textDisplayRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js';
      setPdfJsLoaded(true);
    } else {
      const checkInterval = setInterval(() => {
        if (typeof window !== 'undefined' && window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js';
          setPdfJsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        if (!pdfJsLoaded) {
          setError('PDF.js library failed to load. Please refresh the page.');
        }
      }, 10000);

      return () => clearInterval(checkInterval);
    }
  }, []);

  useEffect(() => {
    if (textDisplayRef.current && extractedText) {
      textDisplayRef.current.textContent = extractedText;
    }
  }, [extractedText]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      extractTextFromPDF(selectedFile);
    } else {
      setFile(null);
      setError('Please upload a PDF file');
    }
  };

  const extractTextFromPDF = async (pdfFile) => {
    if (!pdfJsLoaded) {
      setError('PDF.js library is not loaded yet. Please wait or refresh the page.');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setExtractedText('');

    try {
      const fileURL = URL.createObjectURL(pdfFile);
      const loadingTask = window.pdfjsLib.getDocument(fileURL);

      loadingTask.onProgress = (progressData) => {
        if (progressData.total > 0) {
          const progress = (progressData.loaded / progressData.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      };

      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        setUploadProgress(Math.round((i / pdf.numPages) * 100));
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        let lastY = null;
        let text = '';

        for (const item of textContent.items) {
          if (lastY !== item.transform[5] && text !== '') {
            text += '\n';
          }
          text += item.str;
          lastY = item.transform[5];
        }

        fullText += text + '\n\n';
      }

      URL.revokeObjectURL(fileURL);

      if (fullText.trim() === '') {
        throw new Error('No text could be extracted from this PDF. It may be scanned or image-based.');
      }

      setExtractedText(fullText);
      setUploadProgress(100);
      setCurrentStep(2);
    } catch (err) {
      console.error('Error extracting text from PDF:', err);
      setError('Failed to extract text from PDF: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !extractedText || !jobDescription.trim()) return;

    setIsLoading(true);
    setCurrentStep(3);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('resumeText', extractedText);
      formData.append('jobDescription', jobDescription);

      const result = await analyzeResumeWithJobDescription(formData);
      if (result.success) {
        setAnalysisResult(result.analysis);
        setCurrentStep(4);
      } else {
        setError(result.error || 'Failed to analyze resume');
        setCurrentStep(2);
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume: ' + err.message);
      setCurrentStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Upload Resume', icon: Upload, completed: file && extractedText },
    { number: 2, title: 'Add Job Description', icon: Briefcase, completed: jobDescription.trim().length > 100 },
    { number: 3, title: 'Analyze Match', icon: Target, completed: false },
    { number: 4, title: 'View Results', icon: CheckCircle, completed: analysisResult }
  ];

  if (analysisResult) {
    return <JobSpecificResults analysis={analysisResult} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = step.completed;
            const isPast = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted || isPast 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'bg-primary border-primary text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {isCompleted || isPast ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-primary' : isCompleted || isPast ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-16 transition-all duration-300 ${
                    isPast ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Job-Specific Resume Analysis
          </CardTitle>
          <p className="text-muted-foreground">
            Upload your resume and paste the job description to get a detailed match analysis
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!pdfJsLoaded && (
            <div className="text-center p-6 bg-gray-50 rounded-lg animate-pulse">
              <p className="font-medium text-gray-600">Loading PDF extraction tools...</p>
              <Progress value={50} className="h-2 mt-3" />
            </div>
          )}

          {pdfJsLoaded && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Resume Upload */}
              <div className={`space-y-4 ${currentStep !== 1 && file ? 'opacity-60' : ''}`}>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    file && extractedText ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  Upload Your Resume
                </h3>
                
                {!file ? (
                  <div className="border-3 border-dashed border-primary/20 rounded-xl p-8 text-center bg-gray-50 hover:bg-primary/5 transition-colors duration-300">
                    <input
                      type="file"
                      id="resume-upload"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer block">
                      <div className="flex flex-col items-center p-6">
                        <FileText className="h-16 w-16 text-primary/70 mb-4" />
                        <span className="text-lg text-gray-600 font-medium">
                          Drop your resume here or click to browse
                        </span>
                        <span className="text-sm text-gray-500 mt-2">
                          Supports PDF files only
                        </span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 bg-white p-4 rounded-lg shadow-sm border">
                    <FileText className="h-7 w-7 text-primary" />
                    <span className="font-medium text-lg text-gray-800">{file.name}</span>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}

                {isLoading && currentStep === 1 && (
                  <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                    <Progress value={uploadProgress} className="h-3 mb-3" />
                    <p className="text-primary font-medium">
                      {uploadProgress < 100 ? `Extracting text... ${uploadProgress}%` : 'Processing your resume...'}
                    </p>
                  </div>
                )}
              </div>

              {/* Step 2: Job Description */}
              {file && extractedText && (
                <div className={`space-y-4 ${currentStep !== 2 && jobDescription.trim().length > 100 ? 'opacity-60' : ''}`}>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      jobDescription.trim().length > 100 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      2
                    </div>
                    Paste Job Description
                  </h3>
                  
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Paste the complete job description here including requirements, responsibilities, qualifications, and company information..."
                      value={jobDescription}
                      onChange={handleJobDescriptionChange}
                      className="min-h-[200px] resize-none"
                      disabled={currentStep > 2}
                    />
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>
                        {jobDescription.length} characters 
                        {jobDescription.trim().length < 100 && (
                          <span className="text-amber-600 ml-1">
                            (minimum 100 characters recommended)
                          </span>
                        )}
                      </span>
                      {jobDescription.trim().length >= 100 && (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Good length for analysis
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {file && extractedText && jobDescription.trim().length > 50 && (
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-md"
                    disabled={isLoading || currentStep > 2}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyzing Resume Match...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Analyze Resume Match
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center text-red-500 gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Tips for Best Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Include the complete job description with requirements, responsibilities, and qualifications
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Make sure your resume is up-to-date with your latest experience and skills
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Use clear, readable fonts and standard formatting in your resume PDF
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Include company information and job details for more accurate analysis
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSpecificAnalyzer;