"use server";

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");
  
  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // FIXED: Removed the problematic include that references non-existent field
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    // Removed: include: { industryInsight: true }
    // The industryInsight relationship doesn't exist in your User model
  });

  if (!user) throw new Error("User not found");

  let prompt = "";
  
  switch (type.toLowerCase()) {
    case "summary":
      prompt = `
        As an expert resume writer, improve the following professional summary for a ${user.industry || "professional"} professional.
        Make it more impactful, compelling, and aligned with industry standards.
        
        Current summary: "${current}"
        
        Requirements:
        1. Make it compelling and attention-grabbing
        2. Highlight key strengths and unique value proposition
        3. Include relevant keywords for the industry
        4. Keep it concise but impactful (2-3 sentences)
        5. Focus on achievements and value delivered
        6. Use active voice and strong action words
        
        Format the response as a single paragraph without any additional text or explanations.
      `;
      break;
      
    case "skills":
      prompt = `
        As an expert resume writer, improve the following skills section for a ${user.industry || "professional"} professional.
        Make it more comprehensive, relevant, and well-organized.
        
        Current skills: "${current}"
        
        Requirements:
        1. Organize skills into logical categories if appropriate
        2. Include industry-relevant technical and soft skills
        3. Use current industry terminology
        4. Prioritize in-demand skills for the field
        5. Remove outdated or irrelevant skills
        6. Format clearly and professionally
        
        Format the response as organized text without any additional explanations.
      `;
      break;
      
    case "experience":
    case "education":
    case "project":
    case "achievement":
    case "problem solving":
      prompt = `
        As an expert resume writer, improve the following ${type} description for a ${user.industry || "professional"} professional.
        Make it more impactful, quantifiable, and aligned with industry standards.
        
        Current content: "${current}"
        
        Requirements:
        1. Use strong action verbs
        2. Include metrics and results where possible
        3. Highlight relevant technical skills and technologies
        4. Keep it concise but detailed
        5. Focus on achievements over responsibilities
        6. Use industry-specific keywords
        7. Show impact and value delivered
        
        Format the response as a single paragraph without any additional text or explanations.
      `;
      break;
      
    default:
      throw new Error(`Unsupported improvement type: ${type}`);
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}

// New function to save structured resume data
export async function saveStructuredResume(resumeData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        ...resumeData,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        ...resumeData,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving structured resume:", error);
    throw new Error("Failed to save resume");
  }
}

// Function to get structured resume data
export async function getStructuredResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");
  
  const resume = await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!resume) return null;

  // Return structured data for form population
  return {
    contactInfo: {
      email: resume.email || "",
      mobile: resume.mobile || "",
      linkedin: resume.linkedin || "",
      github: resume.github || "",
    },
    summary: resume.summary || "",
    skills: resume.skills || "",
    experience: resume.experience || [],
    education: resume.education || [],
    projects: resume.projects || [],
    achievements: resume.achievements || [],
    problemSolving: resume.problemSolving || [],
    content: resume.content || "",
    atsScore: resume.atsScore,
    feedback: resume.feedback,
  };
}