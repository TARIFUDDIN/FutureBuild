// app/api/job-automation/send-email/route.js
import { NextResponse } from 'next/server';
import { EmailSender } from '../../../../lib/real-job-scraper';
import { generateEmailContent } from '../../../../lib/email-templates';

export async function POST(request) {
  try {
    const { 
      to, 
      job, 
      userProfile, 
      research = null, 
      templateType = null 
    } = await request.json();

    if (!to || !job || !userProfile) {
      return NextResponse.json(
        { success: false, error: 'Email recipient, job details, and user profile are required' },
        { status: 400 }
      );
    }

    // Generate email content
    const emailContent = generateEmailContent(job, userProfile, research, templateType);
    
    // Send email
    const emailSender = new EmailSender();
    const result = await emailSender.sendEmail(
      to,
      emailContent.subject,
      emailContent.body,
      userProfile.email
    );

    return NextResponse.json({
      ...result,
      emailContent,
      templateUsed: emailContent.templateUsed
    });

  } catch (error) {
    console.error('Send email API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const emailSender = new EmailSender();
    const result = await emailSender.trackEmailOpened(messageId);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Email tracking API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}