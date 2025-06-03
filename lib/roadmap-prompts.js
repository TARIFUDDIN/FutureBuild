export function generateRoadmapPrompt(skillPath, industry, experienceLevel) {
  const prompt = generateIntelligentPrompt(skillPath, experienceLevel);
  
  return `
    You are an expert technology educator. Generate a comprehensive, step-by-step learning roadmap for "${skillPath}" 
    for a ${experienceLevel} level learner.
    
    ${prompt}
    
    CRITICAL REQUIREMENTS:
    1. Create a Mermaid flowchart starting with "flowchart TD"
    2. Use single letter IDs (A, B, C, D, E, F, G, H, I, J, K, L)
    3. Format: A[Step Name Duration]
    4. Include 8-12 learning steps with realistic timeframes
    5. Each step should be a specific, actionable learning milestone
    6. Include specific technology names when relevant (React.js, Node.js, TypeScript, etc.)
    7. For generic skills, use descriptive but concise names
    8. Duration should be 1-8 weeks per step
    9. Create logical learning progression with dependencies
    10. Focus on practical, industry-relevant skills
    
    Example format:
    flowchart TD
        A[HTML CSS Basics 3 weeks]
        B[JavaScript ES6+ 4 weeks]
        C[React.js Fundamentals 5 weeks]
        
        A --> B
        B --> C
    
    Return ONLY the Mermaid flowchart code, no explanations.
  `;
}

function generateIntelligentPrompt(skillPath, experienceLevel) {
  const lowerSkill = skillPath.toLowerCase();
  
  // Specific Framework/Technology Roadmaps
  if (lowerSkill.includes('next.js') || lowerSkill.includes('nextjs')) {
    return getNextJSRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('react.js') || lowerSkill.includes('react ') || lowerSkill.includes('reactjs')) {
    return getReactRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('node.js') || lowerSkill.includes('nodejs')) {
    return getNodeJSRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('python') && !lowerSkill.includes('data')) {
    return getPythonRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('vue.js') || lowerSkill.includes('vue')) {
    return getVueRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('angular')) {
    return getAngularRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('flutter')) {
    return getFlutterRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('swift') || lowerSkill.includes('ios')) {
    return getIOSRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('kotlin') || lowerSkill.includes('android')) {
    return getAndroidRoadmap(experienceLevel);
  }
  
  // Domain-Specific Roadmaps
  if (lowerSkill.includes('full stack') || lowerSkill.includes('fullstack')) {
    return getFullStackRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('frontend') || lowerSkill.includes('front-end')) {
    return getFrontendRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('backend') || lowerSkill.includes('back-end')) {
    return getBackendRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('data scien') || lowerSkill.includes('machine learning') || lowerSkill.includes('ml')) {
    return getDataScienceRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('devops') || lowerSkill.includes('cloud')) {
    return getDevOpsRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('mobile')) {
    return getMobileRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('ui/ux') || lowerSkill.includes('design')) {
    return getDesignRoadmap(experienceLevel);
  }
  
  if (lowerSkill.includes('cybersecurity') || lowerSkill.includes('security')) {
    return getCybersecurityRoadmap(experienceLevel);
  }
  
  // Generic adaptive roadmap
  return getAdaptiveRoadmap(skillPath, experienceLevel);
}

// Specific Technology Roadmaps
function getNextJSRoadmap(experienceLevel) {
  if (experienceLevel === 'beginner') {
    return `
      Create a comprehensive Next.js Developer roadmap focusing on:
      1. HTML CSS JavaScript fundamentals (if needed)
      2. React.js fundamentals and hooks
      3. Next.js basics - pages, routing, components
      4. Next.js App Router and file-based routing
      5. Data fetching - SSG, SSR, ISR
      6. API routes and serverless functions
      7. Styling with Tailwind CSS or CSS Modules
      8. Authentication and user management
      9. Database integration (Prisma/MongoDB)
      10. Deployment on Vercel
      11. Performance optimization
      12. Full-stack Next.js project
      
      Focus on practical, hands-on learning with real projects.
    `;
  } else if (experienceLevel === 'intermediate') {
    return `
      Create an advanced Next.js Developer roadmap focusing on:
      1. Next.js 14 App Router mastery
      2. Advanced data fetching patterns
      3. Server components vs Client components
      4. Middleware and edge functions
      5. Advanced API development
      6. Authentication strategies (NextAuth, Clerk)
      7. Database optimization and caching
      8. TypeScript integration
      9. Testing strategies (Jest, Playwright)
      10. Performance optimization and monitoring
      11. CI/CD and deployment strategies
      12. Enterprise Next.js architecture
      
      Focus on best practices and scalable solutions.
    `;
  } else {
    return `
      Create an expert Next.js Developer roadmap focusing on:
      1. Next.js architecture patterns
      2. Custom server and advanced configuration
      3. Micro-frontends with Next.js
      4. Advanced caching strategies
      5. Custom webpack and build optimization
      6. Internationalization and localization
      7. Advanced security implementations
      8. Performance monitoring and analytics
      9. Team collaboration and code standards
      10. Contributing to Next.js ecosystem
      11. Teaching and mentoring others
      12. Leading Next.js projects
      
      Focus on mastery and leadership skills.
    `;
  }
}

function getReactRoadmap(experienceLevel) {
  if (experienceLevel === 'beginner') {
    return `
      Create a React.js Developer roadmap focusing on:
      1. JavaScript ES6+ fundamentals
      2. React fundamentals and JSX
      3. Components and props
      4. State management with useState
      5. Event handling and forms
      6. React Hooks (useEffect, useContext)
      7. React Router for navigation
      8. State management (Context API/Redux)
      9. HTTP requests and API integration
      10. Component styling (CSS Modules/Styled Components)
      11. Testing React components
      12. React project deployment
      
      Focus on building solid React foundations.
    `;
  } else {
    return `
      Create an advanced React.js Developer roadmap focusing on:
      1. Advanced React patterns
      2. Custom hooks development
      3. Performance optimization techniques
      4. Advanced state management (Zustand/Redux Toolkit)
      5. React Query for server state
      6. TypeScript with React
      7. Testing strategies (Jest, React Testing Library)
      8. React DevTools mastery
      9. Code splitting and lazy loading
      10. React ecosystem libraries
      11. Contributing to React community
      12. Leading React projects
      
      Focus on advanced patterns and best practices.
    `;
  }
}

function getNodeJSRoadmap(experienceLevel) {
  return `
    Create a Node.js Developer roadmap focusing on:
    1. JavaScript fundamentals and async programming
    2. Node.js runtime and modules
    3. NPM and package management
    4. Express.js framework
    5. RESTful API development
    6. Database integration (MongoDB/PostgreSQL)
    7. Authentication and authorization
    8. Middleware and error handling
    9. Testing Node.js applications
    10. Security best practices
    11. Performance optimization
    12. Deployment and production setup
    
    Focus on building robust server-side applications.
  `;
}

function getPythonRoadmap(experienceLevel) {
  return `
    Create a Python Developer roadmap focusing on:
    1. Python syntax and fundamentals
    2. Data structures and algorithms
    3. Object-oriented programming
    4. File handling and modules
    5. Web development with Flask/Django
    6. Database integration
    7. API development
    8. Testing and debugging
    9. Package management and virtual environments
    10. Deployment strategies
    11. Python best practices
    12. Advanced Python projects
    
    Focus on practical Python development skills.
  `;
}

function getVueRoadmap(experienceLevel) {
  return `
    Create a Vue.js Developer roadmap focusing on:
    1. JavaScript ES6+ fundamentals
    2. Vue.js basics and directives
    3. Vue components and props
    4. Vue Router for navigation
    5. Vuex for state management
    6. Vue CLI and project setup
    7. Vue 3 Composition API
    8. Component communication
    9. HTTP requests with Axios
    10. Vue ecosystem libraries
    11. Testing Vue applications
    12. Vue project deployment
    
    Focus on modern Vue.js development.
  `;
}

function getFlutterRoadmap(experienceLevel) {
  return `
    Create a Flutter Developer roadmap focusing on:
    1. Dart programming fundamentals
    2. Flutter basics and widgets
    3. Layouts and UI design
    4. State management (setState, Provider)
    5. Navigation and routing
    6. HTTP requests and APIs
    7. Local data storage
    8. Firebase integration
    9. Native device features
    10. Testing Flutter apps
    11. App store deployment
    12. Flutter performance optimization
    
    Focus on cross-platform mobile development.
  `;
}

// Domain Roadmaps
function getFullStackRoadmap(experienceLevel) {
  if (experienceLevel === 'beginner') {
    return `
      Create a Full Stack Developer roadmap covering:
      1. HTML5 and CSS3 fundamentals
      2. JavaScript ES6+ programming
      3. Version control with Git
      4. Frontend framework (React.js)
      5. Backend development (Node.js/Express)
      6. Database fundamentals (SQL/NoSQL)
      7. RESTful API development
      8. Authentication implementation
      9. Frontend-backend integration
      10. Deployment basics
      11. Testing fundamentals
      12. Full-stack project portfolio
      
      Focus on building complete web applications.
    `;
  } else {
    return `
      Create an advanced Full Stack Developer roadmap covering:
      1. Advanced JavaScript/TypeScript
      2. Modern frontend frameworks
      3. Advanced backend architecture
      4. Database design and optimization
      5. Microservices architecture
      6. Cloud services and deployment
      7. Security implementation
      8. Performance optimization
      9. Testing strategies
      10. CI/CD pipelines
      11. System design principles
      12. Leadership and mentoring
      
      Focus on scalable and maintainable systems.
    `;
  }
}

function getFrontendRoadmap(experienceLevel) {
  return `
    Create a Frontend Developer roadmap covering:
    1. HTML5 semantic structure
    2. CSS3 and modern styling
    3. JavaScript fundamentals
    4. Responsive web design
    5. Frontend framework mastery
    6. State management solutions
    7. Build tools and bundlers
    8. Performance optimization
    9. Testing methodologies
    10. Accessibility standards
    11. Progressive Web Apps
    12. Frontend architecture patterns
    
    Focus on creating exceptional user interfaces.
  `;
}

function getBackendRoadmap(experienceLevel) {
  return `
    Create a Backend Developer roadmap covering:
    1. Server-side programming language
    2. Database design and management
    3. RESTful API development
    4. Authentication and authorization
    5. Server architecture patterns
    6. Caching strategies
    7. Message queues and async processing
    8. Security best practices
    9. Performance optimization
    10. Monitoring and logging
    11. Deployment and DevOps
    12. Scalability planning
    
    Focus on robust server-side development.
  `;
}

function getDataScienceRoadmap(experienceLevel) {
  return `
    Create a Data Science roadmap covering:
    1. Python programming fundamentals
    2. Statistics and mathematics
    3. Data manipulation with Pandas
    4. Data visualization techniques
    5. Machine learning algorithms
    6. Deep learning frameworks
    7. Data preprocessing and cleaning
    8. Model evaluation and validation
    9. Big data tools and techniques
    10. MLOps and model deployment
    11. Advanced analytics projects
    12. Research and experimentation
    
    Focus on data-driven insights and predictions.
  `;
}

function getDevOpsRoadmap(experienceLevel) {
  return `
    Create a DevOps roadmap covering:
    1. Linux system administration
    2. Version control and collaboration
    3. Containerization with Docker
    4. Container orchestration
    5. CI/CD pipeline development
    6. Infrastructure as Code
    7. Cloud platform services
    8. Monitoring and observability
    9. Security and compliance
    10. Automation scripting
    11. Performance optimization
    12. Team collaboration practices
    
    Focus on streamlining development and operations.
  `;
}

function getMobileRoadmap(experienceLevel) {
  return `
    Create a Mobile Developer roadmap covering:
    1. Mobile development fundamentals
    2. Platform-specific languages
    3. Mobile UI/UX principles
    4. Cross-platform frameworks
    5. API integration
    6. Local data storage
    7. Device feature integration
    8. Performance optimization
    9. Testing strategies
    10. App store guidelines
    11. Mobile security practices
    12. Advanced mobile features
    
    Focus on creating mobile applications.
  `;
}

function getDesignRoadmap(experienceLevel) {
  return `
    Create a UI/UX Design roadmap covering:
    1. Design fundamentals and theory
    2. User research methodologies
    3. Information architecture
    4. Wireframing and prototyping
    5. Visual design principles
    6. Design system creation
    7. Usability testing
    8. Interaction design
    9. Accessibility standards
    10. Design tool mastery
    11. Collaboration with developers
    12. Design leadership skills
    
    Focus on user-centered design processes.
  `;
}

function getCybersecurityRoadmap(experienceLevel) {
  return `
    Create a Cybersecurity roadmap covering:
    1. Security fundamentals
    2. Network security basics
    3. Operating system security
    4. Cryptography principles
    5. Vulnerability assessment
    6. Penetration testing
    7. Incident response
    8. Security frameworks
    9. Risk management
    10. Security tools mastery
    11. Compliance and governance
    12. Advanced threat analysis
    
    Focus on protecting systems and data.
  `;
}

function getAdaptiveRoadmap(skillPath, experienceLevel) {
  return `
    Create a comprehensive ${skillPath} learning roadmap that:
    1. Starts with fundamental concepts and prerequisites
    2. Progresses through core skills and technologies
    3. Includes practical, hands-on projects
    4. Covers industry-standard tools and practices
    5. Addresses real-world applications
    6. Incorporates best practices and methodologies
    7. Includes testing and quality assurance
    8. Covers deployment and production considerations
    9. Addresses performance and optimization
    10. Includes collaboration and teamwork skills
    11. Covers continuous learning and improvement
    12. Culminates in advanced projects and specialization
    
    Adapt the content to be specific to ${skillPath} while maintaining logical progression.
    Use specific technology names and tools where relevant.
    For generic skills, use descriptive and actionable step names.
  `;
}

// Enhanced sanitization function
export function sanitizeMermaidCode(code) {
  if (!code || typeof code !== 'string') {
    return `flowchart TD
    A[Fundamentals 4 weeks]
    B[Core Skills 5 weeks]
    C[Advanced Topics 6 weeks]
    D[Projects 4 weeks]
    
    A --> B
    B --> C
    C --> D`;
  }

  let cleanCode = code.replace(/```mermaid\s*/g, "").replace(/```\s*$/g, "").trim();
  
  if (!cleanCode.startsWith("flowchart TD") && !cleanCode.startsWith("graph TD")) {
    cleanCode = "flowchart TD\n" + cleanCode;
  }
  
  const lines = cleanCode.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const processedLines = ["flowchart TD"];
  
  let nodeDefinitions = [];
  let connections = [];
  
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i];
    
    line = line.replace(/["""''`]/g, '"');
    line = line.replace(/[^\w\s\[\]\(\)→.-]/g, '');
    
    if (line.includes('-->') || line.includes('->')) {
      connections.push(line.replace('->', '-->'));
    } else if ((line.includes('[') && line.includes(']')) || (line.includes('(') && line.includes(')'))) {
      let cleanNode = line;
      cleanNode = cleanNode.replace(/^([A-Za-z0-9]+)\(([^\)]+)\)/, '$1[$2]');
      nodeDefinitions.push(cleanNode);
    }
  }
  
  nodeDefinitions.forEach(node => {
    processedLines.push(`    ${node}`);
  });
  
  if (connections.length > 0) {
    processedLines.push("");
  }
  
  connections.forEach(conn => {
    processedLines.push(`    ${conn}`);
  });
  
  return processedLines.join('\n');
}