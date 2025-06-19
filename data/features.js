import { 
  BrainCircuit, 
  Briefcase, 
  LineChart, 
  ScrollText, 
  FileSearch, 
  FolderOpen, 
  SearchCheck, 
  Globe,
  Map
} from "lucide-react";

export const features = [
  {
    icon: <Globe className="w-10 h-10 mb-4 text-primary" />, 
    title: "Multi-Portal Job Search",
    description:
      "Search across multiple job portals like LinkedIn, Naukri, Indeed, and more in one place.",
  },
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
    icon: <Map className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Learning Roadmaps",
    description: "Generate personalized, step-by-step learning paths for any technology or skill with interactive progress tracking and specific technology recommendations.",
  },
  {
    icon: <SearchCheck className="w-10 h-10 mb-4 text-primary" />,
    title: "AI Job Automation",
    description: "Find the best job opportunities with AI-powered search and recommendations.",
  },
];