

export function generateRoadmapPrompt(skillPath, industry, experienceLevel) {
  const skillPrompt = getSkillSpecificPrompt(skillPath);
  
  return `
    Generate a learning roadmap for a ${experienceLevel} level professional in ${industry || "tech"} 
    who wants to learn ${skillPath}.
    
    ${skillPrompt}
    
    Create a Mermaid flowchart diagram using EXACTLY this format:
    
    flowchart TD
      A[Main Topic 1 (X weeks)]
      B[Main Topic 2 (Y weeks)]
      C[Main Topic 3 (Z weeks)]
      
      A --> B
      B --> C
      
    Important rules:
    1. ALWAYS start with exactly "flowchart TD" on the first line
    2. Define ALL nodes FIRST with unique IDs (single letters or letter+number like A1, B2)
    3. THEN define all connections between nodes AFTER all node definitions
    4. Use square brackets for main topics: A[Topic (X weeks)]
    5. Use parentheses for subtopics: B(Subtopic)
    6. Keep the diagram simple with just 6-8 main topics
    7. Limit all text to 5 words maximum
    
    DO NOT use any other syntax or markdown formatting. Return ONLY the diagram code.
  `;
}
  
  function getSkillSpecificPrompt(skillPath) {
    const lowerSkill = skillPath.toLowerCase();
    
    if (lowerSkill.includes('web') || lowerSkill.includes('frontend') || lowerSkill.includes('backend')) {
      return `
        Include these key areas:
        - Core programming fundamentals
        - Frontend technologies (HTML, CSS, JS frameworks)
        - Backend development (server, APIs, databases)
        - DevOps basics
        - Project structure and architecture
        - Testing and deployment
      `;
    }
    
    if (lowerSkill.includes('data') || lowerSkill.includes('machine learning') || lowerSkill.includes('ai')) {
      return `
        Include these key areas:
        - Mathematics fundamentals
        - Programming for data analysis
        - Data collection and cleaning
        - Exploratory data analysis
        - Machine learning algorithms
        - Model evaluation
        - Deployment considerations
      `;
    }
    
    if (lowerSkill.includes('design') || lowerSkill.includes('ux') || lowerSkill.includes('ui')) {
      return `
        Include these key areas:
        - Design fundamentals and theory
        - User research methods
        - Wireframing and prototyping
        - Visual design principles
        - Design tools
        - User testing
        - Portfolio development
      `;
    }
    
    // Generic structure for other skills
    return `
      Structure the roadmap to include:
      - Fundamental knowledge requirements
      - Core skill building (3-4 main areas)
      - Advanced topics
      - Practical application projects
      - Resources for each stage (books, courses, tutorials)
      
      Make each step actionable with clear outcomes.
    `;
  }
  // Add this function to your RoadmapViewer component
function sanitizeMermaidCode(code) {
  // Remove any markdown formatting
  let cleanCode = code.replace(/```mermaid\s*/g, "").replace(/```\s*$/g, "").trim();
  
  // Ensure it starts with flowchart TD
  if (!cleanCode.startsWith("flowchart TD") && !cleanCode.startsWith("graph TD")) {
    cleanCode = "flowchart TD\n" + cleanCode;
  }
  
  // Split into lines for processing
  const lines = cleanCode.split('\n');
  const processedLines = [];
  
  // Make sure the first line is the flowchart definition
  processedLines.push(lines[0]);
  
  // Process remaining lines
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Fix common syntax errors
    if (line.includes('-->') && !line.match(/^\s*[A-Za-z0-9]+\s*-->/)) {
      // If line has arrow but doesn't start with a node ID, it might be malformed
      const parts = line.split('-->');
      if (parts.length >= 2) {
        const sourceMatch = parts[0].match(/([A-Za-z0-9]+)\s*$/);
        const targetMatch = parts[1].match(/^\s*([A-Za-z0-9]+)/);
        
        if (sourceMatch && targetMatch) {
          line = `${sourceMatch[1]} --> ${targetMatch[1]}`;
        }
      }
    }
    
    processedLines.push(line);
  }
  
  return processedLines.join('\n');
}