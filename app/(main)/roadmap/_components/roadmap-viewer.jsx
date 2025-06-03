import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../../../../@/components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Download, Printer, RefreshCw, Clock, BookOpen, Target, Code2, Database, Cloud, Smartphone, Globe, Shield, Palette, Brain, CheckCircle, Play } from "lucide-react";

// Enhanced technology mapping with fallback icons
const technologyMap = {
  // Frontend Technologies
  'html': { icon: 'https://cdn.simpleicons.org/html5', color: '#E34F26', category: 'Frontend' },
  'css': { icon: 'https://cdn.simpleicons.org/css3', color: '#1572B6', category: 'Frontend' },
  'javascript': { icon: 'https://cdn.simpleicons.org/javascript', color: '#F7DF1E', category: 'Frontend' },
  'typescript': { icon: 'https://cdn.simpleicons.org/typescript', color: '#3178C6', category: 'Frontend' },
  'react': { icon: 'https://cdn.simpleicons.org/react', color: '#61DAFB', category: 'Frontend' },
  'next': { icon: 'https://cdn.simpleicons.org/nextdotjs/white', color: '#000000', category: 'Frontend' },
  'vue': { icon: 'https://cdn.simpleicons.org/vuedotjs', color: '#4FC08D', category: 'Frontend' },
  'angular': { icon: 'https://cdn.simpleicons.org/angular', color: '#DD0031', category: 'Frontend' },
  'tailwind': { icon: 'https://cdn.simpleicons.org/tailwindcss', color: '#06B6D4', category: 'Frontend' },
  'bootstrap': { icon: 'https://cdn.simpleicons.org/bootstrap', color: '#7952B3', category: 'Frontend' },
  
  // Backend Technologies
  'node': { icon: 'https://cdn.simpleicons.org/nodedotjs', color: '#339933', category: 'Backend' },
  'express': { icon: 'https://cdn.simpleicons.org/express/white', color: '#000000', category: 'Backend' },
  'nestjs': { icon: 'https://cdn.simpleicons.org/nestjs', color: '#E0234E', category: 'Backend' },
  'python': { icon: 'https://cdn.simpleicons.org/python', color: '#3776AB', category: 'Backend' },
  'django': { icon: 'https://cdn.simpleicons.org/django', color: '#092E20', category: 'Backend' },
  'flask': { icon: 'https://cdn.simpleicons.org/flask', color: '#000000', category: 'Backend' },
  'php': { icon: 'https://cdn.simpleicons.org/php', color: '#777BB4', category: 'Backend' },
  'laravel': { icon: 'https://cdn.simpleicons.org/laravel', color: '#FF2D20', category: 'Backend' },
  
  // Databases
  'postgresql': { icon: 'https://cdn.simpleicons.org/postgresql', color: '#336791', category: 'Database' },
  'mysql': { icon: 'https://cdn.simpleicons.org/mysql', color: '#4479A1', category: 'Database' },
  'mongodb': { icon: 'https://cdn.simpleicons.org/mongodb', color: '#47A248', category: 'Database' },
  'redis': { icon: 'https://cdn.simpleicons.org/redis', color: '#DC382D', category: 'Database' },
  'sqlite': { icon: 'https://cdn.simpleicons.org/sqlite', color: '#003B57', category: 'Database' },
  'prisma': { icon: 'https://cdn.simpleicons.org/prisma', color: '#2D3748', category: 'Database' },
  
  // DevOps & Cloud
  'docker': { icon: 'https://cdn.simpleicons.org/docker', color: '#2496ED', category: 'DevOps' },
  'kubernetes': { icon: 'https://cdn.simpleicons.org/kubernetes', color: '#326CE5', category: 'DevOps' },
  'aws': { icon: 'https://cdn.simpleicons.org/amazonaws', color: '#FF9900', category: 'Cloud' },
  'azure': { icon: 'https://cdn.simpleicons.org/microsoftazure', color: '#0078D4', category: 'Cloud' },
  'gcp': { icon: 'https://cdn.simpleicons.org/googlecloud', color: '#4285F4', category: 'Cloud' },
  'vercel': { icon: 'https://cdn.simpleicons.org/vercel/white', color: '#000000', category: 'Cloud' },
  'netlify': { icon: 'https://cdn.simpleicons.org/netlify', color: '#00C7B7', category: 'Cloud' },
  
  // Tools
  'git': { icon: 'https://cdn.simpleicons.org/git', color: '#F05032', category: 'Tools' },
  'github': { icon: 'https://cdn.simpleicons.org/github/white', color: '#181717', category: 'Tools' },
  'gitlab': { icon: 'https://cdn.simpleicons.org/gitlab', color: '#FC6D26', category: 'Tools' },
  'jenkins': { icon: 'https://cdn.simpleicons.org/jenkins', color: '#D24939', category: 'Tools' },
  
  // Mobile
  'flutter': { icon: 'https://cdn.simpleicons.org/flutter', color: '#02569B', category: 'Mobile' },
  'swift': { icon: 'https://cdn.simpleicons.org/swift', color: '#FA7343', category: 'Mobile' },
  'kotlin': { icon: 'https://cdn.simpleicons.org/kotlin', color: '#7F52FF', category: 'Mobile' },
  'dart': { icon: 'https://cdn.simpleicons.org/dart', color: '#0175C2', category: 'Mobile' },
  
  // Data Science
  'pandas': { icon: 'https://cdn.simpleicons.org/pandas', color: '#150458', category: 'Data Science' },
  'numpy': { icon: 'https://cdn.simpleicons.org/numpy', color: '#013243', category: 'Data Science' },
  'tensorflow': { icon: 'https://cdn.simpleicons.org/tensorflow', color: '#FF6F00', category: 'ML' },
  'pytorch': { icon: 'https://cdn.simpleicons.org/pytorch', color: '#EE4C2C', category: 'ML' },
  'jupyter': { icon: 'https://cdn.simpleicons.org/jupyter', color: '#F37626', category: 'Data Science' },
};

function getTechnologyIcon(stepName) {
  const lowerName = stepName.toLowerCase();
  
  // Check for specific technology mentions
  for (const [key, value] of Object.entries(technologyMap)) {
    if (lowerName.includes(key)) {
      return { hasIcon: true, ...value };
    }
  }
  
  // Fallback to category-based icons for generic terms
  if (lowerName.includes('frontend') || lowerName.includes('ui') || lowerName.includes('styling') || lowerName.includes('design')) {
    return { hasIcon: true, icon: null, color: '#3B82F6', category: 'Frontend', fallbackIcon: <Palette className="h-5 w-5" /> };
  }
  
  if (lowerName.includes('backend') || lowerName.includes('server') || lowerName.includes('api')) {
    return { hasIcon: true, icon: null, color: '#10B981', category: 'Backend', fallbackIcon: <Database className="h-5 w-5" /> };
  }
  
  if (lowerName.includes('database') || lowerName.includes('sql') || lowerName.includes('data')) {
    return { hasIcon: true, icon: null, color: '#F59E0B', category: 'Database', fallbackIcon: <Database className="h-5 w-5" /> };
  }
  
  if (lowerName.includes('cloud') || lowerName.includes('deploy') || lowerName.includes('hosting')) {
    return { hasIcon: true, icon: null, color: '#8B5CF6', category: 'Cloud', fallbackIcon: <Cloud className="h-5 w-5" /> };
  }
  
  if (lowerName.includes('mobile') || lowerName.includes('app')) {
    return { hasIcon: true, icon: null, color: '#EC4899', category: 'Mobile', fallbackIcon: <Smartphone className="h-5 w-5" /> };
  }
  
  if (lowerName.includes('security') || lowerName.includes('auth')) {
    return { hasIcon: true, icon: null, color: '#EF4444', category: 'Security', fallbackIcon: <Shield className="h-5 w-5" /> };
  }
  
  if (lowerName.includes('testing') || lowerName.includes('debug')) {
    return { hasIcon: true, icon: null, color: '#06B6D4', category: 'Testing', fallbackIcon: <Code2 className="h-5 w-5" /> };
  }
  
  if (lowerName.includes('learn') || lowerName.includes('fundamental') || lowerName.includes('basic')) {
    return { hasIcon: true, icon: null, color: '#6366F1', category: 'Learning', fallbackIcon: <BookOpen className="h-5 w-5" /> };
  }
  
  if (lowerName.includes('project') || lowerName.includes('portfolio')) {
    return { hasIcon: true, icon: null, color: '#F97316', category: 'Project', fallbackIcon: <Target className="h-5 w-5" /> };
  }
  
  if (lowerName.includes('machine learning') || lowerName.includes('ai') || lowerName.includes('ml')) {
    return { hasIcon: true, icon: null, color: '#7C3AED', category: 'AI/ML', fallbackIcon: <Brain className="h-5 w-5" /> };
  }
  
  // No icon for very generic steps
  return { hasIcon: false };
}

export default function RoadmapViewer({ code, title }) {
  const [roadmapStats, setRoadmapStats] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (code) {
      const stats = extractRoadmapStats(code);
      const techs = extractTechnologies(code);
      setRoadmapStats(stats);
      setTechnologies(techs);
      
      // Animation effect on load
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
  }, [code]);

  const extractRoadmapStats = (mermaidCode) => {
    const lines = mermaidCode.split('\n');
    let totalWeeks = 0;
    let stepCount = 0;

    for (const line of lines) {
      const match = line.match(/[A-Z0-9]+\[([^\]]+)\]/);
      if (match) {
        stepCount++;
        const content = match[1];
        
        const weekMatch = content.match(/(\d+)\s*weeks?/i);
        if (weekMatch) {
          totalWeeks += parseInt(weekMatch[1]);
        }
      }
    }

    return {
      totalWeeks,
      stepCount,
      estimatedMonths: Math.ceil(totalWeeks / 4)
    };
  };

  const extractTechnologies = (mermaidCode) => {
    const lines = mermaidCode.split('\n');
    const techs = [];

    for (const line of lines) {
      const match = line.match(/[A-Z0-9]+\[([^\]]+)\]/);
      if (match) {
        const content = match[1];
        const stepName = content.replace(/\s*\d+\s*weeks?$/i, '').trim();
        const weekMatch = content.match(/(\d+)\s*weeks?/i);
        const weeks = weekMatch ? parseInt(weekMatch[1]) : 4;
        
        const techInfo = getTechnologyIcon(stepName);
        techs.push({
          name: stepName,
          weeks,
          ...techInfo
        });
      }
    }

    return techs;
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
  };

  const toggleStepCompletion = (index) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    
    const technologiesHtml = technologies.map((tech, index) => `
      <div style="display: flex; align-items: center; padding: 16px; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: linear-gradient(135deg, ${tech.color || '#6366F1'} 0%, ${tech.color || '#6366F1'}dd 100%); color: white; border-radius: 50%; margin-right: 20px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px ${tech.color || '#6366F1'}33;">
          ${index + 1}
        </div>
        <div style="flex: 1;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 4px;">${tech.name}</h3>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">${tech.weeks} weeks • ${tech.category || 'Technology'}</p>
        </div>
      </div>
    `).join('');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Learning Roadmap: ${title}</title>
          <style>
            body { 
              font-family: 'Inter', system-ui, sans-serif; 
              padding: 24px; 
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 20px;
              padding: 32px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            h1 { 
              text-align: center; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 32px;
              font-size: 32px;
              font-weight: 800;
            }
            .stats {
              display: flex;
              justify-content: center;
              gap: 32px;
              margin-bottom: 40px;
            }
            .stat-item {
              text-align: center;
              padding: 20px;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border-radius: 16px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            .stat-number {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
              margin-top: 4px;
              font-weight: 500;
            }
            .roadmap-container {
              max-width: 800px;
              margin: 0 auto;
            }
            @media print { 
              body { margin: 0; padding: 15px; background: white; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 ${title} Roadmap</h1>
            <div class="stats">
              <div class="stat-item">
                <div class="stat-number">${roadmapStats?.totalWeeks || 0}</div>
                <div class="stat-label">Total Weeks</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${technologies.length}</div>
                <div class="stat-label">Learning Steps</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${roadmapStats?.estimatedMonths || 0}</div>
                <div class="stat-label">Months</div>
              </div>
            </div>
            <div class="roadmap-container">
              ${technologiesHtml}
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleDownload = () => {
    const roadmapData = {
      title,
      stats: roadmapStats,
      steps: technologies.map((tech, index) => ({
        step: index + 1,
        name: tech.name,
        duration: `${tech.weeks} weeks`,
        category: tech.category
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

  const StepCard = ({ tech, index, isActive, isCompleted }) => {
    const cardStyle = {
      background: isActive 
        ? `linear-gradient(135deg, ${tech.color || '#6366F1'}15 0%, ${tech.color || '#6366F1'}05 100%)`
        : isCompleted
        ? 'linear-gradient(135deg, #10B98115 0%, #10B98105 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderColor: isActive 
        ? tech.color || '#6366F1' 
        : isCompleted 
        ? '#10B981' 
        : '#e5e7eb',
      boxShadow: isActive 
        ? `0 8px 32px ${tech.color || '#6366F1'}20, 0 0 0 1px ${tech.color || '#6366F1'}30`
        : isCompleted
        ? '0 8px 32px #10B98120, 0 0 0 1px #10B98130'
        : '0 4px 6px rgba(0, 0, 0, 0.05)',
      transform: isActive ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
    };

    return (
      <div 
        className={`relative group cursor-pointer transition-all duration-500 ease-out ${
          isAnimating ? 'animate-pulse' : ''
        }`}
        style={{
          animationDelay: `${index * 150}ms`,
        }}
        onClick={() => handleStepClick(index)}
      >
        {/* Glowing background effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${tech.color || '#6366F1'}10 0%, ${tech.color || '#6366F1'}05 100%)`,
            filter: 'blur(8px)',
            transform: 'scale(1.05)',
          }}
        />
        
        <div 
          className={`relative border-2 rounded-2xl p-6 transition-all duration-500 ease-out hover:shadow-2xl ${
            isCompleted ? 'ring-2 ring-green-200' : ''
          }`}
          style={cardStyle}
        >
          {/* Connection line to next step */}
          {index < technologies.length - 1 && (
            <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 z-10">
              <div 
                className="w-1 h-16 rounded-full transition-all duration-300"
                style={{
                  background: `linear-gradient(180deg, ${tech.color || '#6366F1'} 0%, ${technologies[index + 1]?.color || '#6366F1'} 100%)`,
                  boxShadow: `0 0 12px ${tech.color || '#6366F1'}30`,
                }}
              />
            </div>
          )}
          
          <div className="flex items-start space-x-5">
            <div className="flex-shrink-0 relative">
              {/* Main icon container */}
              <div 
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'ring-4 ring-white shadow-xl' : 'shadow-lg'
                }`}
                style={{
                  background: tech.hasIcon 
                    ? `linear-gradient(135deg, ${tech.color || '#6366F1'} 0%, ${tech.color || '#6366F1'}dd 100%)`
                    : `linear-gradient(135deg, ${tech.color || '#6366F1'} 0%, ${tech.color || '#6366F1'}dd 100%)`,
                  boxShadow: `0 8px 24px ${tech.color || '#6366F1'}30`,
                }}
              >
                {tech.hasIcon ? (
                  tech.icon ? (
                    <img 
                      src={tech.icon} 
                      alt={tech.name}
                      className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                      style={{ filter: tech.color === '#000000' ? 'brightness(10)' : 'brightness(1)' }}
                    />
                  ) : (
                    <div style={{ color: 'white' }} className="transition-transform duration-300 group-hover:scale-110">
                      {tech.fallbackIcon}
                    </div>
                  )
                ) : (
                  <span className="text-white font-bold text-xl transition-transform duration-300 group-hover:scale-110">
                    {index + 1}
                  </span>
                )}
              </div>
              
              {/* Step number badge */}
              <div 
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all duration-300"
                style={{
                  background: isCompleted 
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : `linear-gradient(135deg, ${tech.color || '#6366F1'} 0%, ${tech.color || '#6366F1'}dd 100%)`,
                  boxShadow: `0 4px 12px ${isCompleted ? '#10B981' : tech.color || '#6366F1'}40`,
                }}
              >
                {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>

              {/* Completion toggle button */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute -bottom-2 -right-2 w-6 h-6 p-0 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStepCompletion(index);
                }}
              >
                {isCompleted ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Play className="h-3 w-3 text-gray-400" />
                )}
              </Button>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                  isCompleted ? 'text-green-700 line-through' : 
                  isActive ? 'text-gray-900' : 'text-gray-800'
                }`}>
                  {tech.name}
                </h3>
                {isActive && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium animate-pulse">
                    Current
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <span className={`flex items-center font-medium transition-colors duration-200 ${
                  isCompleted ? 'text-green-600' : 'text-blue-600'
                }`}>
                  <Clock className="h-4 w-4 mr-1" />
                  {tech.weeks} weeks
                </span>
                {tech.category && (
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                    style={{
                      backgroundColor: `${tech.color || '#6366F1'}10`,
                      color: tech.color || '#6366F1',
                      border: `1px solid ${tech.color || '#6366F1'}20`,
                    }}
                  >
                    {tech.category}
                  </span>
                )}
              </div>

              {/* Progress indicator */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-700 ease-out ${
                    isCompleted ? 'w-full' : isActive ? 'w-3/4' : 'w-0'
                  }`}
                  style={{
                    background: isCompleted 
                      ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                      : `linear-gradient(90deg, ${tech.color || '#6366F1'} 0%, ${tech.color || '#6366F1'}dd 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!code || technologies.length === 0) {
    return (
      <div className="mt-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5 rounded-3xl" />
        <Card className="relative border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl">
          <CardContent className="p-12 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" />
              <BookOpen className="relative h-24 w-24 mx-auto mb-6 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Ready to Start Your Journey?</h3>
            <p className="text-gray-500 text-lg">Generate a roadmap to see your personalized learning path with interactive steps</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionPercentage = (completedSteps.size / technologies.length) * 100;

  return (
    <div className="mt-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5 rounded-3xl animate-pulse" />
      
      <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          {/* Header with animated gradient */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                🚀 {title} Roadmap
              </h2>
              {roadmapStats && (
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">{roadmapStats.totalWeeks} weeks</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
                    <BookOpen className="h-5 w-5" />
                    <span className="font-semibold">{technologies.length} steps</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Target className="h-5 w-5" />
                    <span className="font-semibold">~{roadmapStats.estimatedMonths} months</span>
                  </div>
                </div>
              )}
              
              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200"
              >
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>

          {/* Learning Path */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 rounded-2xl" />
            
            <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Target className="h-4 w-4 text-white" />
                </div>
                Your Learning Path
              </h3>
              
              <div className="space-y-16">
                {technologies.map((tech, index) => (
                  <StepCard 
                    key={index} 
                    tech={tech} 
                    index={index}
                    isActive={index === currentStep}
                    isCompleted={completedSteps.has(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Success tip with animated background */}
          <div className="mt-10 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/10 to-red-400/10 animate-pulse" />
            <div className="relative bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💡</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Success Strategy</h4>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    Click on any step to focus on it, and use the completion buttons to track your progress. 
                    Each technology builds upon the previous ones, so follow the sequence for the best learning experience. 
                    Take time to build projects after each major milestone to solidify your knowledge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}