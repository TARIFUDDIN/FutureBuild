// lib/roadmap-prompts.js

export function generateRoadmapPrompt(skillPath, industry, experienceLevel) {
    const skillPrompt = getSkillSpecificPrompt(skillPath);
    
    return `
      Generate a learning roadmap for a ${experienceLevel} level professional in ${industry || "tech"} 
      who wants to learn ${skillPath}.
      
      ${skillPrompt}
      
      Create a Mermaid flowchart diagram with the following requirements:
      
      1. START your response with exactly: "flowchart TD"
      2. Use clear node IDs (like node1, node2) - don't use special characters in IDs
      3. Format main topic nodes as rectangles with time estimates: "node1[Topic Name (X weeks)]"
      4. Format subtopic nodes with rounded corners: "node2(Subtopic Name)"
      5. Connect nodes with arrows: "node1 --> node2"
      6. Use dashed arrows for optional paths: "node1 -.-> node2"
      7. Group recommended resources in one node per section
      8. Include 6-8 main topics maximum
      9. Keep node text under 6 words
      
      Example of correct syntax:
      flowchart TD
        A[Main Topic (4 weeks)] --> B(Subtopic 1)
        A --> C(Subtopic 2)
        B --> D[Resources: Book1, Course1]
        C --> D
        A -.-> E(Optional Topic)
      
      Do NOT include any backticks, markdown formatting, or explanations - ONLY the flowchart code.
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