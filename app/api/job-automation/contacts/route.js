// app/api/job-automation/contacts/route.js
import { NextResponse } from 'next/server';
import { ApolloContactFinder } from '../../../../lib/real-job-scraper';

export async function POST(request) {
  try {
    const { companyName, jobTitle = 'recruiter' } = await request.json();

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }

    const apollo = new ApolloContactFinder();
    const result = await apollo.findContacts(companyName, jobTitle);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Contacts API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const apollo = new ApolloContactFinder();
    const result = await apollo.verifyEmail(email);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Email verification API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}