// middleware.js
// SIMPLIFIED: Removed complex database checks that cause deployment issues

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
   
  // Redirect unauthenticated users to sign-in
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn({
      returnBackUrl: req.url,
    });
  }

  // Let authenticated users through
  // Onboarding checks are now handled client-side to avoid deployment issues
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};