"use server";

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateRoadmapPrompt } from "../lib/roadmap-prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  // Use the prompt generator from your library
  const prompt = generateRoadmapPrompt(
    skillPath,
    user.industry || "tech",
    experienceLevel
  );

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const mermaidCode = response.text().trim();

    // Save the roadmap to the database
    await saveRoadmap(userId, skillPath, mermaidCode);

    return mermaidCode;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate roadmap");
  }
}

async function saveRoadmap(clerkUserId, skillPath, mermaidCode) {
  const user = await db.user.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  try {
    await db.roadmap.create({
      data: {
        userId: user.id,
        skillPath,
        mermaidCode,
      },
    });
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