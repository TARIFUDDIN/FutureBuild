"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { generateRoadmap, getUserRoadmaps, getAvailableRoadmaps } from "../../../actions/roadmap";
import RoadmapViewer from "./_components/roadmap-viewer";
import EnhancedFallbackRoadmap from "./_components/fallback-roadmap";
import { 
  Loader2, 
  Sparkles, 
  Target, 
  Clock, 
  BookOpen, 
  TrendingUp,
  Zap,
  Brain,
  Rocket,
  Star,
  ChevronRight,
  Lightbulb,
  Award,
  Map
} from "lucide-react";
import { toast } from "sonner";

// Roadmap Selector Component (inline for this example)
const RoadmapSelector = ({ onSelect, selectedValue = '', availableRoadmaps = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(availableRoadmaps.map(r => r.category))];

  const filteredRoadmaps = availableRoadmaps.filter(roadmap => {
    const matchesSearch = roadmap.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || roadmap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedRoadmaps = filteredRoadmaps.reduce((acc, roadmap) => {
    if (!acc[roadmap.category]) {
      acc[roadmap.category] = [];
    }
    acc[roadmap.category].push(roadmap);
    return acc;
  }, {});

  const categoryOrder = ['Web Development', 'Data & AI', 'Mobile', 'Infrastructure', 'Emerging Tech', 'Design', 'Quality', 'Management'];
  const sortedCategories = Object.keys(groupedRoadmaps).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  const selectedRoadmap = availableRoadmaps.find(r => r.value === selectedValue);

  return (
    <div className="relative w-full">
      {/* Selected Value Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedRoadmap ? (
              <>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedRoadmap.label}</div>
                  <div className="text-sm text-gray-500">{selectedRoadmap.category}</div>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Map className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-500">Select a roadmap...</div>
                  <div className="text-sm text-gray-400">Choose your learning path</div>
                </div>
              </>
            )}
          </div>
          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-hidden">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Results */}
          <div className="max-h-64 overflow-y-auto">
            {filteredRoadmaps.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div>No roadmaps found</div>
                <div className="text-sm">Try adjusting your search</div>
              </div>
            ) : (
              sortedCategories.map(category => (
                <div key={category} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      {category}
                    </h3>
                  </div>
                  {groupedRoadmaps[category].map(roadmap => (
                    <div
                      key={roadmap.value}
                      onClick={() => {
                        onSelect(roadmap.value, roadmap.label);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className="flex items-center p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <Target className="h-4 w-4 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-900">{roadmap.label}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function RoadmapPage() {
  const [skillPath, setSkillPath] = useState("");
  const [customSkillPath, setCustomSkillPath] = useState("");
  const [description, setDescription] = useState("");
  const [roadmapCode, setRoadmapCode] = useState("");
  const [roadmapTitle, setRoadmapTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [availableRoadmaps, setAvailableRoadmaps] = useState([]);
  const [useCustomInput, setUseCustomInput] = useState(false);

  // Load available roadmaps and saved roadmaps on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [roadmaps, saved] = await Promise.all([
          getAvailableRoadmaps(),
          getUserRoadmaps()
        ]);
        setAvailableRoadmaps(roadmaps);
        setSavedRoadmaps(saved);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load roadmap data");
      }
    };

    loadData();
  }, []);

  const handleGenerateRoadmap = async () => {
    const finalSkillPath = useCustomInput ? customSkillPath : skillPath;
    
    if (!finalSkillPath.trim()) {
      toast.error("Please select or enter a skill path");
      return;
    }

    setLoading(true);
    try {
      const mermaidCode = await generateRoadmap(finalSkillPath);
      setRoadmapCode(mermaidCode);
      setRoadmapTitle(finalSkillPath);
      
      // Refresh saved roadmaps
      const updated = await getUserRoadmaps();
      setSavedRoadmaps(updated);
      
      toast.success("Roadmap generated successfully!");
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast.error("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoadmap = (value, label) => {
    setSkillPath(value);
    setRoadmapTitle(label);
    setUseCustomInput(false);
  };

  const handleLoadSavedRoadmap = (roadmap) => {
    setRoadmapCode(roadmap.mermaidCode);
    setRoadmapTitle(roadmap.skillPath);
    setSkillPath(roadmap.skillPath);
  };

  const toggleInputMode = () => {
    setUseCustomInput(!useCustomInput);
    setSkillPath("");
    setCustomSkillPath("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Rocket className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              AI-Powered Career
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Roadmap Generator
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your career aspirations into a structured learning journey. 
              Get personalized roadmaps for 30+ tech domains with AI-powered recommendations.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-blue-100">
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                <span>30+ Domains</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Structured Timeline</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Generation Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
                  <Sparkles className="h-6 w-6 mr-3 text-purple-600" />
                  Generate Your Learning Roadmap
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Choose from our curated paths or describe your custom learning goal
                </p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Input Mode Toggle */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 p-1 rounded-lg flex">
                    <button
                      onClick={() => setUseCustomInput(false)}
                      className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                        !useCustomInput 
                          ? 'bg-white shadow-md text-blue-600 font-medium' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Curated Paths
                    </button>
                    <button
                      onClick={() => setUseCustomInput(true)}
                      className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                        useCustomInput 
                          ? 'bg-white shadow-md text-blue-600 font-medium' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Custom Goal
                    </button>
                  </div>
                </div>

                {/* Input Section */}
                {!useCustomInput ? (
                  <div className="space-y-3">
                    <Label htmlFor="skillPath" className="text-base font-semibold text-gray-700">
                      Select Your Learning Path
                    </Label>
                    <RoadmapSelector 
                      selectedValue={skillPath}
                      onSelect={handleSelectRoadmap}
                      availableRoadmaps={availableRoadmaps}
                    />
                    <p className="text-sm text-gray-500">
                      Choose from {availableRoadmaps.length}+ professionally curated learning paths
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label htmlFor="customSkillPath" className="text-base font-semibold text-gray-700">
                      Describe Your Learning Goal
                    </Label>
                    <Input
                      id="customSkillPath"
                      value={customSkillPath}
                      onChange={(e) => setCustomSkillPath(e.target.value)}
                      placeholder="e.g., Blockchain Developer, AI Engineer, Full Stack with React..."
                      className="text-base py-3"
                    />
                    <p className="text-sm text-gray-500">
                      Describe any tech skill or career path you want to learn
                    </p>
                  </div>
                )}

                {/* Optional Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-semibold text-gray-700">
                    Additional Context (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Any specific requirements, timeline, or focus areas you'd like to mention..."
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerateRoadmap} 
                  disabled={loading || (!skillPath && !customSkillPath.trim())}
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      Generating Your Roadmap...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-3" />
                      Generate AI Roadmap
                    </>
                  )}
                </Button>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">30+</div>
                    <div className="text-sm text-gray-600">Tech Domains</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">AI</div>
                    <div className="text-sm text-gray-600">Powered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">∞</div>
                    <div className="text-sm text-gray-600">Possibilities</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Roadmaps */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Trending Paths
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {['Full Stack Developer', 'Generative AI Engineer', 'React.js Developer', 'Data Engineer', 'Web3 Developer'].map((path, index) => (
                    <button
                      key={path}
                      onClick={() => handleSelectRoadmap(path.toLowerCase().replace(/\s+/g, '-').replace('.js', 'js'), path)}
                      className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-100 hover:border-blue-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {path}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Saved Roadmaps */}
            {savedRoadmaps.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                    Your Roadmaps
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {savedRoadmaps.slice(0, 5).map((roadmap) => (
                      <button
                        key={roadmap.id}
                        onClick={() => handleLoadSavedRoadmap(roadmap)}
                        className="w-full text-left p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 border border-gray-100 hover:border-purple-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                              {roadmap.skillPath}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <div className="text-xs text-gray-500 mt-1 ml-6">
                          {new Date(roadmap.createdAt).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Why Our Roadmaps?
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">AI-powered curriculum based on industry standards</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Structured timelines with realistic milestones</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Interactive progress tracking</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Constantly updated with latest technologies</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generated Roadmap Display */}
        {roadmapCode && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Personalized Learning Roadmap
              </h2>
              <p className="text-gray-600">
                Interactive roadmap generated specifically for your learning goals
              </p>
            </div>
            
            <RoadmapViewer code={roadmapCode} title={roadmapTitle} />
            
            {/* Alternative: Use Enhanced Fallback if you prefer that style */}
            {/* <EnhancedFallbackRoadmap code={roadmapCode} title={roadmapTitle} /> */}
          </div>
        )}
      </div>
    </div>
  );
}