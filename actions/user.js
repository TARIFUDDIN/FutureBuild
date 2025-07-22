"use server";

import { db } from "../lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";
import { revalidatePath } from "next/cache";

export async function updateUser(data) {
  try {
    console.log("🔄 Starting updateUser with data:", data);
    
    const { userId } = await auth();
    if (!userId) {
      console.error("❌ updateUser: No userId found");
      throw new Error("Unauthorized");
    }

    console.log("✅ updateUser: User authenticated:", userId);

    // Find or create user in database
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      console.log("👤 updateUser: User not found, creating...");
      
      // Get user info from Clerk
      const clerkUser = await currentUser();
      if (!clerkUser) {
        throw new Error("User not found in Clerk");
      }

      // Create user in database
      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'User',
          imageUrl: clerkUser.imageUrl || null,
        }
      });

      console.log("✅ updateUser: Created new user in database");
    }

    console.log("🔄 updateUser: Starting transaction...");

    const result = await db.$transaction(
      async (tx) => {
        // Handle industry insights
        let industryInsight = null;
        
        if (data.industry) {
          industryInsight = await tx.industryInsight.findUnique({
            where: {
              industry: data.industry,
            },
          });

          if (!industryInsight) {
            console.log("🧠 updateUser: Creating AI insights for industry:", data.industry);
            
            try {
              const insights = await generateAIInsights(data.industry);

              industryInsight = await tx.industryInsight.create({
                data: {
                  industry: data.industry,
                  ...insights,
                  nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
              });

              console.log("✅ updateUser: Created industry insights");
            } catch (insightsError) {
              console.error("⚠️ updateUser: Failed to create insights, but continuing:", insightsError);
            }
          }
        }

        // Update user with new data
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: parseInt(data.experience) || null,
            bio: data.bio,
            skills: Array.isArray(data.skills) ? data.skills : data.skills?.split(',').map(s => s.trim()) || [],
          },
        });

        console.log("✅ updateUser: Updated user profile");

        return { updatedUser, industryInsight };
      },
      {
        timeout: 15000, // Increased timeout
      }
    );

    console.log("✅ updateUser: Transaction completed successfully");

    revalidatePath("/");
    return { success: true, data: result };
    
  } catch (error) {
    console.error("💥 updateUser: Error updating user and industry:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update profile" 
    };
  }
}

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