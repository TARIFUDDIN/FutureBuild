'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Progress } from "../../../../@/components/ui/progress";
import { analyzeResume } from "../../../../actions/analyzeResume";
import AnalysisResults from "./AnalysisResults";

const ResumeUploader = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
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
  
        console.log("Extracted text length:", fullText.length);
        console.log("Extracted text:", fullText);
        setExtractedText(fullText);
        setUploadProgress(100);
      } catch (err) {
        console.error('Error extracting text from PDF:', err);
        setError('Failed to extract text from PDF: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!file || !extractedText) return;
  
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('resumeText', extractedText);
  
        const result = await analyzeResume(formData);
        if (result.success) {
          setAnalysisResult(result.analysis);
        } else {
          setError(result.error || 'Failed to analyze resume');
        }
      } catch (err) {
        console.error('Error analyzing resume:', err);
        setError('Failed to analyze resume: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/10 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
            <h2 className="text-2xl font-bold text-center text-primary">Resume Analyzer</h2>
          </div>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="rounded-full bg-primary/15 p-4 mb-4 shadow-md transform hover:scale-105 transition-transform duration-300">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-primary/90">Analyze Your Resume</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Upload your resume to get personalized feedback, ATS compatibility score, and improvement suggestions
              </p>
            </div>
  
            {!pdfJsLoaded && (
              <div className="text-center p-6 bg-gray-50 rounded-lg animate-pulse">
                <p className="font-medium text-gray-600">Loading PDF extraction tools...</p>
                <Progress value={50} className="h-2 mt-3" />
              </div>
            )}
  
            {pdfJsLoaded && (
              <form onSubmit={handleSubmit}>
                <div className="border-3 border-dashed border-primary/20 rounded-xl p-8 text-center bg-gray-50 hover:bg-primary/5 transition-colors duration-300">
                  <input
                    type="file"
                    id="resume-upload"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="resume-upload" 
                    className="cursor-pointer block mb-4"
                  >
                    {file ? (
                        <div className="flex items-center justify-center gap-3 bg-white p-4 rounded-lg shadow-sm">
  <FileText className="h-7 w-7 text-primary" />
  <span className="font-medium text-lg text-gray-800">{file.name}</span>
  <CheckCircle className="h-6 w-6 text-green-500" />
</div>
                    ) : (
                      <div className="flex flex-col items-center p-6">
                        <FileText className="h-16 w-16 text-primary/70 mb-4" />
                        <span className="text-lg text-gray-600 font-medium">
                          Drop your resume here or click to browse
                        </span>
                        <span className="text-sm text-gray-500 mt-2">
                          Supports PDF files only
                        </span>
                      </div>
                    )}
                  </label>
  
                  {isLoading && (
                    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                      <Progress 
                        value={uploadProgress} 
                        className="h-3 mb-3"
                        style={{
                          background: 'linear-gradient(to right, #c7d2fe, #e0e7ff)',
                          borderRadius: '9999px'
                        }}
                      />
                      <p className="text-primary font-medium">
                        {uploadProgress < 100 ? `Extracting text... ${uploadProgress}%` : 'Processing your resume...'}
                      </p>
                    </div>
                  )}
  
                  {error && (
                    <div className="mt-4 flex items-center justify-center text-red-500 gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">{error}</span>
                    </div>
                  )}
  
                  {extractedText && !isLoading && (
                    <Button 
                      type="submit" 
                      className="mt-6 w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-md"
                      disabled={isLoading}
                    >
                      Analyze My Resume
                    </Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
  
        {analysisResult && <AnalysisResults analysis={analysisResult} />}
      </div>
    );
  };
  
  export default ResumeUploader;