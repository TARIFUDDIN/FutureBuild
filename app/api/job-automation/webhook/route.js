// app/api/job-automation/webhook/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { type, applicationId, ...payload } = data;

    console.log(`📨 Webhook received: ${type} for application ${applicationId}`);

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Handle different webhook types
    switch (type) {
      case 'email_opened':
        await handleEmailOpened(applicationId, payload);
        break;
      
      case 'email_replied':
        await handleEmailReplied(applicationId, payload);
        break;
      
      case 'email_bounced':
        await handleEmailBounced(applicationId, payload);
        break;
      
      case 'interview_scheduled':
        await handleInterviewScheduled(applicationId, payload);
        break;
      
      default:
        console.log(`Unknown webhook type: ${type}`);
    }

    return NextResponse.json({ success: true, type, applicationId });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function handleEmailOpened(applicationId, payload) {
  try {
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        emailOpened: true,
        emailOpenedAt: new Date(),
        status: 'OPENED'
      }
    });
    console.log(`✅ Email opened for application ${applicationId}`);
  } catch (error) {
    console.error('Error updating email opened status:', error);
  }
}

async function handleEmailReplied(applicationId, payload) {
  try {
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        emailReplied: true,
        emailRepliedAt: new Date(),
        status: 'REPLIED',
        replyContent: payload.replyContent || null
      }
    });
    console.log(`✅ Email reply received for application ${applicationId}`);
  } catch (error) {
    console.error('Error updating email reply status:', error);
  }
}

async function handleEmailBounced(applicationId, payload) {
  try {
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status: 'FAILED',
        failureReason: `Email bounced: ${payload.reason || 'Unknown reason'}`
      }
    });
    console.log(`❌ Email bounced for application ${applicationId}`);
  } catch (error) {
    console.error('Error updating email bounce status:', error);
  }
}

async function handleInterviewScheduled(applicationId, payload) {
  try {
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        interviewScheduled: true,
        interviewScheduledAt: new Date(),
        status: 'INTERVIEW_REQUESTED',
        interviewDetails: payload.interviewDetails || null
      }
    });
    console.log(`🎉 Interview scheduled for application ${applicationId}`);
  } catch (error) {
    console.error('Error updating interview status:', error);
  }
}

// GET endpoint for webhook verification (if needed)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ status: 'Webhook endpoint active' });
}