"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const AnimatedDarkFAQSection = ({ faqs }) => {
  const [openItems, setOpenItems] = useState(new Set());
  const [visibleItems, setVisibleItems] = useState(new Set());
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const faqItems = sectionRef.current?.querySelectorAll('.faq-item');
    faqItems?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <>
      <style jsx>{`
        .faq-section {
          background: linear-gradient(135deg, #0a0a1a 0%, #1a0d2e 50%, #2d1b3d 100%);
          position: relative;
          overflow: hidden;
        }

        .section-spotlight::before {
          content: '';
          position: absolute;
          top: -40%;
          left: -30%;
          width: 160%;
          height: 180%;
          background: radial-gradient(
            ellipse at center,
            rgba(88, 28, 135, 0.1) 0%,
            rgba(124, 58, 237, 0.05) 40%,
            transparent 70%
          );
          z-index: 1;
          animation: spotlight-float 10s ease-in-out infinite;
        }

        .section-spotlight::after {
          content: '';
          position: absolute;
          bottom: -50%;
          right: -40%;
          width: 140%;
          height: 160%;
          background: radial-gradient(
            ellipse at center,
            rgba(109, 40, 217, 0.08) 0%,
            rgba(147, 51, 234, 0.04) 50%,
            transparent 70%
          );
          z-index: 1;
          animation: spotlight-float 12s ease-in-out infinite reverse;
        }

        @keyframes spotlight-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: translate(-5%, -3%) scale(1.05);
            opacity: 0.5;
          }
          50% {
            transform: translate(8%, 5%) scale(0.95);
            opacity: 0.9;
          }
          75% {
            transform: translate(-3%, 8%) scale(1.1);
            opacity: 0.6;
          }
        }

        .faq-item {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-item.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(109, 40, 217, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .faq-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(109, 40, 217, 0.08),
            transparent
          );
          transition: left 0.6s ease;
        }

        .faq-card:hover::before {
          left: 100%;
        }

        .faq-card:hover {
          border-color: rgba(109, 40, 217, 0.4);
          box-shadow: 0 10px 30px rgba(88, 28, 135, 0.2);
          transform: translateY(-2px);
        }

        .faq-card.open {
          border-color: rgba(109, 40, 217, 0.5);
          background: rgba(88, 28, 135, 0.05);
          box-shadow: 0 15px 35px rgba(88, 28, 135, 0.25);
        }

        .faq-question {
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .faq-question:hover {
          color: #a855f7;
        }

        .chevron-icon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #a855f7;
        }

        .chevron-icon.open {
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }

        .faq-answer.open {
          max-height: 200px;
          opacity: 1;
          padding-top: 1rem;
        }

        .question-number {
          background: linear-gradient(135deg, #581c87, #6d28d9);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          flex-shrink: 0;
          border: 2px solid rgba(88, 28, 135, 0.3);
          box-shadow: 0 0 15px rgba(88, 28, 135, 0.4);
        }

        .title-glow {
          background: linear-gradient(135deg, #ffffff, #e5e7eb, #d1d5db);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle-badge {
          background: linear-gradient(135deg, rgba(88, 28, 135, 0.25), rgba(109, 40, 217, 0.15));
          border: 1px solid rgba(109, 40, 217, 0.4);
          color: #a855f7;
          animation: badge-pulse 3s ease-in-out infinite;
        }

        @keyframes badge-pulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(88, 28, 135, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 20px rgba(88, 28, 135, 0.6);
            transform: scale(1.02);
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
          background: rgba(109, 40, 217, 0.3);
          border-radius: 50%;
          animation: float-particle 8s ease-in-out infinite;
        }

        .particle:nth-child(1) {
          width: 6px;
          height: 6px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .particle:nth-child(2) {
          width: 4px;
          height: 4px;
          top: 70%;
          right: 15%;
          animation-delay: -2s;
        }

        .particle:nth-child(3) {
          width: 8px;
          height: 8px;
          top: 40%;
          left: 70%;
          animation-delay: -4s;
        }

        .particle:nth-child(4) {
          width: 5px;
          height: 5px;
          top: 80%;
          left: 30%;
          animation-delay: -6s;
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          33% {
            transform: translateY(-15px) translateX(8px);
            opacity: 0.8;
          }
          66% {
            transform: translateY(8px) translateX(-12px);
            opacity: 0.2;
          }
        }

        .search-highlight {
          background: linear-gradient(90deg, transparent, rgba(109, 40, 217, 0.1), transparent);
          animation: search-glow 2s ease-in-out infinite;
        }

        @keyframes search-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <section 
        ref={sectionRef}
        className="faq-section section-spotlight w-full py-16 md:py-24 relative"
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
              <span className="subtitle-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
                <HelpCircle className="w-4 h-4" />
                Got Questions?
              </span>
            </div>
            <h2 className="title-glow text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Find answers to common questions about our AI-powered career platform
            </p>
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                data-index={index}
                className={`faq-item ${visibleItems.has(index) ? 'visible' : ''}`}
                style={{
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <div className={`faq-card ${openItems.has(index) ? 'open' : ''} rounded-2xl p-6 border`}>
                  {/* Question */}
                  <div 
                    className="faq-question flex items-center justify-between gap-4"
                    onClick={() => toggleItem(index)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="question-number">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-white text-left">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown 
                      className={`chevron-icon ${openItems.has(index) ? 'open' : ''} w-5 h-5 flex-shrink-0`}
                    />
                  </div>

                  {/* Answer */}
                  <div className={`faq-answer ${openItems.has(index) ? 'open' : ''}`}>
                    <div className="ml-10 pr-9">
                      <div className="h-px bg-gradient-to-r from-purple-600/50 via-violet-500/50 to-transparent mb-4"></div>
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">
                Still have questions? 
                <span className="text-purple-400 font-medium ml-1">Contact our support team</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AnimatedDarkFAQSection;