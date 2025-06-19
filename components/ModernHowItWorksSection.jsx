"use client";

import React, { useState, useEffect, useRef } from 'react';

const ModernHowItWorksSection = ({ howItWorks }) => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.dataset.index);
            setVisibleCards(prev => [...new Set([...prev, cardIndex])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll('.step-card');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx>{`
        .how-it-works-section {
          position: relative;
          background: linear-gradient(135deg, #0a0a1a 0%, #1a0d2e 50%, #2d1b3d 100%);
          overflow: hidden;
        }

        .section-spotlight::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 140%;
          height: 160%;
          background: radial-gradient(
            ellipse at center,
            rgba(88, 28, 135, 0.12) 0%,
            rgba(124, 58, 237, 0.06) 40%,
            transparent 70%
          );
          z-index: 1;
          animation: spotlight-pulse 8s ease-in-out infinite;
        }

        .section-spotlight::after {
          content: '';
          position: absolute;
          bottom: -40%;
          right: -25%;
          width: 120%;
          height: 140%;
          background: radial-gradient(
            ellipse at center,
            rgba(109, 40, 217, 0.08) 0%,
            rgba(147, 51, 234, 0.04) 50%,
            transparent 70%
          );
          z-index: 1;
          animation: spotlight-pulse 10s ease-in-out infinite reverse;
        }

        @keyframes spotlight-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        .step-card {
          position: relative;
          background: rgba(88, 28, 135, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(109, 40, 217, 0.25);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(50px);
          opacity: 0;
          overflow: hidden;
        }

        .step-card.visible {
          transform: translateY(0);
          opacity: 1;
        }

        .step-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(109, 40, 217, 0.15),
            transparent
          );
          transition: left 0.8s ease;
        }

        .step-card:hover::before {
          left: 100%;
        }

        .step-card:hover {
          transform: translateY(-8px);
          border-color: rgba(109, 40, 217, 0.5);
          box-shadow: 0 20px 40px rgba(88, 28, 135, 0.3);
          background: rgba(88, 28, 135, 0.08);
        }

        .step-number {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #581c87, #6d28d9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          color: white;
          border: 2px solid rgba(88, 28, 135, 0.4);
          box-shadow: 0 0 20px rgba(88, 28, 135, 0.4);
        }

        .icon-container {
          position: relative;
          background: linear-gradient(135deg, rgba(88, 28, 135, 0.25), rgba(109, 40, 217, 0.15));
          border: 1px solid rgba(109, 40, 217, 0.4);
          transition: all 0.3s ease;
        }

        .step-card:hover .icon-container {
          background: linear-gradient(135deg, rgba(88, 28, 135, 0.35), rgba(109, 40, 217, 0.25));
          border-color: rgba(109, 40, 217, 0.6);
          box-shadow: 0 0 30px rgba(88, 28, 135, 0.5);
        }

        .connecting-line {
          position: absolute;
          top: 50%;
          right: -50px;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, rgba(109, 40, 217, 0.4), transparent);
          z-index: 2;
        }

        .connecting-line::before {
          content: '';
          position: absolute;
          top: -3px;
          right: 0;
          width: 8px;
          height: 8px;
          background: rgba(109, 40, 217, 0.7);
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .section-title {
          background: linear-gradient(135deg, #ffffff, #e5e7eb, #d1d5db);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
        }

        .subtitle-badge {
          background: linear-gradient(135deg, rgba(88, 28, 135, 0.25), rgba(109, 40, 217, 0.15));
          border: 1px solid rgba(109, 40, 217, 0.4);
          color: #a855f7;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(88, 28, 135, 0.4);
          }
          50% {
            box-shadow: 0 0 20px rgba(88, 28, 135, 0.6);
          }
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(109, 40, 217, 0.5);
          border-radius: 50%;
          animation: float-particle 8s linear infinite;
        }

        .particle:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
        }

        .particle:nth-child(2) {
          left: 30%;
          animation-delay: -2s;
        }

        .particle:nth-child(3) {
          left: 60%;
          animation-delay: -4s;
        }

        .particle:nth-child(4) {
          left: 80%;
          animation-delay: -6s;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .connecting-line {
            display: none;
          }
          
          .step-card {
            margin-bottom: 20px;
          }
        }
      `}</style>

      <section 
        ref={sectionRef}
        className="how-it-works-section section-spotlight w-full py-16 md:py-24 relative"
      >
        {/* Floating Particles */}
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-6">
              <span className="subtitle-badge inline-block px-4 py-2 rounded-full text-sm font-medium">
                Simple Process
              </span>
            </div>
            <h2 className="section-title text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Four simple steps to accelerate your career growth with our AI-powered platform
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                data-index={index}
                className={`step-card ${visibleCards.includes(index) ? 'visible' : ''} rounded-2xl p-8 text-center relative`}
                style={{
                  transitionDelay: `${index * 0.2}s`
                }}
              >
                {/* Step Number */}
                <div className="step-number">
                  {index + 1}
                </div>

                {/* Connecting Line (hidden on mobile) */}
                {index < howItWorks.length - 1 && (
                  <div className="connecting-line hidden lg:block"></div>
                )}

                {/* Icon Container */}
                <div className="icon-container w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-300">
                  {React.cloneElement(item.icon, { 
                    className: "h-10 w-10",
                    color: "currentColor"
                  })}
                </div>

                {/* Content */}
                <h3 className="font-bold text-xl text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-800 to-violet-700 rounded-t-full"></div>
              </div>
            ))}
          </div>

          {/* Bottom Decorative Element */}
          <div className="flex justify-center mt-16">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-700 rounded-full animate-pulse"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-700 to-transparent"></div>
              <div className="w-3 h-3 bg-violet-700 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-violet-700 to-transparent"></div>
              <div className="w-2 h-2 bg-purple-700 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModernHowItWorksSection;