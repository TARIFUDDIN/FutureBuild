import { 
  BrainCircuit, 
  Briefcase, 
  LineChart, 
  ScrollText, 
  FileSearch, 
  Route, 
  SearchCheck 
} from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Career Guidance",
    description:
      "Get personalized career advice and insights powered by advanced AI technology.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Preparation",
    description:
      "Practice with role-specific questions and get instant feedback to improve your performance.",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Industry Insights",
    description:
      "Stay ahead with real-time industry trends, salary data, and market analysis.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Resume Creation",
    description: "Generate ATS-optimized resumes with AI assistance.",
  },
  {
    icon: <FileSearch className="w-10 h-10 mb-4 text-primary" />,
    title: "Resume Analyzer",
    description: "Get instant feedback on your resume with AI-driven analysis.",
  },
  {
    icon: <Route className="w-10 h-10 mb-4 text-primary" />,
    title: "AI Roadmap Generator",
    description: "Create a personalized AI learning roadmap based on your goals.",
  },
  {
    icon: <SearchCheck className="w-10 h-10 mb-4 text-primary" />,
    title: "AI Job Searching",
    description: "Find the best job opportunities with AI-powered search and recommendations.",
  },
];
