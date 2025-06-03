import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkUser } from "./lib/checkUser";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
  "/resume-analyzer(.*)",
  "/job-search(.*)",
  "/portfolio-builder(.*)",
]);

const requiresOnboarding = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/resume-analyzer(.*)",
  "/job-search(.*)",
  "/portfolio-builder(.*)",
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
      const user = await checkUser();
      
      // Check if user has completed onboarding (has industry set)
      if (!user?.industry && req.nextUrl.pathname !== '/onboarding') {
        const onboardingUrl = new URL('/onboarding', req.url);
        onboardingUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      // On error, allow the request to proceed
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