"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react';

const ModernCTASection = () => {
  return (
    <>
      <style jsx>{`
        .cta-section {
          background: linear-gradient(135deg, #0a0a1a 0%, #1a0d2e 50%, #2d1b3d 100%);
          position: relative;
          overflow: hidden;
        }

        .cta-spotlight::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 140%;
          height: 160%;
          background: radial-gradient(
            ellipse at center,
            rgba(88, 28, 135, 0.15) 0%,
            rgba(124, 58, 237, 0.08) 40%,
            transparent 70%
          );
          z-index: 1;
          animation: cta-spotlight-pulse 8s ease-in-out infinite;
        }

        .cta-spotlight::after {
          content: '';
          position: absolute;
          bottom: -40%;
          right: -25%;
          width: 120%;
          height: 140%;
          background: radial-gradient(
            ellipse at center,
            rgba(109, 40, 217, 0.12) 0%,
            rgba(147, 51, 234, 0.06) 50%,
            transparent 70%
          );
          z-index: 1;
          animation: cta-spotlight-pulse 10s ease-in-out infinite reverse;
        }

        @keyframes cta-spotlight-pulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }

        .cta-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(109, 40, 217, 0.3);
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(109, 40, 217, 0.1),
            transparent
          );
          transition: left 0.8s ease;
        }

        .cta-card:hover::before {
          left: 100%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffff, #e5e7eb, #d1d5db);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cta-button {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6, #a855f7);
          border: 1px solid rgba(124, 58, 237, 0.5);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 20px 40px rgba(124, 58, 237, 0.4);
          border-color: rgba(124, 58, 237, 0.8);
        }

        .feature-icon {
          background: linear-gradient(135deg, rgba(88, 28, 135, 0.2), rgba(109, 40, 217, 0.1));
          border: 1px solid rgba(109, 40, 217, 0.3);
          transition: all 0.3s ease;
        }

        .feature-icon:hover {
          background: linear-gradient(135deg, rgba(88, 28, 135, 0.3), rgba(109, 40, 217, 0.2));
          border-color: rgba(109, 40, 217, 0.5);
          box-shadow: 0 0 20px rgba(88, 28, 135, 0.4);
        }

        .floating-orbs {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(109, 40, 217, 0.2), transparent);
          animation: float-orb 6s ease-in-out infinite;
        }

        .orb:nth-child(1) {
          width: 60px;
          height: 60px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb:nth-child(2) {
          width: 40px;
          height: 40px;
          top: 70%;
          right: 15%;
          animation-delay: -2s;
        }

        .orb:nth-child(3) {
          width: 80px;
          height: 80px;
          top: 40%;
          right: 70%;
          animation-delay: -4s;
        }

        @keyframes float-orb {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-15px) translateX(10px);
            opacity: 0.6;
          }
          66% {
            transform: translateY(10px) translateX(-15px);
            opacity: 0.2;
          }
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border: 2px solid rgba(109, 40, 217, 0.3);
          border-radius: 50%;
          animation: pulse-ring 3s infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>

      <section className="cta-section cta-spotlight w-full py-20 md:py-28 relative">
        {/* Floating Orbs */}
        <div className="floating-orbs">
          <div className="orb"></div>
          <div className="orb"></div>
          <div className="orb"></div>
        </div>

        {/* Pulse Ring */}
        <div className="pulse-ring"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="cta-card rounded-3xl p-8 md:p-12 text-center">
              {/* Features Icons */}
              <div className="flex justify-center items-center gap-6 mb-8">
                <div className="feature-icon w-12 h-12 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div className="feature-icon w-12 h-12 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div className="feature-icon w-12 h-12 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <h2 className="gradient-text text-4xl md:text-6xl font-bold leading-tight">
                  Ready to Accelerate Your Career?
                </h2>
                
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Join thousands of professionals who are advancing their careers with AI-powered guidance. 
                  Start your journey to success today.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center items-center gap-8 py-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">10,000+</div>
                    <div className="text-sm text-purple-400">Success Stories</div>
                  </div>
                  <div className="w-px h-8 bg-purple-500/30 hidden sm:block"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">95%</div>
                    <div className="text-sm text-purple-400">Success Rate</div>
                  </div>
                  <div className="w-px h-8 bg-purple-500/30 hidden sm:block"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-purple-400">AI Support</div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link href="/dashboard" passHref>
                    <button className="cta-button inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg">
                      Start Your Journey Today
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>

                {/* Bottom Note */}
                <p className="text-gray-500 text-sm mt-6">
                  No credit card required • Get started in under 2 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModernCTASection;