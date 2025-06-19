// app/api/job-automation/scrape/route.js
import { NextResponse } from 'next/server';
import { ApifyLinkedInScraper } from '../../../../lib/real-job-scraper';

export async function POST(request) {
  try {
    const { searchQuery, maxResults = 50 } = await request.json();

    if (!searchQuery) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Starting LinkedIn job scrape for: ${searchQuery}`);

    const scraper = new ApifyLinkedInScraper();
    const result = await scraper.scrapeJobs(searchQuery, maxResults);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Scraping failed' },
        { status: 500 }
      );
    }

    console.log(`✅ Scraping completed: ${result.jobs.length} jobs found`);

    return NextResponse.json({
      success: true,
      jobs: result.jobs,
      totalFound: result.totalFound,
      metadata: {
        searchQuery,
        maxResults,
        scrapedAt: new Date().toISOString(),
        source: result.source || 'LinkedIn',
        actorUsed: result.actorUsed
      }
    });

  } catch (error) {
    console.error('LinkedIn scraping API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}