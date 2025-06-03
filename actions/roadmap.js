"use server";

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateRoadmapPrompt, sanitizeMermaidCode } from "../lib/roadmap-prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.4, // Lower temperature for more consistent tech recommendations
    topK: 40,
    topP: 0.8,
    maxOutputTokens: 2048,
  }
});

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
    'React', 'Node.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Python', 
    'PostgreSQL', 'MongoDB', 'Express', 'Next.js', 'Docker', 'AWS', 'Git',
    'Tailwind', 'Firebase', 'Redux', 'GraphQL', 'REST', 'API'
  ];
  
  const lines = mermaidCode.split('\n');
  let techCount = 0;
  
  for (const line of lines) {
    const match = line.match(/[A-Z0-9]+\[([^\]]+)\]/);
    if (match) {
      const content = match[1];
      for (const tech of techKeywords) {
        if (content.toLowerCase().includes(tech.toLowerCase())) {
          techCount++;
          break;
        }
      }
    }
  }
  
  return techCount >= 6; // Should have at least 6 specific technologies
}

function generateTechnologyFallback(skillPath, experienceLevel) {
  const skillLower = skillPath.toLowerCase();
  
  if (skillLower.includes('full stack') || skillLower.includes('fullstack') || skillLower.includes('full-stack')) {
    return getFullStackTechFallback(experienceLevel);
  }
  
  if (skillLower.includes('frontend') || skillLower.includes('front-end') || skillLower.includes('react')) {
    return getFrontendTechFallback(experienceLevel);
  }
  
  if (skillLower.includes('backend') || skillLower.includes('back-end') || skillLower.includes('node')) {
    return getBackendTechFallback(experienceLevel);
  }
  
  if (skillLower.includes('data scien') || skillLower.includes('machine learning') || skillLower.includes('ml')) {
    return getDataScienceTechFallback(experienceLevel);
  }
  
  if (skillLower.includes('devops') || skillLower.includes('cloud')) {
    return getDevOpsTechFallback(experienceLevel);
  }
  
  if (skillLower.includes('mobile') || skillLower.includes('android') || skillLower.includes('ios')) {
    return getMobileTechFallback(experienceLevel);
  }
  
  // Generic tech fallback
  return getGenericTechFallback(skillPath, experienceLevel);
}

function getFullStackTechFallback(experienceLevel) {
  if (experienceLevel === 'beginner') {
    return `flowchart TD
    A[HTML5 3 weeks]
    B[CSS3 Flexbox 3 weeks]
    C[JavaScript ES6+ 5 weeks]
    D[Git GitHub 2 weeks]
    E[React.js 6 weeks]
    F[TypeScript 4 weeks]
    G[Node.js 5 weeks]
    H[Express.js 4 weeks]
    I[PostgreSQL 4 weeks]
    J[Prisma ORM 3 weeks]
    K[Next.js 5 weeks]
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
  } else if (experienceLevel === 'intermediate') {
    return `flowchart TD
    A[JavaScript Advanced 4 weeks]
    B[TypeScript 4 weeks]
    C[React.js Hooks 5 weeks]
    D[Next.js 14 5 weeks]
    E[Zustand State 3 weeks]
    F[Node.js APIs 5 weeks]
    G[NestJS 5 weeks]
    H[PostgreSQL Advanced 4 weeks]
    I[Redis Caching 3 weeks]
    J[Docker 4 weeks]
    K[AWS Services 5 weeks]
    L[Microservices 6 weeks]
    
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
    A[System Design 6 weeks]
    B[TypeScript Advanced 4 weeks]
    C[Next.js SSR 4 weeks]
    D[GraphQL 4 weeks]
    E[NestJS Enterprise 5 weeks]
    F[PostgreSQL Scaling 4 weeks]
    G[Redis Advanced 3 weeks]
    H[Kubernetes 6 weeks]
    I[AWS Architecture 5 weeks]
    J[Monitoring Tools 4 weeks]
    K[Security Practices 4 weeks]
    L[Team Leadership 4 weeks]
    
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

function getGenericTechFallback(skillPath, experienceLevel) {
  return `flowchart TD
    A[Foundation Skills 4 weeks]
    B[Core Technologies 6 weeks]
    C[Framework Mastery 5 weeks]
    D[Database Systems 4 weeks]
    E[API Development 4 weeks]
    F[Testing Strategies 3 weeks]
    G[Deployment Tools 4 weeks]
    H[Security Practices 3 weeks]
    I[Performance Optimization 4 weeks]
    J[Best Practices 3 weeks]
    K[Project Portfolio 6 weeks]
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