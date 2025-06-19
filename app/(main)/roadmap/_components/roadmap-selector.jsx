import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Code, Database, Cloud, Smartphone, Brain, Shield, Gamepad2, Palette, CheckCircle, Star, TrendingUp, Filter } from 'lucide-react';

const RoadmapSelector = ({ onSelect, selectedValue = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const dropdownRef = useRef(null);

  // Available roadmaps with enhanced metadata
  const roadmaps = [
    // Web Development
    { value: 'frontend', label: 'Frontend Development', category: 'Web Development', icon: <Code className="h-4 w-4" />, popularity: 95, difficulty: 'Beginner', duration: '12-16 weeks' },
    { value: 'react', label: 'React.js Developer', category: 'Web Development', icon: <Code className="h-4 w-4" />, popularity: 98, difficulty: 'Intermediate', duration: '10-14 weeks' },
    { value: 'nextjs', label: 'Next.js Developer', category: 'Web Development', icon: <Code className="h-4 w-4" />, popularity: 92, difficulty: 'Intermediate', duration: '12-16 weeks' },
    { value: 'vue', label: 'Vue.js Developer', category: 'Web Development', icon: <Code className="h-4 w-4" />, popularity: 85, difficulty: 'Intermediate', duration: '10-14 weeks' },
    { value: 'angular', label: 'Angular Developer', category: 'Web Development', icon: <Code className="h-4 w-4" />, popularity: 80, difficulty: 'Intermediate', duration: '12-16 weeks' },
    { value: 'backend', label: 'Backend Development', category: 'Web Development', icon: <Database className="h-4 w-4" />, popularity: 90, difficulty: 'Intermediate', duration: '14-18 weeks' },
    { value: 'nodejs', label: 'Node.js Developer', category: 'Web Development', icon: <Database className="h-4 w-4" />, popularity: 88, difficulty: 'Intermediate', duration: '12-16 weeks' },
    { value: 'python', label: 'Python Developer', category: 'Web Development', icon: <Database className="h-4 w-4" />, popularity: 95, difficulty: 'Beginner', duration: '14-18 weeks' },
    { value: 'java', label: 'Java Developer', category: 'Web Development', icon: <Database className="h-4 w-4" />, popularity: 85, difficulty: 'Intermediate', duration: '16-20 weeks' },
    { value: 'golang', label: 'Go Developer', category: 'Web Development', icon: <Database className="h-4 w-4" />, popularity: 78, difficulty: 'Intermediate', duration: '12-16 weeks' },
    { value: 'fullstack', label: 'Full Stack Developer', category: 'Web Development', icon: <Code className="h-4 w-4" />, popularity: 100, difficulty: 'Intermediate', duration: '20-24 weeks' },
    
    // Mobile Development
    { value: 'mobile', label: 'Mobile Development', category: 'Mobile', icon: <Smartphone className="h-4 w-4" />, popularity: 88, difficulty: 'Intermediate', duration: '16-20 weeks' },
    { value: 'react-native', label: 'React Native Developer', category: 'Mobile', icon: <Smartphone className="h-4 w-4" />, popularity: 85, difficulty: 'Intermediate', duration: '14-18 weeks' },
    { value: 'flutter', label: 'Flutter Developer', category: 'Mobile', icon: <Smartphone className="h-4 w-4" />, popularity: 90, difficulty: 'Intermediate', duration: '14-18 weeks' },
    { value: 'ios', label: 'iOS Developer', category: 'Mobile', icon: <Smartphone className="h-4 w-4" />, popularity: 82, difficulty: 'Intermediate', duration: '16-20 weeks' },
    { value: 'android', label: 'Android Developer', category: 'Mobile', icon: <Smartphone className="h-4 w-4" />, popularity: 83, difficulty: 'Intermediate', duration: '16-20 weeks' },
    
    // Data & AI
    { value: 'data-science', label: 'Data Scientist', category: 'Data & AI', icon: <Brain className="h-4 w-4" />, popularity: 94, difficulty: 'Advanced', duration: '20-24 weeks' },
    { value: 'data-engineer', label: 'Data Engineer', category: 'Data & AI', icon: <Database className="h-4 w-4" />, popularity: 92, difficulty: 'Advanced', duration: '18-22 weeks' },
    { value: 'machine-learning', label: 'Machine Learning Engineer', category: 'Data & AI', icon: <Brain className="h-4 w-4" />, popularity: 96, difficulty: 'Advanced', duration: '22-26 weeks' },
    { value: 'ai', label: 'AI Engineer', category: 'Data & AI', icon: <Brain className="h-4 w-4" />, popularity: 98, difficulty: 'Advanced', duration: '20-24 weeks' },
    { value: 'genai', label: 'Generative AI Engineer', category: 'Data & AI', icon: <Brain className="h-4 w-4" />, popularity: 99, difficulty: 'Advanced', duration: '16-20 weeks' },
    
    // Infrastructure
    { value: 'devops', label: 'DevOps Engineer', category: 'Infrastructure', icon: <Cloud className="h-4 w-4" />, popularity: 89, difficulty: 'Intermediate', duration: '18-22 weeks' },
    { value: 'cloud', label: 'Cloud Engineer', category: 'Infrastructure', icon: <Cloud className="h-4 w-4" />, popularity: 93, difficulty: 'Intermediate', duration: '16-20 weeks' },
    { value: 'aws', label: 'AWS Solutions Architect', category: 'Infrastructure', icon: <Cloud className="h-4 w-4" />, popularity: 90, difficulty: 'Intermediate', duration: '14-18 weeks' },
    { value: 'cybersecurity', label: 'Cybersecurity Specialist', category: 'Infrastructure', icon: <Shield className="h-4 w-4" />, popularity: 87, difficulty: 'Advanced', duration: '20-24 weeks' },
    
    // Emerging Tech
    { value: 'blockchain', label: 'Blockchain Developer', category: 'Emerging Tech', icon: <Code className="h-4 w-4" />, popularity: 75, difficulty: 'Advanced', duration: '16-20 weeks' },
    { value: 'web3', label: 'Web3 Developer', category: 'Emerging Tech', icon: <Code className="h-4 w-4" />, popularity: 80, difficulty: 'Advanced', duration: '16-20 weeks' },
    { value: 'game-dev', label: 'Game Developer', category: 'Emerging Tech', icon: <Gamepad2 className="h-4 w-4" />, popularity: 70, difficulty: 'Intermediate', duration: '18-22 weeks' },
    
    // Design & Other
    { value: 'ui-ux', label: 'UI/UX Designer', category: 'Design', icon: <Palette className="h-4 w-4" />, popularity: 85, difficulty: 'Beginner', duration: '12-16 weeks' },
    { value: 'qa', label: 'QA Engineer', category: 'Quality', icon: <CheckCircle className="h-4 w-4" />, popularity: 78, difficulty: 'Beginner', duration: '12-16 weeks' },
    { value: 'product-manager', label: 'Product Manager', category: 'Management', icon: <TrendingUp className="h-4 w-4" />, popularity: 88, difficulty: 'Intermediate', duration: '14-18 weeks' },
  ];

  const categories = ['all', ...new Set(roadmaps.map(r => r.category))];

  const filteredRoadmaps = roadmaps.filter(roadmap => {
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

  // Sort categories by priority
  const categoryOrder = ['Web Development', 'Data & AI', 'Mobile', 'Infrastructure', 'Emerging Tech', 'Design', 'Quality', 'Management'];
  const sortedCategories = Object.keys(groupedRoadmaps).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-700 bg-green-100 border-green-300 dark:text-green-200 dark:bg-green-900/30 dark:border-green-700';
      case 'Intermediate': return 'text-yellow-700 bg-yellow-100 border-yellow-300 dark:text-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700';
      case 'Advanced': return 'text-red-700 bg-red-100 border-red-300 dark:text-red-200 dark:bg-red-900/30 dark:border-red-700';
      default: return 'text-gray-700 bg-gray-100 border-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  const getPopularityStars = (popularity) => {
    const stars = Math.floor((popularity / 100) * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  const selectedRoadmap = roadmaps.find(r => r.value === selectedValue);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Value Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedRoadmap ? (
              <>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="text-blue-600 dark:text-blue-400">
                    {selectedRoadmap.icon}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{selectedRoadmap.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{selectedRoadmap.category}</div>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-500 dark:text-gray-400">Select a roadmap...</div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">Choose your learning path</div>
                </div>
              </>
            )}
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl max-h-96 overflow-hidden">
          {/* Search and Filter Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {filteredRoadmaps.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <div>No roadmaps found</div>
                <div className="text-sm">Try adjusting your search or filter</div>
              </div>
            ) : (
              sortedCategories.map(category => (
                <div key={category} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {category}
                    </h3>
                  </div>
                  {groupedRoadmaps[category]
                    .sort((a, b) => b.popularity - a.popularity)
                    .map(roadmap => (
                    <div
                      key={roadmap.value}
                      onClick={() => {
                        onSelect(roadmap.value);
                        setIsOpen(false);
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors duration-150 border-b border-gray-50 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <div className="text-blue-600 dark:text-blue-400">
                            {roadmap.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-white">{roadmap.label}</span>
                            {roadmap.popularity >= 90 && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                                Hot 🔥
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              {getPopularityStars(roadmap.popularity)}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{roadmap.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(roadmap.difficulty)}`}>
                          {roadmap.difficulty}
                        </span>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {roadmap.popularity}% match
                        </div>
                      </div>
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

// Demo component to show how to use the selector
const RoadmapDemo = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState('');

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🚀 AI Career Coach</h1>
        <p className="text-gray-600 dark:text-gray-300">Choose your learning path from our comprehensive roadmap collection</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Your Learning Roadmap
        </label>
        <RoadmapSelector 
          selectedValue={selectedRoadmap}
          onSelect={(value) => {
            setSelectedRoadmap(value);
            console.log('Selected roadmap:', value);
          }}
        />
        
        {selectedRoadmap && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Selected Roadmap:</h3>
            <p className="text-blue-700 dark:text-blue-300">
              {selectedRoadmap} - Ready to generate your personalized learning path!
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          📊 {new Set(['Web Development', 'Data & AI', 'Mobile', 'Infrastructure', 'Emerging Tech', 'Design', 'Quality', 'Management']).size} categories • 
          🎯 30+ specialized roadmaps • 
          ⭐ Difficulty & popularity ratings
        </p>
      </div>
    </div>
  );
};

export default RoadmapDemo;