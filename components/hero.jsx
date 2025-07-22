"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "../components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const imageElement = imageRef.current;
    setIsVisible(true);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative w-full pt-36 md:pt-48 pb-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse-slow"></div>

      {/* Parallax Background Grid */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="grid-background-enhanced"></div>
      </div>

      <div className="relative z-10 space-y-8 text-center px-4">
        <div className={`space-y-8 mx-auto transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 rounded-full backdrop-blur-sm animate-fade-in-up">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ✨ AI-Powered Career Advancement
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl xl:text-8xl leading-tight">
            <span className="block animate-slide-up">
              <span className="gradient-title-enhanced animate-gradient-x">
                Transform Your Career
              </span>
            </span>
            <span className="block mt-2 animate-slide-up-delayed">
              <span className="gradient-title-secondary animate-gradient-x-delayed">
                with AI Intelligence
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in-up-delayed">
            Unlock your professional potential with personalized AI coaching, 
            advanced interview preparation, and intelligent career insights 
            tailored for your success.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in-up-delayed-2">
            {["Resume Optimization", "Interview Prep", "Career Insights", "Skill Assessment"].map((feature, index) => (
              <span 
                key={feature}
                className="inline-flex items-center px-3 py-1 text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full text-gray-700 dark:text-gray-300 animate-bounce-subtle"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
            >
              <span className="flex items-center gap-2">
                Start Your Journey
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </Link>
        
        </div>

        {/* Enhanced Hero Image */}
        <div className={`hero-image-wrapper-enhanced mt-12 md:mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div 
            ref={imageRef} 
            className="hero-image-enhanced relative"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            }}
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-2xl animate-pulse-glow"></div>
            
            {/* Main Image Container */}
            <div className="relative bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-2 shadow-2xl">
              <Image
                src="/banner3.png"
                width={580}
                height={360}
                alt="AI Career Coach Dashboard Preview"
                className="rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 w-full h-auto max-w-xl mx-auto"
                priority
              />
              
              {/* Overlay Elements */}
              <div className="absolute top-4 left-4 bg-green-500 w-3 h-3 rounded-full animate-ping"></div>
              <div className="absolute top-4 left-10 bg-blue-500 w-2 h-2 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-bounce-subtle">
                AI Active
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -top-8 -left-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-4 py-2 shadow-lg animate-float-card">
              <div className="text-sm font-semibold text-blue-600">98% Success Rate</div>
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-4 py-2 shadow-lg animate-float-card-delayed">
              <div className="text-sm font-semibold text-purple-600">10k+ Careers Boosted</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;