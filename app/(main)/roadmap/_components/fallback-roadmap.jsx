import React, { useState } from 'react';
import { Clock, BookOpen, CheckCircle, Play, Star, Award, Target, TrendingUp, Download, Printer, RefreshCw } from 'lucide-react';

const EnhancedFallbackRoadmap = ({ code, title }) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  const parseTextRoadmap = (mermaidCode) => {
    try {
      const lines = mermaidCode.split('\n');
      let sections = [];
      
      // Enhanced parsing of node definitions
      for (const line of lines) {
        // Look for node definitions with content in brackets or parentheses
        const nodeMatch = line.match(/([A-Za-z0-9]+)\[([^\]]+)\]|([A-Za-z0-9]+)\(([^\)]+)\)/);
        if (nodeMatch) {
          const content = nodeMatch[2] || nodeMatch[4];
          if (content && !content.includes('Recommended Resources')) {
            // Extract time duration if present
            const timeMatch = content.match(/(\d+)\s*weeks?/i);
            const weeks = timeMatch ? parseInt(timeMatch[1]) : 4;
            const name = content.replace(/\s*\d+\s*weeks?$/i, '').trim();
            
            sections.push({
              name,
              weeks,
              description: generateDescription(name),
              difficulty: estimateDifficulty(name),
              category: categorizeStep(name)
            });
          }
        }
      }
      
      return sections.length > 0 ? sections : generateDefaultSections(title);
    } catch (error) {
      return generateDefaultSections(title);
    }
  };

  const generateDescription = (stepName) => {
    const descriptions = {
      'HTML5': 'Learn semantic markup, accessibility, and modern HTML5 features',
      'CSS3': 'Master styling, layouts, animations, and responsive design',
      'JavaScript': 'Understand fundamentals, ES6+, and DOM manipulation',
      'React': 'Build dynamic user interfaces with components and hooks',
      'Node.js': 'Server-side JavaScript development and runtime',
      'Python': 'General-purpose programming with clean syntax',
      'Database': 'Data storage, queries, and database design',
      'API': 'RESTful services and application programming interfaces',
      'Testing': 'Quality assurance and automated testing strategies',
      'Deployment': 'Production deployment and DevOps practices',
      'Git': 'Version control and collaborative development',
      'Security': 'Best practices for secure application development'
    };
    
    // Find matching description
    for (const [key, desc] of Object.entries(descriptions)) {
      if (stepName.toLowerCase().includes(key.toLowerCase())) {
        return desc;
      }
    }
    
    return `Master ${stepName} concepts and practical implementation`;
  };

  const estimateDifficulty = (stepName) => {
    const beginner = ['html', 'css', 'basic', 'intro', 'fundamental', 'git'];
    const advanced = ['advanced', 'architecture', 'performance', 'optimization', 'security', 'microservice'];
    
    const name = stepName.toLowerCase();
    if (beginner.some(keyword => name.includes(keyword))) return 'Beginner';
    if (advanced.some(keyword => name.includes(keyword))) return 'Advanced';
    return 'Intermediate';
  };

  const categorizeStep = (stepName) => {
    const categories = {
      'Frontend': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'ui', 'styling'],
      'Backend': ['node', 'python', 'java', 'api', 'server', 'database'],
      'Tools': ['git', 'docker', 'testing', 'deployment'],
      'Concepts': ['fundamental', 'principle', 'design', 'architecture']
    };
    
    const name = stepName.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return category;
      }
    }
    return 'General';
  };

  const generateDefaultSections = (title) => {
    return [
      { name: 'Foundation Skills', weeks: 4, description: 'Build strong fundamentals', difficulty: 'Beginner', category: 'Concepts' },
      { name: 'Core Technologies', weeks: 6, description: 'Learn essential tools and frameworks', difficulty: 'Intermediate', category: 'Technical' },
      { name: 'Practical Projects', weeks: 5, description: 'Apply knowledge through hands-on projects', difficulty: 'Intermediate', category: 'Practice' },
      { name: 'Advanced Concepts', weeks: 4, description: 'Explore advanced topics and patterns', difficulty: 'Advanced', category: 'Advanced' },
      { name: 'Professional Skills', weeks: 3, description: 'Develop industry-ready capabilities', difficulty: 'Intermediate', category: 'Professional' }
    ];
  };

  const roadmapSections = parseTextRoadmap(code);
  const totalWeeks = roadmapSections.reduce((sum, section) => sum + section.weeks, 0);
  const completionPercentage = (completedSteps.size / roadmapSections.length) * 100;

  const toggleStepCompletion = (index) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-purple-100 text-purple-800',
      'Tools': 'bg-orange-100 text-orange-800',
      'Concepts': 'bg-indigo-100 text-indigo-800',
      'Technical': 'bg-cyan-100 text-cyan-800',
      'Practice': 'bg-pink-100 text-pink-800',
      'Advanced': 'bg-red-100 text-red-800',
      'Professional': 'bg-emerald-100 text-emerald-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const roadmapData = {
      title,
      totalWeeks,
      totalSteps: roadmapSections.length,
      estimatedMonths: Math.ceil(totalWeeks / 4),
      steps: roadmapSections.map((section, index) => ({
        step: index + 1,
        name: section.name,
        duration: `${section.weeks} weeks`,
        difficulty: section.difficulty,
        category: section.category,
        description: section.description
      }))
    };
    
    const blob = new Blob([JSON.stringify(roadmapData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = `roadmap-${title.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5 rounded-3xl" />
      
      <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              🎯 {title} Learning Path
            </h2>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">{totalWeeks} weeks</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <BookOpen className="h-4 w-4" />
                <span className="font-semibold">{roadmapSections.length} steps</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <Target className="h-4 w-4" />
                <span className="font-semibold">~{Math.ceil(totalWeeks / 4)} months</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Learning Progress</span>
                <span className="text-sm font-semibold text-gray-900">{Math.round(completionPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>

        {/* Learning Path */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 rounded-2xl" />
          
          <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Award className="h-4 w-4 text-white" />
              </div>
              Your Learning Journey
            </h3>
            
            <div className="space-y-6">
              {roadmapSections.map((section, index) => {
                const isCompleted = completedSteps.has(index);
                const isActive = index === currentStep;
                
                return (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer"
                    onClick={() => setCurrentStep(index)}
                  >
                    {/* Connection line */}
                    {index < roadmapSections.length - 1 && (
                      <div className="absolute left-6 top-16 h-6 w-0.5 bg-gradient-to-b from-blue-300 to-purple-300 opacity-30"></div>
                    )}
                    
                    <div 
                      className={`relative border-2 rounded-2xl p-6 transition-all duration-300 ${
                        isActive 
                          ? 'border-blue-400 bg-blue-50/50 shadow-lg transform scale-[1.02]' 
                          : isCompleted 
                          ? 'border-green-300 bg-green-50/30' 
                          : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Step indicator */}
                        <div className="flex-shrink-0 relative">
                          <div 
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-gradient-to-br from-green-500 to-green-600' 
                                : isActive 
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                                : 'bg-gradient-to-br from-gray-400 to-gray-500'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-6 w-6" />
                            ) : (
                              <span className="text-lg">{index + 1}</span>
                            )}
                          </div>
                          
                          {/* Completion toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStepCompletion(index);
                            }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md border-2 border-gray-200 flex items-center justify-center hover:border-blue-400 transition-colors"
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <Play className="h-3 w-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className={`text-lg font-semibold transition-colors ${
                                isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
                              }`}>
                                {section.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                            </div>
                            {isActive && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                Current
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center flex-wrap gap-3">
                            <span className="flex items-center text-sm font-medium text-blue-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {section.weeks} weeks
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(section.difficulty)}`}>
                              {section.difficulty}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(section.category)}`}>
                              {section.category}
                            </span>
                          </div>

                          {/* Progress bar for individual step */}
                          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-700 ${
                                isCompleted 
                                  ? 'w-full bg-gradient-to-r from-green-400 to-green-600' 
                                  : isActive 
                                  ? 'w-3/4 bg-gradient-to-r from-blue-400 to-blue-600' 
                                  : 'w-0 bg-gradient-to-r from-gray-300 to-gray-400'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Success Tips */}
        <div className="mt-8 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/10 to-red-400/10" />
          <div className="relative bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Learning Strategy</h4>
                <div className="text-amber-800 text-sm space-y-2">
                  <p>• Click on any step to focus on it and track your progress with the completion buttons</p>
                  <p>• Build projects after major milestones to reinforce your learning</p>
                  <p>• Join communities and find mentors in your chosen field</p>
                  <p>• Practice consistently - small daily efforts compound over time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>Structured Learning Path</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span>Industry Relevant</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 text-purple-500 mr-1" />
                <span>Career Focused</span>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Generate New Roadmap
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            This is a structured learning roadmap. For more detailed and personalized paths, 
            try generating with specific parameters or use our AI-powered roadmap generator.
          </p>
        </div>
      </div>
    </div>
  );
};

// Demo component
const FallbackDemo = () => {
  const sampleMermaidCode = `flowchart TD
    A[HTML5 Fundamentals 3 weeks]
    B[CSS3 Advanced Styling 4 weeks]
    C[JavaScript ES6+ 5 weeks]
    D[React.js Components 6 weeks]
    E[State Management 4 weeks]
    F[API Integration 3 weeks]
    G[Testing Strategies 3 weeks]
    H[Deployment Production 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H`;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 Enhanced Roadmap Viewer</h1>
        <p className="text-gray-600">Interactive learning path with progress tracking and professional design</p>
      </div>
      
      <EnhancedFallbackRoadmap 
        code={sampleMermaidCode} 
        title="Frontend Development" 
      />
    </div>
  );
};

export default FallbackDemo;