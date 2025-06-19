"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Target, Clock } from 'lucide-react';

const AnimatedStatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    industries: 0,
    questions: 0,
    success: 0,
    support: 0
  });
  
  const sectionRef = useRef(null);

  // Target values for the counters
  const targets = {
    industries: 50,
    questions: 1000,
    success: 95,
    support: 24
  };

  // Intersection Observer to trigger animation when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          startCountAnimation();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Counter animation function
  const startCountAnimation = () => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    Object.keys(targets).forEach((key) => {
      let currentCount = 0;
      const increment = targets[key] / steps;
      
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targets[key]) {
          currentCount = targets[key];
          clearInterval(timer);
        }
        
        setCounts(prev => ({
          ...prev,
          [key]: Math.floor(currentCount)
        }));
      }, stepDuration);
    });
  };

  const stats = [
    {
      id: 'industries',
      value: counts.industries,
      suffix: '+',
      label: 'Industries Covered',
      icon: <TrendingUp className="h-8 w-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      spotlightColor: 'rgba(59, 130, 246, 0.3)'
    },
    {
      id: 'questions',
      value: counts.questions,
      suffix: '+',
      label: 'Interview Questions',
      icon: <Target className="h-8 w-8" />,
      gradient: 'from-purple-500 to-pink-500',
      spotlightColor: 'rgba(168, 85, 247, 0.3)'
    },
    {
      id: 'success',
      value: counts.success,
      suffix: '%',
      label: 'Success Rate',
      icon: <Users className="h-8 w-8" />,
      gradient: 'from-emerald-500 to-teal-500',
      spotlightColor: 'rgba(16, 185, 129, 0.3)'
    },
    {
      id: 'support',
      value: counts.support,
      suffix: '/7',
      label: 'AI Support',
      icon: <Clock className="h-8 w-8" />,
      gradient: 'from-orange-500 to-red-500',
      spotlightColor: 'rgba(249, 115, 22, 0.3)'
    }
  ];

  return (
    <>
      <style jsx>{`
        .stat-card {
          position: relative;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.8s ease;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .icon-glow {
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 10px currentColor);
        }

        .stat-card:hover .icon-glow {
          filter: drop-shadow(0 0 20px currentColor);
          transform: scale(1.1);
        }

        .number-display {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .stat-card:hover .number-display {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
          border-color: rgba(255, 255, 255, 0.2);
        }



        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border: 2px solid currentColor;
          border-radius: 50%;
          opacity: 0;
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        .section-glow {
          position: relative;
          overflow: hidden;
        }

        .section-glow::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -25%;
          width: 150%;
          height: 200%;
          background: radial-gradient(
            ellipse at center,
            rgba(147, 51, 234, 0.15) 0%,
            rgba(139, 92, 246, 0.08) 30%,
            transparent 70%
          );
          opacity: 0.8;
          z-index: -1;
          animation: spotlight-move 8s ease-in-out infinite;
        }

        .section-glow::after {
          content: '';
          position: absolute;
          top: 20%;
          right: -20%;
          width: 80%;
          height: 120%;
          background: radial-gradient(
            ellipse at center,
            rgba(168, 85, 247, 0.12) 0%,
            rgba(196, 181, 253, 0.06) 40%,
            transparent 70%
          );
          opacity: 0.6;
          z-index: -1;
          animation: spotlight-move-alt 10s ease-in-out infinite reverse;
        }

        @keyframes spotlight-move {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          33% {
            transform: translate(-10%, -5%) scale(1.1);
            opacity: 0.6;
          }
          66% {
            transform: translate(15%, 10%) scale(0.9);
            opacity: 0.9;
          }
        }

        @keyframes spotlight-move-alt {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-20%, -10%) scale(1.2);
            opacity: 0.4;
          }
        }

        .floating-orbs {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.1), transparent);
          animation: float-orb 6s ease-in-out infinite;
        }

        .orb:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb:nth-child(2) {
          width: 80px;
          height: 80px;
          top: 60%;
          right: 15%;
          animation-delay: -2s;
        }

        .orb:nth-child(3) {
          width: 120px;
          height: 120px;
          top: 40%;
          left: 70%;
          animation-delay: -4s;
        }

        @keyframes float-orb {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.1;
          }
          66% {
            transform: translateY(10px) translateX(-15px);
            opacity: 0.4;
          }
        }
      `}</style>

      <section 
        ref={sectionRef}
        className="w-full py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 section-glow"
      >
        {/* Floating Orbs Background */}
        <div className="floating-orbs">
          <div className="orb"></div>
          <div className="orb"></div>
          <div className="orb"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block">
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-4">
                Platform Statistics
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands who are accelerating their careers with our AI-powered platform
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={`stat-card rounded-2xl p-6 md:p-8 text-center group cursor-pointer`}
              >
                {/* Pulse Ring Effect */}
                <div className={`pulse-ring text-${stat.gradient.split('-')[1]}-400`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.gradient} p-3 mb-4 icon-glow text-white relative z-10`}>
                  {stat.icon}
                </div>

                {/* Number Display */}
                <div className="number-display rounded-xl p-4 mb-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <span className="font-mono">
                      {stat.value}
                    </span>
                    <span className={`text-2xl md:text-3xl bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.suffix}
                    </span>
                  </h3>
                </div>

                {/* Label */}
                <p className="text-gray-300 font-medium text-sm md:text-base">
                  {stat.label}
                </p>

                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.spotlightColor} 0%, transparent 70%)`,
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Bottom Accent */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${stats[i].gradient} opacity-60`}
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animation: 'pulse 2s infinite'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AnimatedStatsSection;