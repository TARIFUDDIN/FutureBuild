"use client";

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

const MovingTestimonialsSection = ({ testimonials }) => {
  // Split testimonials into two rows for different scroll directions
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

  const TestimonialCard = ({ testimonial }) => (
    <div className="testimonial-card flex-shrink-0 w-80 md:w-96 mx-4">
      <div className="bg-gray-900/50 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 h-full">
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-gray-300 mb-6 leading-relaxed">
          <span className="text-2xl text-purple-400 font-serif">"</span>
          {testimonial.quote}
          <span className="text-2xl text-purple-400 font-serif">"</span>
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
            <Image
              src={testimonial.image}
              alt={testimonial.author}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-white">{testimonial.author}</p>
            <p className="text-sm text-gray-400">{testimonial.role}</p>
            <p className="text-sm text-purple-400 font-medium">{testimonial.company}</p>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600 rounded-b-2xl"></div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        .moving-testimonials-section {
          background: linear-gradient(135deg, #0a0a1a 0%, #1a0d2e 50%, #2d1b3d 100%);
          position: relative;
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
            rgba(88, 28, 135, 0.08) 0%,
            rgba(124, 58, 237, 0.04) 40%,
            transparent 70%
          );
          z-index: 1;
          animation: spotlight-drift 12s ease-in-out infinite;
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
            rgba(109, 40, 217, 0.06) 0%,
            rgba(147, 51, 234, 0.03) 50%,
            transparent 70%
          );
          z-index: 1;
          animation: spotlight-drift 15s ease-in-out infinite reverse;
        }

        @keyframes spotlight-drift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          33% {
            transform: translate(-10%, -5%) scale(1.1);
            opacity: 0.4;
          }
          66% {
            transform: translate(15%, 10%) scale(0.9);
            opacity: 0.8;
          }
        }

        .scroll-container {
          display: flex;
          animation: scroll-left 40s linear infinite;
          width: fit-content;
        }

        .scroll-container-reverse {
          display: flex;
          animation: scroll-right 35s linear infinite;
          width: fit-content;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .testimonial-card {
          position: relative;
          transition: transform 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          z-index: 10;
        }

        .testimonial-card:hover .bg-gray-900\\/50 {
          background: rgba(17, 24, 39, 0.7);
          border-color: rgba(147, 51, 234, 0.4);
        }

        .scroll-row {
          display: flex;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent,
            white 10%,
            white 90%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            white 10%,
            white 90%,
            transparent
          );
        }

        .title-glow {
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
          animation: badge-glow 3s ease-in-out infinite;
        }

        @keyframes badge-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(88, 28, 135, 0.4);
          }
          50% {
            box-shadow: 0 0 20px rgba(88, 28, 135, 0.6);
          }
        }

        .pause-on-hover .scroll-container:hover,
        .pause-on-hover .scroll-container-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="moving-testimonials-section section-spotlight w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-6">
              <span className="subtitle-badge inline-block px-4 py-2 rounded-full text-sm font-medium">
                Success Stories
              </span>
            </div>
            <h2 className="title-glow text-4xl md:text-5xl font-bold mb-6">
              What Our Users Say
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Trusted by job seekers who've landed at top companies
            </p>
          </div>

          {/* Moving Testimonials */}
          <div className="space-y-8">
            {/* First Row - Left to Right */}
            <div className="scroll-row pause-on-hover">
              <div className="scroll-container">
                {/* First set */}
                {firstRow.map((testimonial, index) => (
                  <TestimonialCard key={`first-${index}`} testimonial={testimonial} />
                ))}
                {/* Duplicate for seamless loop */}
                {firstRow.map((testimonial, index) => (
                  <TestimonialCard key={`first-dup-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Second Row - Right to Left */}
            <div className="scroll-row pause-on-hover">
              <div className="scroll-container-reverse">
                {/* First set */}
                {secondRow.map((testimonial, index) => (
                  <TestimonialCard key={`second-${index}`} testimonial={testimonial} />
                ))}
                {/* Duplicate for seamless loop */}
                {secondRow.map((testimonial, index) => (
                  <TestimonialCard key={`second-dup-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex justify-center items-center mt-16 space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10k+</div>
              <div className="text-gray-400 text-sm">Happy Users</div>
            </div>
            <div className="w-px h-12 bg-purple-500/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-purple-500/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400 text-sm">Companies</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MovingTestimonialsSection;