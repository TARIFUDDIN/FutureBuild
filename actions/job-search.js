"use server";

import { revalidatePath } from "next/cache";
import { db } from "../lib/prisma";
import { checkUser } from "../lib/checkUser";
export async function saveJobSearch(data) {
  try {
    console.log("saveJobSearch called with data:", data);
    
    const user = await checkUser();
    console.log("User from checkUser in saveJobSearch:", user);
    
    if (!user) {
      console.log("No authenticated user found in saveJobSearch");
      return {
        success: false,
        error: "Authentication required",
      };
    }
    
    // Log user ID to verify it exists and is correctly retrieved
    console.log("User ID for saving job search:", user.id);
    
    const { jobTitle, location, experienceLevel, salaryRange, jobType, portals } = data;
    
    if (!jobTitle || typeof jobTitle !== "string") {
      return {
        success: false,
        error: "Job title is required and must be a string",
      };
    }
    
    const savedSearch = await db.jobSearch.create({
      data: {
        userId: user.id,
        jobTitle,
        location: location || null,
        experienceLevel: experienceLevel || null,
        salaryRange: salaryRange || null,
        jobType: jobType || null,
        portals: portals || [],
      },
    });
    
    console.log("Job search saved successfully:", savedSearch.id);
    
    // Fix: Update the revalidation path to match your actual route
    revalidatePath("/job-search/saved-jobs");
    
    return {
      success: true,
      savedSearch,
    };
  } catch (error) {
    console.error("Error saving job search:", error);
    return {
      success: false,
      error: "Failed to save job search",
    };
  }
}
/**
 * Get saved job searches for the authenticated user
 */
export async function getSavedJobSearches() {
  try {
    const user = await checkUser();

    if (!user) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const savedSearches = await db.jobSearch.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      savedSearches,
    };
  } catch (error) {
    console.error("Error getting saved job searches:", error);
    return {
      success: false,
      error: "Failed to load saved searches",
    };
  }
}

/**
 * Delete a saved job search
 */
export async function deleteSavedJobSearch(searchId) {
  try {
    const user = await checkUser();

    if (!user) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Verify the search belongs to the user
    const search = await db.jobSearch.findFirst({
      where: {
        id: searchId,
        userId: user.id,
      },
    });

    if (!search) {
      return {
        success: false,
        error: "Search not found or you don't have permission to delete it",
      };
    }

    await db.jobSearch.delete({
      where: {
        id: searchId,
      },
    });

    revalidatePath("/job-search/saved");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting saved job search:", error);
    return {
      success: false,
      error: "Failed to delete saved search",
    };
  }
}

/**
 * Track when a user clicks on a job portal link
 */
export async function trackJobPortalClick(data) {
  try {
    const user = await checkUser();
    const { portalId, jobTitle, location } = data;

    if (!portalId || !jobTitle || typeof jobTitle !== "string") {
      return {
        success: false,
        error: "Portal ID and job title (string) are required",
      };
    }

    // Create analytics record
    await db.jobPortalClick.create({
      data: {
        userId: user ? user.id : null, // Allow anonymous tracking
        portalId,
        jobTitle,
        location: location || null,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error tracking job portal click:", error);
    // Don't return error to user, this is just for analytics
    return {
      success: false,
    };
  }
}