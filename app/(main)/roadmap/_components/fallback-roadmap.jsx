// app/(main)/roadmap/_components/fallback-roadmap.jsx
"use client";

export default function FallbackRoadmap({ code, title }) {
  // Convert Mermaid flowchart to a simple text representation
  const parseTextRoadmap = (mermaidCode) => {
    try {
      const lines = mermaidCode.split('\n');
      let sections = [];
      
      // Basic parsing of node definitions and connections
      for (const line of lines) {
        // Look for node definitions with content in brackets or parentheses
        const nodeMatch = line.match(/([A-Za-z0-9]+)\[([^\]]+)\]|([A-Za-z0-9]+)\(([^\)]+)\)/);
        if (nodeMatch) {
          const content = nodeMatch[2] || nodeMatch[4];
          if (content && !content.includes('Recommended Resources')) {
            sections.push(content);
          }
        }
      }
      
      return sections;
    } catch (error) {
      return ["Unable to parse roadmap content"];
    }
  };
  
  const roadmapSections = parseTextRoadmap(code);
  
  return (
    <div className="border rounded-lg p-6 bg-white">
      <h3 className="text-xl font-medium mb-6">Learning Roadmap: {title}</h3>
      
      <div className="space-y-8">
        {roadmapSections.map((section, index) => (
          <div key={index} className="relative">
            {index > 0 && (
              <div className="absolute top-0 left-6 -mt-8 h-8 w-0.5 bg-gray-300"></div>
            )}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">{index + 1}</span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium">{section}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t text-sm text-muted-foreground">
        <p>Note: This is a simplified version of your roadmap. Try regenerating with more specific parameters for better results.</p>
      </div>
    </div>
  );
}