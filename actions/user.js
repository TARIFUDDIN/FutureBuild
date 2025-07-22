"use server";

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";
import { revalidatePath } from "next/cache";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000,
      }
    );

    revalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    return { success: false, error: error.message };
  }
}

// RESTORED: Simple getUserOnboardingStatus that works for server components
export async function getUserOnboardingStatus() {
  try {
    console.log("🔍 getUserOnboardingStatus: Starting auth check...");
    const { userId } = await auth();
    console.log("🔍 getUserOnboardingStatus: UserId from auth:", userId ? "✅ Found" : "❌ Missing");
         
    if (!userId) {
      console.log("❌ getUserOnboardingStatus: No userId, returning auth required");
      return {
        isOnboarded: false,
        error: "Authentication required"
      };
    }

    console.log("🔍 getUserOnboardingStatus: Querying database for user...");
    
    // Simple database query without complex operations
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        industry: true,
        name: true,
        email: true
      }
    });

    console.log("🔍 getUserOnboardingStatus: User from DB:", user ? "✅ Found" : "❌ Missing");
    console.log("🔍 getUserOnboardingStatus: User industry:", user?.industry || "❌ No industry");

    if (!user) {
      console.log("❌ getUserOnboardingStatus: User not found in database");
      return {
        isOnboarded: false,
        error: "User not found"
      };
    }

    const isOnboarded = !!user.industry;
    console.log("🔍 getUserOnboardingStatus: Final result - isOnboarded:", isOnboarded);

    return {
      isOnboarded,
      user: user.industry ? user : null
    };
  } catch (error) {
    console.error("💥 getUserOnboardingStatus: Error checking onboarding status:", error);
    return {
      isOnboarded: false,
      error: "Failed to check onboarding status"
    };
  }
}