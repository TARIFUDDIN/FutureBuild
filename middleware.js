// middleware.js
// FIXED: Prevents onboarding redirect loop and uses direct DB check

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "./lib/prisma";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
  "/resume-analyzer(.*)",
  "/job-search(.*)",
  "/portfolio-builder(.*)",
  "/job-automation(.*)",
]);

const requiresOnboarding = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/resume-analyzer(.*)",
  "/job-search(.*)",
  "/portfolio-builder(.*)",
  "/job-automation(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn({
      returnBackUrl: req.url,
    });
  }

  // For authenticated users on routes requiring onboarding
  if (userId && requiresOnboarding(req)) {
    try {
      // FIXED: Direct database check instead of using checkUser()
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: { industry: true, id: true }
      });

      // If user doesn't exist OR doesn't have industry, redirect to onboarding
      // BUT NOT if they're already on onboarding page (prevents loop)
      if ((!user || !user.industry) && !req.nextUrl.pathname.startsWith('/onboarding')) {
        console.log('🔄 Redirecting to onboarding - User needs to complete setup');
        const onboardingUrl = new URL('/onboarding', req.url);
        onboardingUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(onboardingUrl);
      }
      
      // If user exists and has industry, they're good to go
      if (user && user.industry) {
        console.log('✅ User has completed onboarding, proceeding...');
      }
      
    } catch (error) {
      console.error('Error checking user status in middleware:', error);
      // On database error, allow the request to proceed to avoid blocking users
      return NextResponse.next();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};