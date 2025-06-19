// ResumeAnalyzerPage.jsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Button } from "../../../components/ui/button";
import { FileText, Target, ArrowRight, CheckCircle, Zap, Award } from "lucide-react";
import ResumeUploader from "./_components/ResumeUploader";
import JobSpecificAnalyzer from "./_components/JobSpecificAnalyzer";

const ResumeAnalyzerPage = () => {
  const [selectedAnalysisType, setSelectedAnalysisType] = useState(null);

  const analysisOptions = [
    {
      id: 'general',
      title: 'General Resume Analysis',
      description: 'Get comprehensive feedback on your resume structure, ATS compatibility, and overall quality',
      icon: FileText,
      features: [
        'ATS compatibility score',
        'Skills gap analysis',
        'Format and structure review',
        'Industry-specific recommendations',
        'Course suggestions',
        'Video tutorials'
      ],
      color: 'bg-gradient-to-r from-blue-600 to-blue-500',
      recommended: false
    },
    {
      id: 'job-specific',
      title: 'Job-Specific Analysis',
      description: 'Analyze your resume against a specific job description for targeted feedback',
      icon: Target,
      features: [
        'Job match percentage',
        'Required vs found skills',
        'Experience alignment check',
        'Role-specific improvements',
        'Interview preparation tips',
        'Competitive advantage analysis'
      ],
      color: 'bg-gradient-to-r from-green-600 to-green-500',
      recommended: true
    }
  ];

  const handleAnalysisTypeSelect = (type) => {
    setSelectedAnalysisType(type);
  };

  const handleBackToSelection = () => {
    setSelectedAnalysisType(null);
  };

  if (selectedAnalysisType) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="w-full">
            <Button 
              variant="outline" 
              onClick={handleBackToSelection}
              className="mb-5 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              ← Back to Analysis Options
            </Button>
            <h1 className="text-4xl font-black tracking-tight mb-3 bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
              {selectedAnalysisType === 'general' ? 'General Resume Analysis' : 'Job-Specific Resume Analysis'}
            </h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">
              {selectedAnalysisType === 'general' 
                ? 'Get comprehensive feedback on your resume quality and ATS compatibility'
                : 'Analyze how well your resume matches a specific job opportunity'
              }
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-8">
          {selectedAnalysisType === 'general' ? (
            <ResumeUploader />
          ) : (
            <JobSpecificAnalyzer />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tight mb-6 bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text leading-tight">
          AI Resume Analyzer
        </h1>
        <p className="text-xl font-medium text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Choose the type of analysis that best fits your needs. Get personalized feedback, 
          ATS scores, and actionable recommendations to improve your chances of landing your dream job.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
        {analysisOptions.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <Card 
              key={option.id}
              className={`relative overflow-hidden transition-all duration-300 cursor-pointer border-2 hover:shadow-2xl ${
                option.recommended ? 'ring-2 ring-green-300 border-green-400 shadow-lg shadow-green-500/10' : 'hover:border-primary/60 shadow-md'
              }`}
              onClick={() => handleAnalysisTypeSelect(option.id)}
            >
              {option.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-1.5 text-sm font-bold rounded-bl-md shadow-md">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    RECOMMENDED
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-5">
                <div className="flex items-center gap-5 mb-5">
                  <div className={`${option.color} rounded-full p-4 text-white shadow-lg`}>
                    <IconComponent className="h-9 w-9" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2">{option.title}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {option.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4 mb-8">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    What You'll Get:
                  </h4>
                  <ul className="space-y-3">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-base font-medium text-gray-800 dark:text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className="w-full group font-bold text-base py-6"
                  variant={option.recommended ? "default" : "outline"}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="mt-20">
        <h2 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Feature Comparison
        </h2>
        <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/80">
                    <th className="text-left p-5 font-bold text-lg">Feature</th>
                    <th className="text-center p-5 font-bold text-lg">General Analysis</th>
                    <th className="text-center p-5 font-bold text-lg">Job-Specific Analysis</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['ATS Compatibility Score', true, true],
                    ['Skills Analysis', true, true],
                    ['Format Review', true, true],
                    ['Job Match Percentage', false, true],
                    ['Required Skills Gap', false, true],
                    ['Experience Alignment', false, true],
                    ['Interview Preparation Tips', false, true],
                    ['Competitive Advantage Analysis', false, true],
                    ['Industry Recommendations', true, false],
                    ['General Course Suggestions', true, false],
                    ['Role-Specific Improvements', false, true],
                    ['Company-Specific Insights', false, true]
                  ].map(([feature, general, jobSpecific], index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                      <td className="p-5 font-semibold text-base">{feature}</td>
                      <td className="p-5 text-center">
                        {general ? (
                          <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600 font-medium">—</span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        {jobSpecific ? (
                          <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600 font-medium">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 mb-16">
        <h2 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold">When should I use General Analysis?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base font-medium">
                Use general analysis when you want to improve your resume's overall quality, 
                ATS compatibility, and get industry-specific recommendations without targeting 
                a specific job.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-800/90 via-violet-800/80 to-purple-700/90 backdrop-blur-sm border-2 border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-50">When should I use Job-Specific Analysis?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base font-medium text-purple-100">
                Use job-specific analysis when you have a particular job opportunity in mind 
                and want to optimize your resume specifically for that role to maximize your 
                chances of getting an interview.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-800/90 via-violet-800/80 to-purple-700/90 backdrop-blur-sm border-2 border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-50">How accurate is the job matching?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base font-medium text-purple-100">
                Our AI analyzes your resume against the job description using the same criteria 
                that ATS systems and hiring managers use, providing realistic match percentages 
                and actionable feedback.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Can I use both analysis types?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base font-medium">
                Absolutely! Many users start with general analysis to improve their resume 
                foundation, then use job-specific analysis for each role they apply to.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;
