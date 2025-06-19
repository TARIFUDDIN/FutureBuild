"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Github,
  ArrowRight,
  Heart,
  Shield,
  Clock,
  Users
} from 'lucide-react';

const ProfessionalFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style jsx>{`
        .footer-section {
          background: linear-gradient(135deg, #050510 0%, #0f0620 50%, #1a0d2e 100%);
          position: relative;
          overflow: hidden;
        }

        .footer-spotlight::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -30%;
          width: 160%;
          height: 200%;
          background: radial-gradient(
            ellipse at center,
            rgba(88, 28, 135, 0.08) 0%,
            rgba(124, 58, 237, 0.04) 40%,
            transparent 70%
          );
          z-index: 1;
          animation: footer-glow 15s ease-in-out infinite;
        }

        @keyframes footer-glow {
          0%, 100% {
            opacity: 0.6;
            transform: translate(0, 0) scale(1);
          }
          50% {
            opacity: 0.3;
            transform: translate(-5%, 5%) scale(1.1);
          }
        }

        .footer-link {
          color: #9ca3af;
          transition: all 0.3s ease;
          position: relative;
        }

        .footer-link:hover {
          color: #a855f7;
          transform: translateX(4px);
        }

        .footer-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #a855f7;
          transition: width 0.3s ease;
        }

        .footer-link:hover::before {
          width: 100%;
        }

        .social-icon {
          background: rgba(109, 40, 217, 0.1);
          border: 1px solid rgba(109, 40, 217, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .social-icon:hover {
          background: rgba(109, 40, 217, 0.2);
          border-color: rgba(109, 40, 217, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(88, 28, 135, 0.3);
        }

        .contact-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(109, 40, 217, 0.15);
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .contact-item:hover {
          background: rgba(88, 28, 135, 0.05);
          border-color: rgba(109, 40, 217, 0.3);
          transform: translateY(-1px);
        }

        .newsletter-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(109, 40, 217, 0.2);
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }

        .newsletter-input:focus {
          border-color: rgba(109, 40, 217, 0.5);
          box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.2);
          outline: none;
        }

        .newsletter-button {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          transition: all 0.3s ease;
        }

        .newsletter-button:hover {
          background: linear-gradient(135deg, #6d28d9, #7c3aed);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
        }

        .footer-divider {
          background: linear-gradient(90deg, transparent, rgba(109, 40, 217, 0.3), transparent);
        }

        .logo-glow:hover {
          filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.4));
        }
      `}</style>

      <footer className="footer-section footer-spotlight relative">
        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Company Info */}
              <div className="lg:col-span-1">
                <Link href="/" className="inline-block mb-6 logo-glow transition-all duration-300">
                  <Image
                    src="/logo2.png"
                    alt="FutureBuild Logo"
                    width={180}
                    height={50}
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  AI-powered career advancement platform helping professionals land their dream jobs 
                  with intelligent insights and personalized guidance.
                </p>
                
                {/* Social Media */}
                <div className="flex items-center gap-3">
                  <a 
                    href="https://instagram.com/futurebuild" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-icon w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    <Instagram className="w-4 h-4 text-purple-400" />
                  </a>
                  <a 
                    href="https://twitter.com/futurebuild" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-icon w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    <Twitter className="w-4 h-4 text-purple-400" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/futurebuild" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-icon w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    <Linkedin className="w-4 h-4 text-purple-400" />
                  </a>
                  <a 
                    href="https://github.com/futurebuild" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-icon w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    <Github className="w-4 h-4 text-purple-400" />
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Platform</h3>
                <ul className="space-y-3">
                  <li><Link href="/dashboard" className="footer-link">Dashboard</Link></li>
                  <li><Link href="/job-search" className="footer-link">Job Search</Link></li>
                  <li><Link href="/resume" className="footer-link">Resume Builder</Link></li>
                  <li><Link href="/interview" className="footer-link">Interview Prep</Link></li>
                  <li><Link href="/roadmap" className="footer-link">Career Roadmap</Link></li>
                  <li><Link href="/ai-cover-letter" className="footer-link">Cover Letters</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Resources</h3>
                <ul className="space-y-3">
                  <li><Link href="/features" className="footer-link">Features</Link></li>
                  <li><Link href="/how-it-works" className="footer-link">How It Works</Link></li>
                  <li><Link href="/faqs" className="footer-link">FAQs</Link></li>
                  <li><Link href="/blog" className="footer-link">Blog</Link></li>
                  <li><Link href="/pricing" className="footer-link">Pricing</Link></li>
                  <li><Link href="/support" className="footer-link">Support Center</Link></li>
                </ul>
              </div>

              {/* Contact & Newsletter */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Get in Touch</h3>
                
                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="contact-item rounded-lg p-3 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <a href="mailto:hello@futurebuild.ai" className="text-gray-300 text-sm">
                      rafiuddin.tarif@gmail.com
                    </a>
                  </div>
                  <div className="contact-item rounded-lg p-3 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <a href="tel:+1234567890" className="text-gray-300 text-sm">
                      +91 8293918318
                    </a>
                  </div>
                  <div className="contact-item rounded-lg p-3 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Kolkata,India
                    </span>
                  </div>
                </div>

                {/* Newsletter */}
                <div>
                  <h4 className="text-white font-medium mb-3">Stay Updated</h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="newsletter-input flex-1 px-3 py-2 rounded-lg text-white placeholder-gray-400 text-sm"
                    />
                    <button className="newsletter-button px-4 py-2 rounded-lg text-white">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Divider */}
          <div className="footer-divider h-px"></div>

          {/* Bottom Footer */}
          <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Copyright */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>© {currentYear} FutureBuild. Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>for career growth.</span>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>10k+ Users</span>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="footer-link text-sm">Privacy Policy</Link>
                <Link href="/terms" className="footer-link text-sm">Terms of Service</Link>
                <Link href="/cookies" className="footer-link text-sm">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ProfessionalFooter;