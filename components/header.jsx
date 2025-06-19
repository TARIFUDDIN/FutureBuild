"use client";

import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  FileSearch,
  Search,
  Map,
  BrainCircuit,
  FolderOpen,
  Layers,
  Cog,
  HelpCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Header() {
  return (
    <>
      {/* Inline styles to avoid Tailwind conflicts */}
      <style jsx>{`
        .navbar-item {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar-item::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }

        .navbar-item:hover::before {
          width: 100%;
        }

        .navbar-item:hover {
          transform: translateY(-1px);
        }

        .spotlight-effect {
          position: relative;
          overflow: hidden;
        }

        .spotlight-effect::before {
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
          transition: left 0.6s ease;
        }

        .spotlight-effect:hover::before {
          left: 100%;
        }

        .nav-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-button:hover::before {
          left: 100%;
        }

        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .logo-pulse:hover {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6));
          }
        }

        .dropdown-item {
          transition: all 0.2s ease;
          border-radius: 6px;
          margin: 2px 0;
        }

        .dropdown-item:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          transform: translateX(4px);
        }
      `}</style>

      <header className="fixed top-0 w-full border-b bg-black/80 backdrop-blur-md z-50 border-white/10">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="logo-pulse">
            <Image
              src={"/logo2.png"}
              alt="FutureBuild Logo"
              width={200}
              height={60}
              className="h-12 py-1 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-8">
            <SignedIn>
              {/* Features */}
              <div className="navbar-item">
                <Link 
                  href="/features" 
                  className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <Layers className="h-4 w-4" />
                  Features
                </Link>
              </div>

              {/* How It Works */}
              <div className="navbar-item">
                <Link 
                  href="/how-it-works" 
                  className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <Cog className="h-4 w-4" />
                  How It Works
                </Link>
              </div>

              {/* FAQs */}
              <div className="navbar-item">
                <Link 
                  href="/faqs" 
                  className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  FAQs
                </Link>
              </div>
            </SignedIn>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <SignedIn>
              {/* Industry Insights */}
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 nav-button spotlight-effect border-white/20 text-white hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Industry Insights
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 nav-button text-white hover:bg-white/10">
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </Link>
             
              {/* FutureBuild Plus */}
              <a 
                href="https://futureprep.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 nav-button spotlight-effect" 
                  variant="outline"
                >
                  <BrainCircuit className="h-4 w-4" />
                  <span className="hidden md:block">FutureBuild Plus</span>
                  <span className="md:hidden">Plus</span>
                </Button>
              </a>

              {/* Growth Tools Dropdown with Hover */}
              <GrowthToolsDropdown />
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="nav-button spotlight-effect border-white/20 text-white hover:bg-white/10">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 transition-transform duration-300 hover:scale-110",
                    userButtonPopoverCard: "shadow-xl bg-black/90 backdrop-blur-md border border-white/10",
                    userPreviewMainIdentifier: "font-semibold",
                  },
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>
        </nav>
      </header>
    </>
  );
}

// Separate component for Growth Tools Dropdown with hover functionality
function GrowthToolsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  let timeoutId;

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button className="flex items-center gap-2 nav-button spotlight-effect bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0">
        <StarsIcon className="h-4 w-4" />
        <span className="hidden md:block">Growth Tools</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 py-2 z-50 opacity-100 transform translate-y-0 scale-100 transition-all duration-200">
          <div className="dropdown-item">
            <Link href="/job-search" className="flex items-center gap-3 px-4 py-3 text-sm text-white">
              <div className="p-1 rounded bg-blue-500/20">
                <Search className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="font-medium">Search Jobs</div>
                <div className="text-xs text-gray-400">Find your dream job</div>
              </div>
            </Link>
          </div>

  
          <div className="dropdown-item">
  <Link href="/job-automation" className="flex items-center gap-3 px-4 py-3 text-sm text-white">
    <div className="p-1 rounded bg-pink-500/20">
      <Zap className="h-4 w-4 text-pink-400" />
    </div>
    <div>
      <div className="font-medium">Job Automation</div>
      <div className="text-xs text-gray-400">Find your dream job</div>
    </div>
  </Link>
</div>

          <div className="dropdown-item">
            <Link href="/resume" className="flex items-center gap-3 px-4 py-3 text-sm text-white">
              <div className="p-1 rounded bg-green-500/20">
                <FileText className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <div className="font-medium">Build Resume</div>
                <div className="text-xs text-gray-400">Create professional resumes</div>
              </div>
            </Link>
          </div>

          <div className="dropdown-item">
            <Link href="/resume-analyzer" className="flex items-center gap-3 px-4 py-3 text-sm text-white">
              <div className="p-1 rounded bg-purple-500/20">
                <FileSearch className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div className="font-medium">Analyze Resume</div>
                <div className="text-xs text-gray-400">Get AI-powered insights</div>
              </div>
            </Link>
          </div>

          <div className="dropdown-item">
            <Link href="/ai-cover-letter" className="flex items-center gap-3 px-4 py-3 text-sm text-white">
              <div className="p-1 rounded bg-orange-500/20">
                <PenBox className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <div className="font-medium">Cover Letter</div>
                <div className="text-xs text-gray-400">AI-generated letters</div>
              </div>
            </Link>
          </div>

          <div className="dropdown-item">
            <Link href="/roadmap" className="flex items-center gap-3 px-4 py-3 text-sm text-white">
              <div className="p-1 rounded bg-cyan-500/20">
                <Map className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <div className="font-medium">Roadmap Generator</div>
                <div className="text-xs text-gray-400">Plan your career path</div>
              </div>
            </Link>
          </div>

          <div className="dropdown-item">
            <Link href="/interview" className="flex items-center gap-3 px-4 py-3 text-sm text-white">
              <div className="p-1 rounded bg-red-500/20">
                <GraduationCap className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <div className="font-medium">Interview Prep</div>
                <div className="text-xs text-gray-400">Practice with AI</div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}