"use server";

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateRoadmapPrompt, sanitizeMermaidCode } from "../lib/roadmap-prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.4,
    topK: 40,
    topP: 0.8,
    maxOutputTokens: 2048,
  }
});

// Comprehensive domain mapping for better matching
const DOMAIN_MAPPING = {
  // Frontend Technologies
  'frontend': 'frontend',
  'front-end': 'frontend',
  'front end': 'frontend',
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  'nextjs': 'nextjs',
  'next.js': 'nextjs',
  'next js': 'nextjs',
  'vue': 'vue',
  'vuejs': 'vue',
  'vue.js': 'vue',
  'angular': 'angular',
  'angularjs': 'angular',
  'svelte': 'svelte',
  'javascript': 'javascript',
  'typescript': 'typescript',
  'html': 'frontend',
  'css': 'frontend',

  // Backend Technologies
  'backend': 'backend',
  'back-end': 'backend',
  'back end': 'backend',
  'node': 'nodejs',
  'nodejs': 'nodejs',
  'node.js': 'nodejs',
  'express': 'nodejs',
  'nestjs': 'nestjs',
  'nest.js': 'nestjs',
  'python': 'python',
  'django': 'python',
  'flask': 'python',
  'fastapi': 'python',
  'java': 'java',
  'spring': 'java',
  'springboot': 'java',
  'go': 'golang',
  'golang': 'golang',
  'rust': 'rust',
  'php': 'php',
  'laravel': 'php',

  // Full Stack
  'full stack': 'fullstack',
  'fullstack': 'fullstack',
  'full-stack': 'fullstack',
  'mern': 'fullstack',
  'mean': 'fullstack',
  'mevn': 'fullstack',

  // Mobile Development
  'mobile': 'mobile',
  'react native': 'react-native',
  'react-native': 'react-native',
  'flutter': 'flutter',
  'dart': 'flutter',
  'ios': 'ios',
  'swift': 'ios',
  'android': 'android',
  'kotlin': 'android',
  'xamarin': 'xamarin',

  // Data Science & AI
  'data science': 'data-science',
  'data scientist': 'data-science',
  'machine learning': 'machine-learning',
  'ml': 'machine-learning',
  'artificial intelligence': 'ai',
  'ai': 'ai',
  'deep learning': 'deep-learning',
  'data analyst': 'data-analyst',
  'data engineer': 'data-engineer',
  'data engineering': 'data-engineer',
  'genai': 'genai',
  'generative ai': 'genai',
  'llm': 'genai',
  'nlp': 'nlp',
  'computer vision': 'computer-vision',
  'mlops': 'mlops',

  // DevOps & Cloud
  'devops': 'devops',
  'cloud': 'cloud',
  'aws': 'aws',
  'azure': 'azure',
  'gcp': 'gcp',
  'google cloud': 'gcp',
  'kubernetes': 'kubernetes',
  'docker': 'devops',
  'ci/cd': 'devops',
  'sre': 'sre',
  'site reliability': 'sre',

  // Blockchain & Web3
  'blockchain': 'blockchain',
  'web3': 'web3',
  'ethereum': 'web3',
  'solidity': 'web3',
  'smart contract': 'web3',
  'defi': 'web3',
  'nft': 'web3',
  'crypto': 'blockchain',
  'cryptocurrency': 'blockchain',

  // Cybersecurity
  'cybersecurity': 'cybersecurity',
  'cyber security': 'cybersecurity',
  'security': 'cybersecurity',
  'ethical hacking': 'cybersecurity',
  'penetration testing': 'cybersecurity',
  'information security': 'cybersecurity',

  // Game Development
  'game development': 'game-dev',
  'game dev': 'game-dev',
  'unity': 'game-dev',
  'unreal': 'game-dev',
  'godot': 'game-dev',

  // UI/UX Design
  'ui': 'ui-ux',
  'ux': 'ui-ux',
  'ui/ux': 'ui-ux',
  'design': 'ui-ux',
  'product design': 'ui-ux',
  'user experience': 'ui-ux',

  // Database
  'database': 'database',
  'dba': 'database',
  'sql': 'database',
  'mongodb': 'database',
  'postgresql': 'database',
  'mysql': 'database',

  // Quality Assurance
  'qa': 'qa',
  'testing': 'qa',
  'automation testing': 'qa',
  'test automation': 'qa',
  'quality assurance': 'qa',

  // Product Management
  'product manager': 'product-manager',
  'product management': 'product-manager',
  'pm': 'product-manager',
};

export async function generateRoadmap(skillPath) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      experience: true,
    },
  });

  if (!user) throw new Error("User not found");

  const experienceLevel = !user.experience ? "beginner" :
    user.experience < 3 ? "beginner" :
    user.experience < 7 ? "intermediate" : "advanced";

  const prompt = generateRoadmapPrompt(
    skillPath,
    user.industry || "tech",
    experienceLevel
  );

  try {
    console.log("Generating technology-specific roadmap for:", skillPath, "Level:", experienceLevel);
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    let mermaidCode = response.text().trim();

    console.log("Raw AI response:", mermaidCode);

    // Clean and sanitize the Mermaid code
    mermaidCode = sanitizeMermaidCode(mermaidCode);

    console.log("Sanitized Mermaid code:", mermaidCode);

    // Validate the generated code has sufficient content and technologies
    if (!hasSpecificTechnologies(mermaidCode)) {
      console.log("Generated roadmap lacks specific technologies, using comprehensive fallback");
      mermaidCode = generateTechnologyFallback(skillPath, experienceLevel);
    }

    // Save the roadmap to the database
    await saveRoadmap(userId, skillPath, mermaidCode);

    return mermaidCode;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    
    // Return a technology-specific fallback roadmap if generation fails
    const fallbackRoadmap = generateTechnologyFallback(skillPath, experienceLevel);
    await saveRoadmap(userId, skillPath, fallbackRoadmap);
    return fallbackRoadmap;
  }
}

function hasSpecificTechnologies(mermaidCode) {
  const techKeywords = [
    // Web Development
    'React', 'Node.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Python', 
    'PostgreSQL', 'MongoDB', 'Express', 'Next.js', 'Docker', 'AWS', 'Git',
    'Tailwind', 'Firebase', 'Redux', 'GraphQL', 'REST', 'API', 'Vue', 'Angular',
    'Laravel', 'Django', 'Flask', 'Spring', 'Kubernetes', 'Jenkins',
    
    // Mobile Development
    'Flutter', 'Swift', 'Kotlin', 'React Native', 'Android', 'iOS', 'Dart',
    'Xamarin', 'Ionic', 'Cordova',
    
    // Data Engineering & AI
    'Apache Spark', 'Spark', 'Hadoop', 'Airflow', 'Apache Airflow', 'Kafka', 'Apache Kafka',
    'Snowflake', 'BigQuery', 'Redshift', 'Databricks', 'dbt', 'Pandas', 'NumPy',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Jupyter', 'Apache Beam', 'Flink',
    'Elasticsearch', 'Redis', 'Cassandra', 'HBase', 'Hive', 'Pig', 'Storm',
    'NiFi', 'Talend', 'Pentaho', 'SSIS', 'ETL', 'ELT', 'Data Pipeline',
    'Machine Learning', 'Deep Learning', 'Neural Networks', 'OpenAI', 'LangChain',
    'BERT', 'GPT', 'Transformer', 'MLOps', 'Kubeflow', 'MLflow',
    
    // Cloud & DevOps
    'Azure', 'GCP', 'Google Cloud', 'EC2', 'S3', 'Lambda', 'CloudFormation',
    'Terraform', 'Ansible', 'Chef', 'Puppet', 'Prometheus', 'Grafana',
    'EKS', 'AKS', 'GKE', 'Helm', 'Istio', 'Service Mesh',
    
    // Blockchain & Web3
    'Solidity', 'Ethereum', 'Smart Contract', 'Web3.js', 'Ethers.js', 'Hardhat',
    'Truffle', 'MetaMask', 'IPFS', 'DeFi', 'NFT', 'Polygon', 'Chainlink',
    
    // Databases
    'MySQL', 'Oracle', 'SQL Server', 'SQLite', 'DynamoDB', 'CosmosDB',
    'Neo4j', 'CouchDB', 'InfluxDB', 'TimescaleDB', 'ClickHouse',
    
    // Security
    'Penetration Testing', 'Ethical Hacking', 'Kali Linux', 'Wireshark',
    'Metasploit', 'Burp Suite', 'OWASP', 'Cybersecurity', 'Firewall',
    
    // Game Development
    'Unity', 'Unreal Engine', 'Godot', 'C#', 'C++', 'Blender', '3D Modeling',
    
    // UI/UX
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping',
    'Wireframing', 'User Research', 'Usability Testing',
    
    // QA & Testing
    'Selenium', 'Cypress', 'Jest', 'Mocha', 'Postman', 'JUnit', 'TestNG',
    'Automation Testing', 'Load Testing', 'Performance Testing',
    
    // Programming Languages
    'Java', 'Go', 'Golang', 'Rust', 'Ruby', 'PHP', 'Scala', 'R', 'MATLAB',
    'Perl', 'Shell Scripting', 'Bash', 'PowerShell',
    
    // Frameworks and Libraries
    'FastAPI', 'Gin', 'Fiber', 'Rails', 'Symfony', 'CodeIgniter', 'CakePHP',
    'Express.js', 'Koa.js', 'Fastify', 'NestJS', 'Svelte', 'Nuxt.js',
    
    // Development Tools
    'GitHub', 'GitLab', 'Bitbucket', 'JIRA', 'Confluence', 'Slack', 'Teams',
    'VS Code', 'IntelliJ', 'Eclipse', 'Vim', 'Emacs', 'Sublime Text',
    
    // Operating Systems and Infrastructure
    'Linux', 'Ubuntu', 'CentOS', 'RHEL', 'Windows Server', 'macOS',
    'Virtualization', 'VMware', 'VirtualBox', 'Hyper-V',
    
    // Networking
    'TCP/IP', 'HTTP', 'HTTPS', 'DNS', 'Load Balancer', 'CDN', 'VPN',
    'Firewall', 'Router', 'Switch', 'Network Security',
    
    // Monitoring and Logging
    'ELK Stack', 'Splunk', 'New Relic', 'Datadog', 'CloudWatch', 'Nagios',
    'Zabbix', 'Fluentd', 'Logstash', 'Kibana',
    
    // Message Queues and Streaming
    'RabbitMQ', 'ActiveMQ', 'Amazon SQS', 'Google Pub/Sub', 'Apache Pulsar',
    'NATS', 'ZeroMQ'
  ];
  
  const lines = mermaidCode.split('\n');
  let techCount = 0;
  let foundTechs = new Set(); // Track unique technologies found
  
  for (const line of lines) {
    const match = line.match(/[A-Z0-9]+\[([^\]]+)\]/);
    if (match) {
      const content = match[1].toLowerCase();
      
      // Check for specific technologies
      for (const tech of techKeywords) {
        const techLower = tech.toLowerCase();
        if (content.includes(techLower) && !foundTechs.has(techLower)) {
          foundTechs.add(techLower);
          techCount++;
          console.log(`Found technology: ${tech} in content: ${content}`);
        }
      }
      
      // Also check for common patterns that indicate specific technologies
      const patterns = [
        /\b(apache|aws|google|microsoft|meta|facebook|netflix|uber|airbnb)\s+\w+/i,
        /\b\w+\.(js|py|java|go|rs|rb|php|cpp|cs)\b/i,
        /\b\w+\s+(framework|library|database|platform|service|tool|engine|ide)\b/i,
        /\b(big\s+data|machine\s+learning|artificial\s+intelligence|data\s+science|devops|cybersecurity)\b/i
      ];
      
      for (const pattern of patterns) {
        if (pattern.test(content) && !foundTechs.has('pattern_' + content)) {
          foundTechs.add('pattern_' + content);
          techCount++;
          console.log(`Found technology pattern in: ${content}`);
        }
      }
    }
  }
  
  console.log(`Total technologies found: ${techCount}, Required: 4`);
  console.log(`Found technologies:`, Array.from(foundTechs));
  
  // Reduced threshold from 6 to 4 for better detection
  return techCount >= 4;
}

function identifyDomain(skillPath) {
  const normalizedSkill = skillPath.toLowerCase().trim();
  
  // Direct match first
  if (DOMAIN_MAPPING[normalizedSkill]) {
    return DOMAIN_MAPPING[normalizedSkill];
  }
  
  // Partial matches
  for (const [key, domain] of Object.entries(DOMAIN_MAPPING)) {
    if (normalizedSkill.includes(key) || key.includes(normalizedSkill)) {
      return domain;
    }
  }
  
  return 'generic';
}

function generateTechnologyFallback(skillPath, experienceLevel) {
  const domain = identifyDomain(skillPath);
  
  switch (domain) {
    case 'frontend':
      return getFrontendTechFallback(experienceLevel);
    case 'react':
      return getReactTechFallback(experienceLevel);
    case 'nextjs':
      return getNextjsTechFallback(experienceLevel);
    case 'vue':
      return getVueTechFallback(experienceLevel);
    case 'angular':
      return getAngularTechFallback(experienceLevel);
    case 'backend':
      return getBackendTechFallback(experienceLevel);
    case 'nodejs':
      return getNodejsTechFallback(experienceLevel);
    case 'python':
      return getPythonTechFallback(experienceLevel);
    case 'java':
      return getJavaTechFallback(experienceLevel);
    case 'golang':
      return getGolangTechFallback(experienceLevel);
    case 'fullstack':
      return getFullStackTechFallback(experienceLevel);
    case 'mobile':
      return getMobileTechFallback(experienceLevel);
    case 'react-native':
      return getReactNativeTechFallback(experienceLevel);
    case 'flutter':
      return getFlutterTechFallback(experienceLevel);
    case 'ios':
      return getIOSTechFallback(experienceLevel);
    case 'android':
      return getAndroidTechFallback(experienceLevel);
    case 'data-science':
      return getDataScienceTechFallback(experienceLevel);
    case 'data-engineer':
      return getDataEngineerTechFallback(experienceLevel);
    case 'machine-learning':
      return getMachineLearningTechFallback(experienceLevel);
    case 'ai':
      return getAITechFallback(experienceLevel);
    case 'genai':
      return getGenAITechFallback(experienceLevel);
    case 'devops':
      return getDevOpsTechFallback(experienceLevel);
    case 'cloud':
      return getCloudTechFallback(experienceLevel);
    case 'aws':
      return getAWSTechFallback(experienceLevel);
    case 'blockchain':
      return getBlockchainTechFallback(experienceLevel);
    case 'web3':
      return getWeb3TechFallback(experienceLevel);
    case 'cybersecurity':
      return getCybersecurityTechFallback(experienceLevel);
    case 'game-dev':
      return getGameDevTechFallback(experienceLevel);
    case 'ui-ux':
      return getUIUXTechFallback(experienceLevel);
    case 'qa':
      return getQATechFallback(experienceLevel);
    case 'product-manager':
      return getProductManagerTechFallback(experienceLevel);
    default:
      return getGenericTechFallback(skillPath, experienceLevel);
  }
}

// Enhanced existing fallback functions
function getFullStackTechFallback(experienceLevel) {
  if (experienceLevel === 'beginner') {
    return `flowchart TD
    A[HTML5 Semantic 3 weeks]
    B[CSS3 Flexbox Grid 3 weeks]
    C[JavaScript ES6+ 5 weeks]
    D[Git GitHub 2 weeks]
    E[React.js Fundamentals 6 weeks]
    F[TypeScript Basics 4 weeks]
    G[Node.js Express 5 weeks]
    H[REST API Design 4 weeks]
    I[PostgreSQL Basics 4 weeks]
    J[Prisma ORM 3 weeks]
    K[Next.js 13+ 5 weeks]
    L[Deployment Vercel 2 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
  } else if (experienceLevel === 'intermediate') {
    return `flowchart TD
    A[Advanced JavaScript 4 weeks]
    B[TypeScript Advanced 4 weeks]
    C[React Patterns Hooks 5 weeks]
    D[Next.js 14 SSR 5 weeks]
    E[State Management Zustand 3 weeks]
    F[Node.js Performance 5 weeks]
    G[NestJS Framework 5 weeks]
    H[PostgreSQL Advanced 4 weeks]
    I[Redis Caching 3 weeks]
    J[Docker Containerization 4 weeks]
    K[AWS Deployment 5 weeks]
    L[Microservices Architecture 6 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
  } else {
    return `flowchart TD
    A[System Design Principles 6 weeks]
    B[TypeScript Ecosystem 4 weeks]
    C[Next.js Enterprise 4 weeks]
    D[GraphQL Federation 4 weeks]
    E[NestJS Microservices 5 weeks]
    F[Database Optimization 4 weeks]
    G[Caching Strategies 3 weeks]
    H[Kubernetes Orchestration 6 weeks]
    I[AWS Architecture 5 weeks]
    J[Monitoring Observability 4 weeks]
    K[Security Best Practices 4 weeks]
    L[Technical Leadership 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
  }
}

function getFrontendTechFallback(experienceLevel) {
  return `flowchart TD
    A[HTML5 Semantic 2 weeks]
    B[CSS3 Grid Flexbox 3 weeks]
    C[JavaScript ES6+ 5 weeks]
    D[TypeScript 4 weeks]
    E[React.js 6 weeks]
    F[React Hooks 3 weeks]
    G[Next.js 5 weeks]
    H[Tailwind CSS 3 weeks]
    I[Zustand Redux 4 weeks]
    J[Framer Motion 3 weeks]
    K[Testing Jest 3 weeks]
    L[Vercel Deploy 2 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getBackendTechFallback(experienceLevel) {
  return `flowchart TD
    A[Node.js 5 weeks]
    B[JavaScript ES6+ 4 weeks]
    C[TypeScript 4 weeks]
    D[Express.js 4 weeks]
    E[REST APIs 4 weeks]
    F[PostgreSQL 5 weeks]
    G[Prisma ORM 3 weeks]
    H[Redis Caching 3 weeks]
    I[JWT Auth 3 weeks]
    J[NestJS 5 weeks]
    K[Docker 4 weeks]
    L[AWS Deploy 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

// New specific domain fallbacks
function getReactTechFallback(experienceLevel) {
  return `flowchart TD
    A[JavaScript ES6+ 4 weeks]
    B[React Fundamentals 5 weeks]
    C[JSX Components 3 weeks]
    D[React Hooks 4 weeks]
    E[State Management 4 weeks]
    F[React Router 3 weeks]
    G[Context API 3 weeks]
    H[Redux Toolkit 4 weeks]
    I[React Query 3 weeks]
    J[Testing React Testing Library 4 weeks]
    K[Performance Optimization 3 weeks]
    L[React 18 Features 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getNextjsTechFallback(experienceLevel) {
  return `flowchart TD
    A[React.js Mastery 4 weeks]
    B[Next.js Fundamentals 4 weeks]
    C[Pages Router 3 weeks]
    D[App Router 13+ 4 weeks]
    E[Server Components 3 weeks]
    F[Static Generation 3 weeks]
    G[API Routes 3 weeks]
    H[Middleware 2 weeks]
    I[Image Optimization 2 weeks]
    J[SEO Best Practices 3 weeks]
    K[Deployment Strategies 3 weeks]
    L[Performance Optimization 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getDataScienceTechFallback(experienceLevel) {
  return `flowchart TD
    A[Python 4 weeks]
    B[NumPy 3 weeks]
    C[Pandas 4 weeks]
    D[Matplotlib 3 weeks]
    E[Seaborn 2 weeks]
    F[Scikit-learn 5 weeks]
    G[TensorFlow 6 weeks]
    H[PyTorch 6 weeks]
    I[Jupyter Notebooks 2 weeks]
    J[SQL Advanced 4 weeks]
    K[Apache Spark 5 weeks]
    L[MLOps Docker 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getDataEngineerTechFallback(experienceLevel) {
  return `flowchart TD
    A[Python Programming 4 weeks]
    B[SQL Advanced Queries 4 weeks]
    C[Pandas Data Manipulation 3 weeks]
    D[Apache Spark 5 weeks]
    E[Apache Kafka 4 weeks]
    F[ETL Pipeline Design 4 weeks]
    G[Apache Airflow 4 weeks]
    H[Data Warehousing 4 weeks]
    I[Snowflake BigQuery 4 weeks]
    J[Docker Kubernetes 4 weeks]
    K[AWS Data Services 5 weeks]
    L[Data Governance 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getGenAITechFallback(experienceLevel) {
  return `flowchart TD
    A[Python Fundamentals 4 weeks]
    B[Machine Learning Basics 4 weeks]
    C[Natural Language Processing 4 weeks]
    D[Transformer Architecture 4 weeks]
    E[OpenAI API GPT Models 3 weeks]
    F[LangChain Framework 4 weeks]
    G[Vector Databases 3 weeks]
    H[RAG Implementation 4 weeks]
    I[Fine-tuning Techniques 5 weeks]
    J[Prompt Engineering 3 weeks]
    K[Deployment MLOps 4 weeks]
    L[Ethics AI Safety 2 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getWeb3TechFallback(experienceLevel) {
  return `flowchart TD
    A[Blockchain Fundamentals 4 weeks]
    B[Ethereum Basics 3 weeks]
    C[Solidity Programming 5 weeks]
    D[Smart Contract Development 5 weeks]
    E[Web3.js Ethers.js 4 weeks]
    F[Hardhat Truffle 3 weeks]
    G[DeFi Protocols 4 weeks]
    H[NFT Development 3 weeks]
    I[Frontend Integration 4 weeks]
    J[Security Auditing 4 weeks]
    K[Layer 2 Solutions 3 weeks]
    L[DApp Deployment 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getMobileTechFallback(experienceLevel) {
  return `flowchart TD
    A[JavaScript ES6+ 4 weeks]
    B[React.js 5 weeks]
    C[React Native 6 weeks]
    D[TypeScript 4 weeks]
    E[Expo 3 weeks]
    F[Navigation 3 weeks]
    G[Redux Toolkit 4 weeks]
    H[Async Storage 2 weeks]
    I[REST APIs 3 weeks]
    J[Firebase 4 weeks]
    K[App Store Deploy 3 weeks]
    L[Performance Optimization 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getFlutterTechFallback(experienceLevel) {
  return `flowchart TD
    A[Dart Programming 4 weeks]
    B[Flutter Fundamentals 4 weeks]
    C[Widgets State Management 4 weeks]
    D[Navigation Routing 3 weeks]
    E[HTTP Networking 3 weeks]
    F[Local Storage 2 weeks]
    G[Provider Riverpod 4 weeks]
    H[Animation UI Polish 3 weeks]
    I[Platform Integration 3 weeks]
    J[Testing Debugging 3 weeks]
    K[App Store Deployment 3 weeks]
    L[Performance Optimization 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getDevOpsTechFallback(experienceLevel) {
  return `flowchart TD
    A[Linux Commands 3 weeks]
    B[Bash Scripting 3 weeks]
    C[Git GitHub 2 weeks]
    D[Docker 5 weeks]
    E[Kubernetes 6 weeks]
    F[Jenkins 4 weeks]
    G[GitHub Actions 3 weeks]
    H[Terraform 4 weeks]
    I[AWS Services 6 weeks]
    J[Prometheus 3 weeks]
    K[Grafana 2 weeks]
    L[Security DevSecOps 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getCybersecurityTechFallback(experienceLevel) {
  return `flowchart TD
    A[Network Security Basics 4 weeks]
    B[Linux Command Line 3 weeks]
    C[Python Scripting 4 weeks]
    D[Ethical Hacking 5 weeks]
    E[Penetration Testing 5 weeks]
    F[Vulnerability Assessment 4 weeks]
    G[OWASP Top 10 3 weeks]
    H[Incident Response 4 weeks]
    I[Digital Forensics 4 weeks]
    J[Security Tools Kali 4 weeks]
    K[Compliance Frameworks 3 weeks]
    L[Security Certifications 6 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getUIUXTechFallback(experienceLevel) {
  return `flowchart TD
    A[Design Principles 3 weeks]
    B[User Research Methods 4 weeks]
    C[Figma Mastery 4 weeks]
    D[Wireframing Prototyping 4 weeks]
    E[User Journey Mapping 3 weeks]
    F[Information Architecture 3 weeks]
    G[Visual Design Systems 4 weeks]
    H[Usability Testing 3 weeks]
    I[Accessibility Standards 3 weeks]
    J[Frontend Collaboration 3 weeks]
    K[Portfolio Development 4 weeks]
    L[Industry Tools Adobe XD 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

// Additional missing fallback functions
function getVueTechFallback(experienceLevel) {
  return `flowchart TD
    A[JavaScript ES6+ 4 weeks]
    B[Vue.js 3 Composition API 5 weeks]
    C[Vue Router 3 weeks]
    D[Vuex Pinia 4 weeks]
    E[Vue CLI Vite 3 weeks]
    F[Component Libraries 3 weeks]
    G[Nuxt.js Framework 4 weeks]
    H[Testing Vue Test Utils 3 weeks]
    I[Performance Optimization 3 weeks]
    J[TypeScript Integration 3 weeks]
    K[Deployment Strategies 3 weeks]
    L[Vue Ecosystem 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getAngularTechFallback(experienceLevel) {
  return `flowchart TD
    A[TypeScript Fundamentals 4 weeks]
    B[Angular Framework 5 weeks]
    C[Components Services 4 weeks]
    D[Angular Router 3 weeks]
    E[RxJS Observables 4 weeks]
    F[Angular Forms 3 weeks]
    G[HttpClient API Integration 3 weeks]
    H[Angular Material 3 weeks]
    I[State Management NgRx 4 weeks]
    J[Testing Jasmine Karma 4 weeks]
    K[Angular CLI 2 weeks]
    L[Deployment Best Practices 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getNodejsTechFallback(experienceLevel) {
  return `flowchart TD
    A[JavaScript ES6+ 4 weeks]
    B[Node.js Runtime 4 weeks]
    C[Express.js Framework 4 weeks]
    D[RESTful API Design 4 weeks]
    E[Database Integration 4 weeks]
    F[Authentication JWT 3 weeks]
    G[Middleware Development 3 weeks]
    H[Error Handling Logging 3 weeks]
    I[Testing Mocha Jest 4 weeks]
    J[Security Best Practices 3 weeks]
    K[Performance Optimization 3 weeks]
    L[Deployment PM2 Docker 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getPythonTechFallback(experienceLevel) {
  return `flowchart TD
    A[Python Fundamentals 4 weeks]
    B[Object Oriented Programming 3 weeks]
    C[Data Structures Algorithms 4 weeks]
    D[Django Framework 5 weeks]
    E[REST API Development 4 weeks]
    F[Database ORM 3 weeks]
    G[Authentication Authorization 3 weeks]
    H[Testing PyTest 3 weeks]
    I[Web Scraping BeautifulSoup 3 weeks]
    J[Task Queues Celery 3 weeks]
    K[Docker Deployment 4 weeks]
    L[Cloud Platforms AWS 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getJavaTechFallback(experienceLevel) {
  return `flowchart TD
    A[Java Fundamentals 5 weeks]
    B[Object Oriented Design 4 weeks]
    C[Spring Framework 5 weeks]
    D[Spring Boot 4 weeks]
    E[RESTful Web Services 4 weeks]
    F[JPA Hibernate 4 weeks]
    G[Spring Security 4 weeks]
    H[Unit Testing JUnit 3 weeks]
    I[Maven Gradle 3 weeks]
    J[Microservices 5 weeks]
    K[Docker Kubernetes 4 weeks]
    L[Cloud Deployment 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getGolangTechFallback(experienceLevel) {
  return `flowchart TD
    A[Go Language Basics 4 weeks]
    B[Go Routines Channels 4 weeks]
    C[HTTP Server Development 3 weeks]
    D[Gin Fiber Framework 4 weeks]
    E[Database Integration 3 weeks]
    F[REST API Development 4 weeks]
    G[Middleware JWT Auth 3 weeks]
    H[Testing Go Test 3 weeks]
    I[Go Modules Dependencies 2 weeks]
    J[Microservices gRPC 4 weeks]
    K[Docker Containerization 3 weeks]
    L[Cloud Deployment 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getReactNativeTechFallback(experienceLevel) {
  return `flowchart TD
    A[JavaScript ES6+ 4 weeks]
    B[React.js Fundamentals 4 weeks]
    C[React Native Setup 3 weeks]
    D[Navigation React Navigation 3 weeks]
    E[State Management Redux 4 weeks]
    F[Native Modules APIs 3 weeks]
    G[Styling Flexbox 3 weeks]
    H[HTTP Networking 3 weeks]
    I[Local Storage AsyncStorage 2 weeks]
    J[Push Notifications 3 weeks]
    K[App Store Deployment 4 weeks]
    L[Performance Optimization 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getIOSTechFallback(experienceLevel) {
  return `flowchart TD
    A[Swift Programming 5 weeks]
    B[Xcode IDE 3 weeks]
    C[UIKit Fundamentals 4 weeks]
    D[Auto Layout Constraints 3 weeks]
    E[View Controllers 4 weeks]
    F[Data Persistence Core Data 4 weeks]
    G[Networking URLSession 3 weeks]
    H[Grand Central Dispatch 3 weeks]
    I[App Store Guidelines 2 weeks]
    J[Testing XCTest 3 weeks]
    K[SwiftUI Modern UI 4 weeks]
    L[App Store Submission 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getAndroidTechFallback(experienceLevel) {
  return `flowchart TD
    A[Kotlin Programming 5 weeks]
    B[Android Studio 3 weeks]
    C[Activity Fragment Lifecycle 4 weeks]
    D[Layouts Views 3 weeks]
    E[RecyclerView Adapters 3 weeks]
    F[Room Database 4 weeks]
    G[Retrofit Networking 3 weeks]
    H[MVVM Architecture 4 weeks]
    I[Jetpack Components 4 weeks]
    J[Testing Espresso 3 weeks]
    K[Material Design 3 weeks]
    L[Play Store Publishing 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getMachineLearningTechFallback(experienceLevel) {
  return `flowchart TD
    A[Python Programming 4 weeks]
    B[Statistics Mathematics 4 weeks]
    C[NumPy Pandas 4 weeks]
    D[Data Visualization 3 weeks]
    E[Scikit-learn 5 weeks]
    F[Supervised Learning 4 weeks]
    G[Unsupervised Learning 4 weeks]
    H[Deep Learning TensorFlow 6 weeks]
    I[Model Evaluation 3 weeks]
    J[Feature Engineering 4 weeks]
    K[MLOps Deployment 4 weeks]
    L[Advanced Algorithms 5 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getAITechFallback(experienceLevel) {
  return `flowchart TD
    A[AI Fundamentals 4 weeks]
    B[Python Programming 4 weeks]
    C[Machine Learning Basics 5 weeks]
    D[Neural Networks 4 weeks]
    E[Deep Learning Frameworks 5 weeks]
    F[Computer Vision 4 weeks]
    G[Natural Language Processing 5 weeks]
    H[Reinforcement Learning 4 weeks]
    I[AI Ethics 2 weeks]
    J[Model Deployment 4 weeks]
    K[MLOps Pipelines 4 weeks]
    L[Research Publications 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getCloudTechFallback(experienceLevel) {
  return `flowchart TD
    A[Cloud Computing Basics 3 weeks]
    B[Linux Command Line 3 weeks]
    C[Networking Fundamentals 4 weeks]
    D[AWS Core Services 5 weeks]
    E[Infrastructure as Code 4 weeks]
    F[Containerization Docker 4 weeks]
    G[Kubernetes Orchestration 5 weeks]
    H[CI/CD Pipelines 4 weeks]
    I[Monitoring Logging 3 weeks]
    J[Security Best Practices 4 weeks]
    K[Cost Optimization 3 weeks]
    L[Multi-Cloud Strategies 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getAWSTechFallback(experienceLevel) {
  return `flowchart TD
    A[AWS Cloud Practitioner 4 weeks]
    B[IAM Security 3 weeks]
    C[EC2 Compute 4 weeks]
    D[S3 Storage 3 weeks]
    E[VPC Networking 4 weeks]
    F[RDS Databases 3 weeks]
    G[Lambda Serverless 4 weeks]
    H[CloudFormation IaC 4 weeks]
    I[CloudWatch Monitoring 3 weeks]
    J[Solutions Architect 5 weeks]
    K[Well-Architected Framework 3 weeks]
    L[AWS Certifications 6 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getBlockchainTechFallback(experienceLevel) {
  return `flowchart TD
    A[Blockchain Fundamentals 4 weeks]
    B[Cryptography Basics 3 weeks]
    C[Bitcoin Ethereum 4 weeks]
    D[Consensus Mechanisms 3 weeks]
    E[Smart Contracts 4 weeks]
    F[Solidity Programming 5 weeks]
    G[Web3 Development 4 weeks]
    H[DeFi Protocols 4 weeks]
    I[Security Auditing 4 weeks]
    J[Scaling Solutions 3 weeks]
    K[Tokenomics 3 weeks]
    L[Blockchain Applications 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getGameDevTechFallback(experienceLevel) {
  return `flowchart TD
    A[Game Design Fundamentals 4 weeks]
    B[C# Programming 4 weeks]
    C[Unity Engine Basics 5 weeks]
    D[2D Game Development 4 weeks]
    E[3D Game Development 5 weeks]
    F[Physics Animation 4 weeks]
    G[UI UX for Games 3 weeks]
    H[Audio Implementation 3 weeks]
    I[Performance Optimization 3 weeks]
    J[Platform Deployment 3 weeks]
    K[Game Publishing 3 weeks]
    L[Portfolio Projects 6 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getQATechFallback(experienceLevel) {
  return `flowchart TD
    A[Testing Fundamentals 3 weeks]
    B[Manual Testing 4 weeks]
    C[Test Case Design 3 weeks]
    D[Bug Reporting JIRA 2 weeks]
    E[Automation Testing 5 weeks]
    F[Selenium WebDriver 4 weeks]
    G[API Testing Postman 4 weeks]
    H[Performance Testing 4 weeks]
    I[CI/CD Integration 3 weeks]
    J[Test Frameworks 4 weeks]
    K[Mobile Testing 3 weeks]
    L[Quality Processes 3 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getProductManagerTechFallback(experienceLevel) {
  return `flowchart TD
    A[Product Management Basics 4 weeks]
    B[Market Research 3 weeks]
    C[User Research UX 4 weeks]
    D[Product Strategy 4 weeks]
    E[Roadmap Planning 3 weeks]
    F[Agile Scrum 3 weeks]
    G[Analytics Data Analysis 4 weeks]
    H[Stakeholder Management 3 weeks]
    I[Technical Understanding 4 weeks]
    J[A/B Testing 3 weeks]
    K[Go-to-Market Strategy 4 weeks]
    L[Leadership Skills 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

function getGenericTechFallback(skillPath, experienceLevel) {
  return `flowchart TD
    A[Foundation Concepts 4 weeks]
    B[Core Technologies 6 weeks]
    C[Framework Fundamentals 5 weeks]
    D[Database Integration 4 weeks]
    E[API Development 4 weeks]
    F[Testing Methodologies 3 weeks]
    G[Development Tools 4 weeks]
    H[Security Practices 3 weeks]
    I[Performance Optimization 4 weeks]
    J[Best Practices 3 weeks]
    K[Portfolio Projects 6 weeks]
    L[Professional Skills 4 weeks]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L`;
}

// Get available roadmap domains for dropdown - ASYNC FUNCTION
export async function getAvailableRoadmaps() {
  // This is now an async function to comply with Next.js Server Actions
  return [
    { value: 'frontend', label: 'Frontend Development', category: 'Web Development' },
    { value: 'react', label: 'React.js Developer', category: 'Web Development' },
    { value: 'nextjs', label: 'Next.js Developer', category: 'Web Development' },
    { value: 'vue', label: 'Vue.js Developer', category: 'Web Development' },
    { value: 'angular', label: 'Angular Developer', category: 'Web Development' },
    { value: 'backend', label: 'Backend Development', category: 'Web Development' },
    { value: 'nodejs', label: 'Node.js Developer', category: 'Web Development' },
    { value: 'python', label: 'Python Developer', category: 'Web Development' },
    { value: 'java', label: 'Java Developer', category: 'Web Development' },
    { value: 'golang', label: 'Go Developer', category: 'Web Development' },
    { value: 'fullstack', label: 'Full Stack Developer', category: 'Web Development' },
    
    { value: 'mobile', label: 'Mobile Development', category: 'Mobile' },
    { value: 'react-native', label: 'React Native Developer', category: 'Mobile' },
    { value: 'flutter', label: 'Flutter Developer', category: 'Mobile' },
    { value: 'ios', label: 'iOS Developer', category: 'Mobile' },
    { value: 'android', label: 'Android Developer', category: 'Mobile' },
    
    { value: 'data-science', label: 'Data Scientist', category: 'Data & AI' },
    { value: 'data-engineer', label: 'Data Engineer', category: 'Data & AI' },
    { value: 'machine-learning', label: 'Machine Learning Engineer', category: 'Data & AI' },
    { value: 'ai', label: 'AI Engineer', category: 'Data & AI' },
    { value: 'genai', label: 'Generative AI Engineer', category: 'Data & AI' },
    
    { value: 'devops', label: 'DevOps Engineer', category: 'Infrastructure' },
    { value: 'cloud', label: 'Cloud Engineer', category: 'Infrastructure' },
    { value: 'aws', label: 'AWS Solutions Architect', category: 'Infrastructure' },
    { value: 'cybersecurity', label: 'Cybersecurity Specialist', category: 'Infrastructure' },
    
    { value: 'blockchain', label: 'Blockchain Developer', category: 'Emerging Tech' },
    { value: 'web3', label: 'Web3 Developer', category: 'Emerging Tech' },
    { value: 'game-dev', label: 'Game Developer', category: 'Emerging Tech' },
    
    { value: 'ui-ux', label: 'UI/UX Designer', category: 'Design' },
    { value: 'qa', label: 'QA Engineer', category: 'Quality' },
    { value: 'product-manager', label: 'Product Manager', category: 'Management' },
  ];
}

async function saveRoadmap(clerkUserId, skillPath, mermaidCode) {
  try {
    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!user) throw new Error("User not found");

    await db.roadmap.create({
      data: {
        userId: user.id,
        skillPath,
        mermaidCode,
      },
    });
    
    console.log("Technology roadmap saved successfully");
  } catch (error) {
    console.error("Error saving roadmap:", error);
    // Continue even if saving fails
  }
}

export async function getUserRoadmaps() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  try {
    const roadmaps = await db.roadmap.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return roadmaps;
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    throw new Error("Failed to fetch roadmaps");
  }
}