'use server';

import { db } from '../lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function getAuthenticatedUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Not authenticated');
    }

    let user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      console.log('User not found in database, checking with Clerk...');
      
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        throw new Error('User not found in Clerk');
      }

      // Use upsert instead of create to handle existing users
      user = await db.user.upsert({
        where: { clerkUserId: userId },
        update: {
          // Update existing user if needed
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'User',
          imageUrl: clerkUser.imageUrl || null,
        },
        create: {
          clerkUserId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'User',
          imageUrl: clerkUser.imageUrl || null,
        }
      });

      console.log('Created/updated user in database:', user.id);
    }

    return user;

  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error);
    throw error;
  }
}

// Simple job query parsing without AI complexity
function parseJobQuery(query) {
  const words = query.toLowerCase().split(/\s+/);
  
  return {
    jobTitle: extractJobTitleFallback(query),
    location: extractLocationFallback(query),
    skills: extractSkillsFallback(query),
    jobType: extractJobTypeFallback(query),
    experienceLevel: extractExperienceFallback(query),
    originalQuery: query
  };
}

function extractJobTitleFallback(query) {
  const query_lower = query.toLowerCase();
  
  const titleMappings = {
    'fullstack': 'Full Stack Developer',
    'full stack': 'Full Stack Developer',
    'frontend': 'Frontend Developer',
    'backend': 'Backend Developer',
    'react': 'React Developer',
    'angular': 'Angular Developer',
    'node': 'Node.js Developer',
    'python': 'Python Developer',
    'java': 'Java Developer',
    'javascript': 'JavaScript Developer',
    'data scientist': 'Data Scientist',
    'devops': 'DevOps Engineer',
    'software engineer': 'Software Engineer',
    'web developer': 'Web Developer'
  };
  
  for (const [key, value] of Object.entries(titleMappings)) {
    if (query_lower.includes(key)) {
      return value;
    }
  }
  
  return 'Software Developer';
}

function extractLocationFallback(query) {
  const query_lower = query.toLowerCase();
  
  const locationMappings = {
    'india': 'India',
    'bangalore': 'Bangalore, India',
    'mumbai': 'Mumbai, India',
    'delhi': 'Delhi, India',
    'remote': 'Remote',
    'usa': 'United States',
    'uk': 'United Kingdom'
  };
  
  for (const [key, value] of Object.entries(locationMappings)) {
    if (query_lower.includes(key)) {
      return value;
    }
  }
  
  return '';
}

function extractSkillsFallback(query) {
  const query_lower = query.toLowerCase();
  const allSkills = [
    'react', 'angular', 'vue', 'javascript', 'typescript', 'node.js',
    'python', 'java', 'html', 'css', 'mongodb', 'postgresql', 'aws'
  ];
  
  return allSkills.filter(skill => 
    query_lower.includes(skill.toLowerCase())
  ).slice(0, 6);
}

function extractJobTypeFallback(query) {
  const query_lower = query.toLowerCase();
  
  if (query_lower.includes('full time')) return 'Full-time';
  if (query_lower.includes('part time')) return 'Part-time';
  if (query_lower.includes('contract')) return 'Contract';
  if (query_lower.includes('remote')) return 'Remote';
  if (query_lower.includes('internship')) return 'Internship';
  
  return 'Full-time';
}

function extractExperienceFallback(query) {
  const query_lower = query.toLowerCase();
  
  if (query_lower.includes('senior')) return 'Senior';
  if (query_lower.includes('junior')) return 'Junior';
  if (query_lower.includes('entry')) return 'Entry';
  
  return 'Mid-level';
}

// MAIN FUNCTION: Create job search session and start scraping
export async function createJobSearchSessionAndRedirect(searchQuery) {
  try {
    const user = await getAuthenticatedUser();
    
    console.log('🚀 Creating job search session for:', searchQuery);

    const parsedQuery = parseJobQuery(searchQuery);
    console.log('📋 Parsed query:', parsedQuery);

    const session = await db.jobSearchSession.create({
      data: {
        userId: user.id,
        searchQuery,
        sessionName: `${parsedQuery.jobTitle || 'Job Search'} - ${new Date().toLocaleDateString()}`,
        jobTitle: parsedQuery.jobTitle || 'Software Developer',
        location: parsedQuery.location || '',
        experience: parsedQuery.experienceLevel || 'Mid-level',
        skills: parsedQuery.skills || [],
        isActive: true
      }
    });

    console.log(`✅ Session created with ID: ${session.id}`);

    // Start job scraping in background
    scrapeJobsInBackground(session.id, searchQuery, parsedQuery).catch(error => {
      console.error('Background job scraping failed:', error);
    });

    // Redirect to session page
    redirect(`/job-automation/session/${session.id}`);

  } catch (error) {
    console.error('Error creating job search session:', error);
    
    if (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    redirect('/job-automation?error=session-creation-failed');
  }
}

// Background job scraping
async function scrapeJobsInBackground(sessionId, searchQuery, parsedQuery) {
  try {
    console.log('🕷️ Starting background job scraping for session:', sessionId);

    let scrapeData;

    try {
      const { EnhancedJobScraper } = await import('../lib/real-job-scraper');
      const scraper = new EnhancedJobScraper();
      
      console.log('🌐 Using enhanced job scraper...');
      scrapeData = await scraper.scrapeJobs(searchQuery, 50);
      
    } catch (error) {
      console.error('❌ Job scraping failed:', error.message);
      return;
    }

    if (!scrapeData.success || !scrapeData.jobs || scrapeData.jobs.length === 0) {
      console.error('❌ No jobs found');
      return;
    }

    console.log(`📊 Found ${scrapeData.jobs.length} jobs, saving to database...`);

    let successCount = 0;
    let errorCount = 0;

    for (const job of scrapeData.jobs) {
      try {
        // Simple match score calculation
        let matchScore = calculateBasicMatchScore(job, parsedQuery);

        const jobData = {
          sessionId,
          externalJobId: job.id || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: job.title || parsedQuery.jobTitle || 'Software Developer',
          company: job.company || 'Company',
          location: job.location || parsedQuery.location || 'Remote',
          salaryInfo: job.salary || 'Competitive',
          postedAt: job.posted || 'Recently',
          descriptionText: job.description || generateBasicJobDescription(job.title, job.company),
          applyUrl: job.url || '#',
          source: job.source || 'Job Board',
          remote: Boolean(job.remote),
          keySkillsMatch: Array.isArray(job.skills) ? job.skills : parsedQuery.skills || [],
          status: 'DISCOVERED',
          priority: determinePriority(matchScore),
          aiMatchScore: matchScore
        };

        await db.scrapedJob.create({ data: jobData });
        successCount++;
        
        console.log(`✅ Saved job ${successCount}: ${jobData.title} at ${jobData.company}`);

      } catch (jobError) {
        errorCount++;
        console.error(`❌ Error saving job ${errorCount}:`, jobError.message);
        continue;
      }
    }

    console.log(`\n🏆 SCRAPING COMPLETE:
      - Session ID: ${sessionId}
      - Jobs Found: ${scrapeData.jobs.length}
      - Successfully Saved: ${successCount}
      - Errors: ${errorCount}`);

  } catch (error) {
    console.error('❌ Background job scraping error:', error);
  }
}

function calculateBasicMatchScore(job, parsedQuery) {
  let score = 60; // Base score
  
  // Title match
  const jobTitle = (job.title || '').toLowerCase();
  const targetTitle = (parsedQuery.jobTitle || '').toLowerCase();
  
  if (jobTitle.includes(targetTitle.replace(' developer', '')) || 
      targetTitle.includes(jobTitle.replace(' developer', ''))) {
    score += 25;
  }
  
  // Skills match
  const jobSkills = job.skills || [];
  const requiredSkills = parsedQuery.skills || [];
  
  if (requiredSkills.length > 0) {
    const matchingSkills = jobSkills.filter(skill => 
      requiredSkills.some(required => 
        skill.toLowerCase().includes(required.toLowerCase())
      )
    );
    score += Math.min(matchingSkills.length * 5, 25);
  }
  
  // Location match
  if (parsedQuery.location && job.location) {
    const userLocation = parsedQuery.location.toLowerCase();
    const jobLocation = job.location.toLowerCase();
    if (jobLocation.includes(userLocation) || 
        (userLocation.includes('remote') && job.remote)) {
      score += 15;
    }
  }
  
  return Math.min(Math.max(score, 30), 95);
}

function determinePriority(matchScore) {
  if (matchScore >= 80) return 'HIGH';
  if (matchScore >= 65) return 'MEDIUM';
  return 'LOW';
}

function generateBasicJobDescription(title, company) {
  return `${company || 'We'} are seeking a talented ${title || 'Software Developer'} to join our team. This is an excellent opportunity to work with modern technologies and contribute to innovative projects.

Key Responsibilities:
• Develop and maintain software applications
• Collaborate with team members
• Write clean, efficient code
• Participate in code reviews

Requirements:
• Strong technical skills
• Experience with relevant technologies
• Good communication skills
• Problem-solving abilities

We offer competitive compensation and benefits.`;
}

// Get all job search sessions for current user
export async function getJobSearchSessions() {
  try {
    const user = await getAuthenticatedUser();

    const sessions = await db.jobSearchSession.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: {
            jobs: true,
            applications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      sessions
    };

  } catch (error) {
    console.error('Error getting job search sessions:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get jobs for a specific session
export async function getSessionJobs(sessionId) {
  try {
    const user = await getAuthenticatedUser();
    
    const session = await db.jobSearchSession.findFirst({
      where: { 
        id: sessionId,
        userId: user.id 
      },
      include: {
        jobs: {
          orderBy: { aiMatchScore: 'desc' },
          include: {
            applications: {
              select: {
                id: true,
                status: true,
                appliedAt: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            skills: true,
            experience: true
          }
        }
      }
    });

    if (!session) {
      return { 
        success: false, 
        error: 'Session not found' 
      };
    }

    return { 
      success: true, 
      jobs: session.jobs,
      session: session 
    };

  } catch (error) {
    console.error('Error getting session jobs:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Simple application creation (just marks as applied)
export async function createSimpleJobApplication(jobId) {
  try {
    const user = await getAuthenticatedUser();

    const job = await db.scrapedJob.findUnique({
      where: { id: jobId },
      include: { session: true }
    });

    if (!job) {
      return {
        success: false,
        error: 'Job not found'
      };
    }

    // Check if already applied
    const existingApplication = await db.jobApplication.findFirst({
      where: {
        userId: user.id,
        jobId: jobId
      }
    });

    if (existingApplication) {
      return {
        success: false,
        error: 'Already applied to this job'
      };
    }

    // Create simple application record
    const application = await db.jobApplication.create({
      data: {
        userId: user.id,
        sessionId: job.sessionId,
        jobId: jobId,
        status: 'APPLIED',
        appliedAt: new Date(),
        applicationUrl: job.applyUrl
      }
    });

    // Update job status
    await db.scrapedJob.update({
      where: { id: jobId },
      data: { status: 'APPLIED' }
    });

    return {
      success: true,
      applicationId: application.id,
      message: 'Application recorded successfully'
    };

  } catch (error) {
    console.error('Error creating application:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get all job applications for current user
export async function getJobApplications() {
  try {
    const user = await getAuthenticatedUser();

    const applications = await db.jobApplication.findMany({
      where: { userId: user.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            applyUrl: true,
            aiMatchScore: true,
            source: true,
            salaryInfo: true
          }
        },
        session: {
          select: {
            id: true,
            sessionName: true,
            jobTitle: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      applications
    };

  } catch (error) {
    console.error('Error getting job applications:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update job status
export async function updateJobStatus(jobId, status, notes = null) {
  try {
    const user = await getAuthenticatedUser();

    const job = await db.scrapedJob.findFirst({
      where: {
        id: jobId,
        session: {
          userId: user.id
        }
      }
    });

    if (!job) {
      return {
        success: false,
        error: 'Job not found'
      };
    }

    const updatedJob = await db.scrapedJob.update({
      where: { id: jobId },
      data: {
        status,
        notes,
        updatedAt: new Date()
      }
    });

    return {
      success: true,
      job: updatedJob
    };

  } catch (error) {
    console.error('Error updating job status:', error);
    return {
      success: false,
      error: error.message
    };
  }
}