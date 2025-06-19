// app/api/job-automation/generate-resume/route.js
import { NextResponse } from 'next/server';
import { ResumeGenerator } from '../../../../lib/real-job-scraper';

export async function POST(request) {
  try {
    const { userProfile, jobDetails } = await request.json();

    if (!userProfile || !jobDetails) {
      return NextResponse.json(
        { success: false, error: 'User profile and job details are required' },
        { status: 400 }
      );
    }

    const generator = new ResumeGenerator();
    const result = await generator.generateResume(userProfile, jobDetails);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Resume generation API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}