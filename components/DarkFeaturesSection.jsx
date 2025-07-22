"use client";

import React, { useState, useEffect } from "react";
import { 
  BrainCircuit,
  Briefcase,
  LineChart,
  ScrollText,
  FileSearch,
  FolderOpen,
  SearchCheck,
  Globe,
  Map,
  ArrowRight
} from "lucide-react";

const ModernDarkFeaturesSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Static star positions to prevent hydration mismatch - moved outside component
  const staticStars = [
    { left: "15%", top: "10%", delay: "0s" },
    { left: "85%", top: "20%", delay: "0.5s" },
    { left: "25%", top: "75%", delay: "1s" },
    { left: "70%", top: "85%", delay: "1.5s" },
    { left: "95%", top: "15%", delay: "2s" },
    { left: "5%", top: "60%", delay: "2.5s" },
    { left: "45%", top: "5%", delay: "3s" },
    { left: "60%", top: "90%", delay: "0.3s" },
    { left: "80%", top: "45%", delay: "0.8s" },
    { left: "30%", top: "30%", delay: "1.3s" },
    { left: "90%", top: "70%", delay: "1.8s" },
    { left: "10%", top: "40%", delay: "2.3s" },
    { left: "55%", top: "65%", delay: "2.8s" },
    { left: "75%", top: "25%", delay: "0.2s" },
    { left: "35%", top: "80%", delay: "0.7s" },
    { left: "65%", top: "15%", delay: "1.2s" },
    { left: "20%", top: "95%", delay: "1.7s" },
    { left: "85%", top: "55%", delay: "2.2s" },
    { left: "40%", top: "50%", delay: "2.7s" },
    { left: "12%", top: "25%", delay: "0.1s" }
  ];

  const features = [
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Multi-Portal Job Search",
      punchline: "Search Everywhere, Find Anywhere",
      description: "Search across multiple job portals like LinkedIn, Naukri, Indeed, and more in one unified platform.",
      link: "/job-search",
      color: "coral",
      borderColor: "border-red-500/30",
      bgGradient: "from-red-950/10 via-red-900/5 to-transparent",
      textColor: "text-red-400",
      buttonBg: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400",
      glowColor: "shadow-red-500/20"
    },
    {
      icon: <BrainCircuit className="w-12 h-12" />,
      title: "AI-Powered Career Guidance",
      punchline: "Your Personal Career Strategist",
      description: "Get personalized career advice and insights powered by advanced AI technology tailored to your goals.",
      link: "/ai-cover-letter",
      color: "azure",
      borderColor: "border-blue-500/30",
      bgGradient: "from-blue-950/10 via-blue-900/5 to-transparent",
      textColor: "text-blue-400",
      buttonBg: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400",
      glowColor: "shadow-blue-500/20"
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Interview Preparation",
      punchline: "Practice Perfect, Perform Better",
      description: "Practice with role-specific questions and get instant AI feedback to ace your next interview.",
      link: "/interview",
      color: "amethyst",
      borderColor: "border-purple-500/30",
      bgGradient: "from-purple-950/10 via-purple-900/5 to-transparent",
      textColor: "text-purple-400",
      buttonBg: "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400",
      glowColor: "shadow-purple-500/20"
    },
    {
      icon: <LineChart className="w-12 h-12" />,
      title: "Industry Insights",
      punchline: "Stay Ahead of the Curve",
      description: "Access real-time industry trends, salary data, and comprehensive market analysis to make informed decisions.",
      link: "/dashboard",
      color: "emerald",
      borderColor: "border-emerald-500/30",
      bgGradient: "from-emerald-950/10 via-emerald-900/5 to-transparent",
      textColor: "text-emerald-400",
      buttonBg: "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400",
      glowColor: "shadow-emerald-500/20"
    },
    {
      icon: <ScrollText className="w-12 h-12" />,
      title: "Smart Resume Creation",
      punchline: "Build Resumes That Get Noticed",
      description: "Generate ATS-optimized resumes with intelligent AI assistance and industry-specific templates.",
      link: "/resume",
      color: "amber",
      borderColor: "border-orange-500/30",
      bgGradient: "from-orange-950/10 via-orange-900/5 to-transparent",
      textColor: "text-orange-400",
      buttonBg: "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400",
      glowColor: "shadow-orange-500/20"
    },
    {
      icon: <FileSearch className="w-12 h-12" />,
      title: "Resume Analyzer",
      punchline: "Optimize for Maximum Impact",
      description: "Get detailed feedback on your resume with AI-driven analysis and actionable improvement suggestions.",
      link: "/resume-analyzer",
      color: "lavender",
      borderColor: "border-violet-500/30",
      bgGradient: "from-violet-950/10 via-violet-900/5 to-transparent",
      textColor: "text-violet-400",
      buttonBg: "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400",
      glowColor: "shadow-violet-500/20"
    },
    {
      icon: <Map className="w-12 h-12" />,
      title: "Smart Learning Roadmaps",
      punchline: "Your Path to Skill Mastery",
      description: "Generate personalized learning paths with interactive progress tracking and technology-specific recommendations.",
      link: "/roadmap",
      color: "cyan",
      borderColor: "border-cyan-500/30",
      bgGradient: "from-cyan-950/10 via-cyan-900/5 to-transparent",
      textColor: "text-cyan-400",
      buttonBg: "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400",
      glowColor: "shadow-cyan-500/20"
    },
    {
      icon: <SearchCheck className="w-12 h-12" />,
      title: "AI Job Searching",
      punchline: "Smart Search, Better Matches",
      description: "Discover the best job opportunities with AI-powered search algorithms and personalized recommendations.",
      link: "/job-search",
      color: "rose",
      borderColor: "border-pink-500/30",
      bgGradient: "from-pink-950/10 via-pink-900/5 to-transparent",
      textColor: "text-pink-400",
      buttonBg: "bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400",
      glowColor: "shadow-pink-500/20"
    }
  ];

  // Prevent any potential hydration mismatch by not rendering animations until client-side
  if (!isClient) {
    return (
      <section className="relative w-full py-24 bg-black overflow-hidden">
        {/* Static background for SSR */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-black"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Static Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-full border border-purple-500/30 mb-8">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-purple-300 text-sm font-medium tracking-widest uppercase">Features</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Simplify Every Step
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                of Your
              </span>
              <br />
              <span className="text-white font-light">
                Job Search with{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">
                  Futurebuild
                </span>
              </span>
            </h2>
            
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"></div>
            </div>
          </div>

          {/* Static Features Grid */}
          <div className="space-y-24">
            {features.map((feature, index) => (
              <div
                key={`feature-${index}`}
                className={`group flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-16 lg:gap-24`}
              >
                {/* Feature Content */}
                <div className="flex-1 space-y-8">
                  <div className={`inline-flex items-center gap-4 ${feature.textColor}`}>
                    <div className={`p-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border ${feature.borderColor}`}>
                      {feature.icon}
                    </div>
                    <h3 className={`text-3xl md:text-4xl font-bold tracking-tight ${feature.textColor}`}>
                      {feature.title}
                    </h3>
                  </div>
                  
                  <h4 className="text-2xl md:text-3xl font-light text-gray-200 leading-relaxed tracking-wide">
                    {feature.punchline}
                  </h4>
                  
                  <p className="text-gray-400 text-lg leading-relaxed max-w-2xl font-light tracking-wide">
                    {feature.description}
                  </p>
                  
                  <button className={`relative overflow-hidden flex items-center gap-4 px-8 py-4 ${feature.buttonBg} text-white rounded-xl font-medium transition-all duration-500 border border-white/10`}>
                    <span className="relative z-10">Experience the command line, unleashed.</span>
                    <ArrowRight className="w-5 h-5 relative z-10" />
                  </button>
                </div>

                {/* Static Feature Card */}
                <div className="flex-1 max-w-2xl">
                  <div className="relative">
                    <div className={`relative p-10 bg-gradient-to-br from-gray-900/40 via-gray-800/20 to-transparent backdrop-blur-xl rounded-3xl border ${feature.borderColor}`}>
                      
                      {/* Terminal-like header */}
                      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-700/50">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
                        </div>
                        <div className="ml-4 text-gray-500 text-sm font-mono">
                          ~/futurebuild/{feature.title.toLowerCase().replace(/\s+/g, '-')}
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="relative space-y-6">
                        <div className={`inline-flex items-center gap-3 ${feature.textColor} font-mono text-lg`}>
                          <span className="text-gray-500">$</span>
                          <span>{feature.title.toLowerCase().replace(/\s+/g, '_')}</span>
                          <div className="w-2 h-5 bg-current"></div>
                        </div>
                        
                        <div className="space-y-3 font-mono text-sm">
                          <div className="text-gray-400">
                            <span className="text-green-400">✓</span> Initializing {feature.title}...
                          </div>
                          <div className="text-gray-400">
                            <span className="text-blue-400">→</span> {feature.punchline}
                          </div>
                          <div className="text-gray-400">
                            <span className="text-purple-400">⚡</span> AI-Powered Technology
                          </div>
                          <div className="text-gray-400">
                            <span className="text-cyan-400">◆</span> Real-time Results
                          </div>
                          <div className="text-gray-400">
                            <span className="text-pink-400">★</span> Personalized Experience
                          </div>
                        </div>

                        {/* Static progress bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Loading features...</span>
                            <span>98%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1">
                            <div className={`h-1 rounded-full ${feature.textColor.replace('text-', 'bg-')} w-[98%]`}></div>
                          </div>
                        </div>
                      </div>

                      {/* Corner accents */}
                      <div className={`absolute top-4 right-4 w-16 h-16 border-t border-r ${feature.borderColor} opacity-30`}></div>
                      <div className={`absolute bottom-4 left-4 w-16 h-16 border-b border-l ${feature.borderColor} opacity-30`}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Static Bottom CTA */}
          <div className="text-center mt-32">
            <button className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl text-white font-semibold text-lg transition-all duration-500 border border-white/10">
              <span>Experience the future of job search</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Full animated version for client-side
  return (
    <section className="relative w-full py-24 bg-black overflow-hidden">
      {/* Animated Modern Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-black"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move"></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-cyan-600/10 rounded-full blur-2xl animate-float-fast"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-10 right-10 w-20 h-20 border border-purple-500/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 border border-blue-500/20 animate-pulse"></div>
        
        {/* Scanning lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scan-horizontal"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-scan-vertical"></div>
        </div>
        
        {/* Static particle effects */}
        <div className="absolute inset-0">
          {staticStars.map((star, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Animated Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-full border border-purple-500/30 mb-8">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-purple-300 text-sm font-medium tracking-widest uppercase">Features</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Simplify Every Step
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              of Your
            </span>
            <br />
            <span className="text-white font-light">
              Job Search with{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">
                Futurebuild
              </span>
            </span>
          </h2>
          
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Features Grid - Animated Version */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={`animated-feature-${index}`}
              className={`group flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-16 lg:gap-24`}
            >
              {/* Feature Content - Animated */}
              <div className="flex-1 space-y-8">
                <div className={`inline-flex items-center gap-4 ${feature.textColor}`}>
                  <div className={`p-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border ${feature.borderColor}`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-bold tracking-tight ${feature.textColor}`}>
                    {feature.title}
                  </h3>
                </div>
                
                <h4 className="text-2xl md:text-3xl font-light text-gray-200 leading-relaxed tracking-wide">
                  {feature.punchline}
                </h4>
                
                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl font-light tracking-wide">
                  {feature.description}
                </p>
                
                <a href={feature.link} className="inline-block group/btn">
                  <button className={`relative overflow-hidden flex items-center gap-4 px-8 py-4 ${feature.buttonBg} text-white rounded-xl font-medium transition-all duration-500 hover:scale-105 hover:${feature.glowColor} hover:shadow-2xl border border-white/10`}>
                    <span className="relative z-10">Experience the command line, unleashed.</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </a>
              </div>

              {/* Animated Feature Card */}
              <div className="flex-1 max-w-2xl">
                <div className="relative group/card">
                  <div className={`relative p-10 bg-gradient-to-br from-gray-900/40 via-gray-800/20 to-transparent backdrop-blur-xl rounded-3xl border ${feature.borderColor} hover:border-opacity-100 transition-all duration-700 hover:scale-105`}>
                    
                    {/* Animated glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-40 transition-opacity duration-700 -z-10`}></div>
                    
                    {/* Terminal-like header */}
                    <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-700/50">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
                      </div>
                      <div className="ml-4 text-gray-500 text-sm font-mono">
                        ~/futurebuild/{feature.title.toLowerCase().replace(/\s+/g, '-')}
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="relative space-y-6">
                      <div className={`inline-flex items-center gap-3 ${feature.textColor} font-mono text-lg`}>
                        <span className="text-gray-500">$</span>
                        <span>{feature.title.toLowerCase().replace(/\s+/g, '_')}</span>
                        <div className="w-2 h-5 bg-current animate-blink"></div>
                      </div>
                      
                      <div className="space-y-3 font-mono text-sm">
                        <div className="text-gray-400">
                          <span className="text-green-400">✓</span> Initializing {feature.title}...
                        </div>
                        <div className="text-gray-400">
                          <span className="text-blue-400">→</span> {feature.punchline}
                        </div>
                        <div className="text-gray-400">
                          <span className="text-purple-400">⚡</span> AI-Powered Technology
                        </div>
                        <div className="text-gray-400">
                          <span className="text-cyan-400">◆</span> Real-time Results
                        </div>
                        <div className="text-gray-400">
                          <span className="text-pink-400">★</span> Personalized Experience
                        </div>
                      </div>

                      {/* Progress bar animation */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Loading features...</span>
                          <span>98%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1">
                          <div className={`h-1 rounded-full ${feature.textColor.replace('text-', 'bg-')} animate-loading-bar`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Corner accents */}
                    <div className={`absolute top-4 right-4 w-16 h-16 border-t border-r ${feature.borderColor} opacity-30`}></div>
                    <div className={`absolute bottom-4 left-4 w-16 h-16 border-b border-l ${feature.borderColor} opacity-30`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Animated Bottom CTA */}
        <div className="text-center mt-32">
        <a href="/dashboard" className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl text-white font-semibold text-lg hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25 border border-white/10">
  <span>Experience the future of job search</span>
  <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-2xl"></div>
</a>
        </div>
        </div>
    </section>
  );
  
};

export default ModernDarkFeaturesSection;