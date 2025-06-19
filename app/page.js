"use client"
import React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import HeroSection from "../components/hero";
import SleekMovingCompaniesSection from "../components/MovingCompaniesSection "; // Import your new component
import ModernDarkFeaturesSection from "../components/DarkFeaturesSection"; // Import the new dark features section
import AnimatedStatsSection from "../components/AnimatedStatsSection"; // Import the new animated stats section
import ModernHowItWorksSection from "../components/ModernHowItWorksSection"; // Import new how it works section
import MovingTestimonialsSection from "../components/MovingTestimonialsSection"; // Import new moving testimonials section
import AnimatedDarkFAQSection from "../components/AnimatedDarkFAQSection"; // Import new animated FAQ section
import ModernCTASection from "../components/ModernCTASection"; // Import new CTA section
import ProfessionalFooter from "../components/ProfessionalFooter"; // Import professional footer
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import Image from "next/image";
import { testimonial } from "../data/testimonial";
import { faqs } from "../data/faqs";
import { howItWorks } from "../data/howItWorks";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>
      <HeroSection />
      
      {/* Moving Object Component - Sleek Companies Section */}
      <SleekMovingCompaniesSection />

      {/* Dark Features Section - Replaces the old features section */}
      <ModernDarkFeaturesSection />

      {/* NEW: Animated Statistics Section */}
      <AnimatedStatsSection />
      
      {/* NEW: Modern How It Works Section */}
      <ModernHowItWorksSection howItWorks={howItWorks} />

      {/* NEW: Moving Testimonials Section */}
      <MovingTestimonialsSection testimonials={testimonial} />

      {/* NEW: Animated Dark FAQ Section */}
      <AnimatedDarkFAQSection faqs={faqs} />

      {/* NEW: Modern CTA Section */}
      <ModernCTASection />

      {/* NEW: Professional Footer */}
      <ProfessionalFooter />
    </>
  );
}