"use server";

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeResume(resumeText, jobTitle) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Analyze this resume for a ${jobTitle || user.industry || "professional"} position. 
    Provide detailed analysis including:
    
    1. ATS Score (out of 100)
    2. Missing keywords/skills for this industry: ${user.industry || "general"}
    3. Structure and formatting issues
    4. Content improvement suggestions
    5. Specific action items to improve
    
    Return the response in this JSON format only, no additional text:
    {
      "atsScore": number,
      "missingKeywords": ["string"],
      "structureIssues": ["string"],
      "contentSuggestions": ["string"],
      "actionItems": ["string"]
    }
    
    Resume text:
    ${resumeText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const analysis = JSON.parse(cleanedText);

    await db.resumeAnalysis.create({
      data: {
        userId: user.id,
        atsScore: analysis.atsScore,
        missingKeywords: analysis.missingKeywords,
        structureIssues: analysis.structureIssues,
        contentSuggestions: analysis.contentSuggestions,
        actionItems: analysis.actionItems,
        jobTitle: jobTitle || "General",
      },
    });

    return analysis;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume");
  }
}

export async function getResumeAnalyses() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    
    if (!user) throw new Error("User not found");
    
    // Add explicit check for db object
    if (!db || !db.resumeAnalysis) {
      console.error("Database client not initialized properly");
      throw new Error("Database connection error");
    }
    
    const analyses = await db.resumeAnalysis.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return analyses;
  } catch (error) {
    console.error("Error fetching resume analyses:", error);
    throw new Error(`Failed to fetch resume analyses: ${error.message}`);
  }
}
export async function extractResumeText(fileBuffer, fileType) {
  try {
    let extractedText = '';
    
    if (fileType === 'application/pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(fileBuffer);
      extractedText = data.text;
    } else if (fileType.includes('word')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = result.value;
    } else {
      throw new Error("Unsupported file format");
    }
    
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from resume:", error);
    throw new Error("Failed to extract text from resume file");
  }
}