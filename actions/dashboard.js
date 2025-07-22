"use server";

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
        Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
        {
          "salaryRanges": [
            { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
          ],
          "growthRate": number,
          "demandLevel": "High" | "Medium" | "Low",
          "topSkills": ["skill1", "skill2"],
          "marketOutlook": "Positive" | "Neutral" | "Negative",
          "keyTrends": ["trend1", "trend2"],
          "recommendedSkills": ["skill1", "skill2"]
        }
                   
        IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
        Include at least 5 common roles for salary ranges.
        Growth rate should be a percentage.
        Include at least 5 skills and trends.
      `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('AI insights generation failed:', error);
    
    // Return fallback insights for the industry
    return generateFallbackInsights(industry);
  }
};

// Fallback insights when AI fails
function generateFallbackInsights(industry) {
  return {
    salaryRanges: [
      { role: "Junior Developer", min: 40000, max: 60000, median: 50000, location: "Global" },
      { role: "Senior Developer", min: 70000, max: 120000, median: 95000, location: "Global" },
      { role: "Team Lead", min: 90000, max: 140000, median: 115000, location: "Global" },
      { role: "Principal Engineer", min: 120000, max: 180000, median: 150000, location: "Global" },
      { role: "Engineering Manager", min: 130000, max: 200000, median: 165000, location: "Global" }
    ],
    growthRate: 8.5,
    demandLevel: "High",
    topSkills: ["JavaScript", "Python", "React", "Node.js", "Cloud Computing"],
    marketOutlook: "Positive",
    keyTrends: [
      "Remote work adoption",
      "AI and automation integration", 
      "Cloud-first development",
      "Security-focused development",
      "Sustainable technology practices"
    ],
    recommendedSkills: ["TypeScript", "Docker", "Kubernetes", "AWS", "Machine Learning", "Cybersecurity"]
  };
}

export async function getIndustryInsights() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");
    if (!user.industry) {
      // Return default insights if user hasn't set industry
      return generateFallbackInsights("Technology");
    }

    // FIXED: Look up industry insights by industry name, not user relation
    let industryInsight = await db.industryInsight.findUnique({
      where: {
        industry: user.industry,
      },
    });

    // If no insights exist for this industry, create them
    if (!industryInsight) {
      console.log(`Creating new insights for industry: ${user.industry}`);
      
      const insights = await generateAIInsights(user.industry);

      industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      console.log(`✅ Created insights for industry: ${user.industry}`);
    }

    return industryInsight;
    
  } catch (error) {
    console.error("Error getting industry insights:", error);
    
    // Return fallback insights on any error
    return {
      ...generateFallbackInsights("Technology"),
      lastUpdated: new Date(),
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      industry: "Technology"
    };
  }
}