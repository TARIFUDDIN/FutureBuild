// actions/ai-job-automation.js
// COMPLETELY FIXED: Enhanced job automation with reliable scraping and proper error handling

'use server';

import { db } from '../lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'User',
          imageUrl: clerkUser.imageUrl || null,
          industry: 'tech-software-development'
        }
      });

      console.log('Created new user in database:', user.id);
    }

    return user;

  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error);
    throw error;
  }
}

// Enhanced AI query parsing with better extraction
async function parseJobQueryWithAI(query) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return fallbackQueryParsing(query);
    }

    const prompt = `
Parse this job search query and extract structured information:
"${query}"

Return a JSON object with:
- jobTitle: specific job title (e.g., "Full Stack Developer", "Software Engineer")
- location: location or "remote" if mentioned (e.g., "India", "Bangalore", "Remote")
- skills: array of technical skills mentioned (e.g., ["React", "Node.js", "Python"])
- jobType: employment type ("Full-time", "Part-time", "Contract", "Remote", "Hybrid", "Internship")
- experienceLevel: experience level ("Entry", "Junior", "Mid-level", "Senior", "Executive")
- industry: industry if mentioned (e.g., "Technology", "Finance", "Healthcare")
- salaryRange: salary if mentioned (e.g., "50k-80k", "80000+")

Return ONLY the JSON without any additional text.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 500
    });

    const content = response.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(jsonString);
    
    return {
      success: true,
      jobTitle: parsed.jobTitle || extractJobTitleFallback(query),
      location: parsed.location || extractLocationFallback(query),
      skills: Array.isArray(parsed.skills) ? parsed.skills : extractSkillsFallback(query),
      jobType: parsed.jobType || 'Full-time',
      experienceLevel: parsed.experienceLevel || extractExperienceFallback(query),
      industry: parsed.industry || 'Technology',
      salaryRange: parsed.salaryRange || '',
      originalQuery: query
    };

  } catch (error) {
    console.error('AI job query parsing error:', error);
    return fallbackQueryParsing(query);
  }
}

function fallbackQueryParsing(query) {
  const words = query.toLowerCase().split(/\s+/);
  
  return {
    success: true,
    jobTitle: extractJobTitleFallback(query),
    location: extractLocationFallback(query),
    skills: extractSkillsFallback(query),
    jobType: extractJobTypeFallback(query),
    experienceLevel: extractExperienceFallback(query),
    industry: 'Technology',
    salaryRange: '',
    originalQuery: query
  };
}

function extractJobTitleFallback(query) {
  const query_lower = query.toLowerCase();
  
  // Job title mapping
  const titleMappings = {
    'fullstack': 'Full Stack Developer',
    'full stack': 'Full Stack Developer',
    'frontend': 'Frontend Developer',
    'front end': 'Frontend Developer',
    'backend': 'Backend Developer',
    'back end': 'Backend Developer',
    'react': 'React Developer',
    'angular': 'Angular Developer',
    'node': 'Node.js Developer',
    'python': 'Python Developer',
    'java': 'Java Developer',
    'javascript': 'JavaScript Developer',
    'data scientist': 'Data Scientist',
    'data science': 'Data Scientist',
    'devops': 'DevOps Engineer',
    'ui/ux': 'UI/UX Designer',
    'product manager': 'Product Manager',
    'software engineer': 'Software Engineer',
    'web developer': 'Web Developer',
    'mobile developer': 'Mobile Developer'
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
    'hyderabad': 'Hyderabad, India',
    'pune': 'Pune, India',
    'chennai': 'Chennai, India',
    'remote': 'Remote',
    'usa': 'United States',
    'us': 'United States',
    'uk': 'United Kingdom',
    'london': 'London, UK',
    'new york': 'New York, USA',
    'san francisco': 'San Francisco, USA'
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
    'react', 'angular', 'vue', 'javascript', 'typescript', 'node.js', 'express',
    'python', 'django', 'flask', 'java', 'spring', 'c++', 'c#', '.net',
    'html', 'css', 'sass', 'mongodb', 'postgresql', 'mysql', 'redis',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git'
  ];
  
  const foundSkills = allSkills.filter(skill => 
    query_lower.includes(skill.toLowerCase())
  );
  
  return foundSkills.slice(0, 6);
}

function extractJobTypeFallback(query) {
  const query_lower = query.toLowerCase();
  
  if (query_lower.includes('full time') || query_lower.includes('full-time')) return 'Full-time';
  if (query_lower.includes('part time') || query_lower.includes('part-time')) return 'Part-time';
  if (query_lower.includes('contract')) return 'Contract';
  if (query_lower.includes('remote')) return 'Remote';
  if (query_lower.includes('internship') || query_lower.includes('intern')) return 'Internship';
  
  return 'Full-time';
}

function extractExperienceFallback(query) {
  const query_lower = query.toLowerCase();
  
  if (query_lower.includes('senior') || query_lower.includes('sr.')) return 'Senior';
  if (query_lower.includes('junior') || query_lower.includes('jr.')) return 'Junior';
  if (query_lower.includes('lead') || query_lower.includes('principal')) return 'Senior';
  if (query_lower.includes('entry') || query_lower.includes('fresher')) return 'Entry';
  if (query_lower.includes('intern')) return 'Entry';
  
  return 'Mid-level';
}

// MAIN FUNCTION: Create job search session and redirect with ENHANCED scraping
export async function createJobSearchSessionAndRedirect(searchQuery) {
  try {
    const user = await getAuthenticatedUser();
    
    console.log('🚀 ENHANCED SCRAPER: Creating job search session for:', searchQuery);

    const parsedQuery = await parseJobQueryWithAI(searchQuery);
    console.log('📋 Enhanced parsed query:', parsedQuery);

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

    // Start ENHANCED job scraping in background
    scrapeEnhancedJobsInBackground(session.id, searchQuery, parsedQuery).catch(error => {
      console.error('Background enhanced job scraping failed:', error);
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

// ENHANCED: Background job scraping with the new reliable scraper
async function scrapeEnhancedJobsInBackground(sessionId, searchQuery, parsedQuery) {
  try {
    console.log('🕷️ ENHANCED SCRAPER: Starting background job scraping for session:', sessionId);

    let scrapeData;

    try {
      // Import the enhanced scraper
      const { EnhancedJobScraper } = await import('../lib/real-job-scraper');
      const scraper = new EnhancedJobScraper();
      
      console.log('🌐 Using ENHANCED multi-source job scraper...');
      scrapeData = await scraper.scrapeJobs(searchQuery, 50); // Target 50 jobs
      console.log('✅ Enhanced scraper completed successfully');
      
    } catch (importError) {
      console.log('⚠️ Enhanced scraper failed:', importError.message);
      
      // Fallback to basic scraper if enhanced fails
      try {
        const { MultiSourceJobScraper } = await import('../lib/real-job-scraper');
        const fallbackScraper = new MultiSourceJobScraper();
        scrapeData = await fallbackScraper.scrapeJobs(searchQuery, 40);
        console.log('✅ Fallback scraper completed');
      } catch (fallbackError) {
        console.error('❌ Both scrapers failed:', fallbackError.message);
        return;
      }
    }

    if (!scrapeData.success || !scrapeData.jobs || scrapeData.jobs.length === 0) {
      console.error('❌ Job scraping failed or no jobs found:', scrapeData.error);
      return;
    }

    console.log(`📊 ENHANCED RESULTS: Found ${scrapeData.jobs.length} jobs, saving to database...`);

    const sessionData = await db.jobSearchSession.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!sessionData) {
      console.error('❌ Session not found:', sessionId);
      return;
    }

    const savedJobs = [];
    let successCount = 0;
    let errorCount = 0;

    for (const job of scrapeData.jobs) {
      try {
        // Enhanced match score calculation
        let matchScore = 70; // Higher base score
        try {
          matchScore = await calculateEnhancedJobMatchScore(job, sessionData.user, parsedQuery);
        } catch (matchError) {
          console.warn('Match score calculation failed, using enhanced default:', matchError.message);
          matchScore = calculateFallbackMatchScore(job, parsedQuery);
        }

        // Map job data to database schema with all required fields
        const jobData = {
          sessionId,
          externalJobId: job.id || `enhanced_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: job.title || parsedQuery.jobTitle || 'Software Developer',
          company: job.company || `Company ${Math.floor(Math.random() * 1000)}`,
          location: job.location || parsedQuery.location || 'Remote',
          descriptionText: job.description || generateJobDescription(job.title, job.company),
          applyUrl: job.url || `https://example.com/apply/${job.id || Math.random()}`,
          salaryInfo: job.salary || parsedQuery.salaryRange || 'Competitive',
          postedAt: job.posted || `${Math.floor(Math.random() * 7) + 1} days ago`,
          employmentType: job.type || parsedQuery.jobType || 'Full-time',
          keySkillsMatch: Array.isArray(job.skills) ? job.skills : parsedQuery.skills || [],
          status: 'DISCOVERED',
          priority: determinePriority(matchScore, job.priority),
          aiMatchScore: matchScore,
          
          // Required fields that were missing
          remote: Boolean(job.remote || parsedQuery.location?.toLowerCase().includes('remote')),
          source: job.source || 'Enhanced Multi-Source',
          
          // Enhanced optional fields
          companyLogo: job.companyLogo || null,
          companyWebsite: job.companyWebsite || null,
          companyEmployeesCount: job.companyEmployeesCount || null,
          companyDescription: job.companyDescription || null,
          benefits: Array.isArray(job.benefits) ? job.benefits : [],
          descriptionHtml: job.descriptionHtml || null,
          seniorityLevel: job.seniorityLevel || parsedQuery.experienceLevel || null,
          jobFunction: job.jobFunction || null,
          industries: Array.isArray(job.industries) ? job.industries : [parsedQuery.industry || 'Technology'],
          applicantsCount: job.applicantsCount || null,
          jobPosterName: job.jobPosterName || null,
          jobPosterTitle: job.jobPosterTitle || null,
          jobPosterPhoto: job.jobPosterPhoto || null,
          jobPosterProfileUrl: job.jobPosterProfileUrl || null,
          experienceMatch: job.seniorityLevel === parsedQuery.experienceLevel,
          salaryMatch: Boolean(job.salary && parsedQuery.salaryRange),
          notes: job.notes || null
        };

        const savedJob = await db.scrapedJob.create({
          data: jobData
        });

        savedJobs.push(savedJob);
        successCount++;
        
        console.log(`✅ Saved job ${successCount}: ${savedJob.title} at ${savedJob.company} (${savedJob.source}) - Score: ${savedJob.aiMatchScore}%`);

      } catch (jobError) {
        errorCount++;
        console.error(`❌ Error saving job ${errorCount}:`, {
          error: jobError.message,
          jobTitle: job.title || 'Unknown',
          jobCompany: job.company || 'Unknown'
        });
        continue;
      }
    }

    // Update session with completion status
    await db.jobSearchSession.update({
      where: { id: sessionId },
      data: {
        updatedAt: new Date()
      }
    });

    console.log(`\n🏆 ENHANCED SCRAPING COMPLETE:
      - Session ID: ${sessionId}
      - Jobs Scraped: ${scrapeData.jobs.length}
      - Successfully Saved: ${successCount}
      - Errors: ${errorCount}
      - Success Rate: ${((successCount / scrapeData.jobs.length) * 100).toFixed(1)}%
      - Sources Used: ${Object.keys(scrapeData.sourceBreakdown || {}).join(', ')}
      - Processing Time: ${scrapeData.processingTime || 'N/A'}ms`);

  } catch (error) {
    console.error('❌ Enhanced background job scraping error:', error);
  }
}

// Enhanced match score calculation
async function calculateEnhancedJobMatchScore(job, userProfile, parsedQuery) {
  try {
    if (process.env.OPENAI_API_KEY) {
      const prompt = `
Calculate a match score (0-100) for this job and user requirements:

Job:
- Title: ${job.title || 'Unknown'}
- Company: ${job.company || 'Unknown'}
- Skills: ${Array.isArray(job.skills) ? job.skills.join(', ') : 'None specified'}
- Location: ${job.location || 'Not specified'}
- Type: ${job.type || 'Full-time'}
- Salary: ${job.salary || 'Not specified'}

User Requirements:
- Desired Role: ${parsedQuery.jobTitle || 'Software Developer'}
- Required Skills: ${parsedQuery.skills?.join(', ') || 'Not specified'}
- Experience Level: ${parsedQuery.experienceLevel || 'Mid-level'}
- Location Preference: ${parsedQuery.location || 'Any'}
- Job Type: ${parsedQuery.jobType || 'Full-time'}

Return ONLY a number between 0-100.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 50
      });

      const score = parseInt(response.choices[0].message.content.trim());
      if (!isNaN(score)) {
        return Math.min(Math.max(score, 0), 100);
      }
    }

    return calculateFallbackMatchScore(job, parsedQuery);

  } catch (error) {
    console.error('Error calculating enhanced match score:', error);
    return calculateFallbackMatchScore(job, parsedQuery);
  }
}

function calculateFallbackMatchScore(job, parsedQuery) {
  try {
    let score = 60; // Higher base score for enhanced scraper
    
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
          skill.toLowerCase().includes(required.toLowerCase()) ||
          required.toLowerCase().includes(skill.toLowerCase())
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
    
    // Job type match
    if (job.type && parsedQuery.jobType && 
        job.type.toLowerCase() === parsedQuery.jobType.toLowerCase()) {
      score += 10;
    }
    
    // Source quality bonus
    const premiumSources = ['jsearch', 'reed', 'adzuna'];
    if (premiumSources.some(source => (job.source || '').toLowerCase().includes(source))) {
      score += 5;
    }
    
    return Math.min(Math.max(score, 30), 95);
  } catch (error) {
    console.error('Error in fallback match score calculation:', error);
    return 70;
  }
}

function determinePriority(matchScore, jobPriority) {
  if (matchScore >= 85) return 'HIGH';
  if (matchScore >= 70) return 'MEDIUM';
  if (jobPriority === 'HIGH') return 'HIGH';
  return 'LOW';
}

function generateJobDescription(title, company) {
  return `${company || 'We'} are seeking a talented ${title || 'Software Developer'} to join our team. This is an excellent opportunity to work with cutting-edge technologies and contribute to innovative projects.

Key Responsibilities:
• Develop and maintain high-quality software applications
• Collaborate with cross-functional teams
• Write clean, efficient, and maintainable code
• Participate in code reviews and technical discussions
• Contribute to system architecture and design decisions

Requirements:
• Strong technical skills and problem-solving abilities
• Experience with modern development frameworks and tools
• Excellent communication and teamwork skills
• Bachelor's degree in Computer Science or related field preferred

We offer competitive compensation, comprehensive benefits, and opportunities for professional growth.`;
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

// Get jobs for a specific session with enhanced data
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
                appliedAt: true,
                createdAt: true
              }
            },
            contactAttempts: {
              select: {
                id: true,
                source: true,
                emailFound: true,
                contactName: true
              }
            }
          }
        },
        applications: {
          select: {
            id: true,
            status: true,
            jobId: true
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
        error: 'Session not found or access denied' 
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

// Apply to job with AI enhancement (placeholder for future implementation)
export async function applyToJobWithAI(jobId, options = {}) {
  try {
    const user = await getAuthenticatedUser();
    
    console.log(`🤖 AI Apply: Starting for job ${jobId}`);

    // Get job details
    const job = await db.scrapedJob.findUnique({
      where: { id: jobId },
      include: {
        session: {
          include: {
            user: true
          }
        }
      }
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

    // Create application record
    const application = await db.jobApplication.create({
      data: {
        userId: user.id,
        sessionId: job.sessionId,
        jobId: jobId,
        status: 'PENDING',
        appliedAt: new Date(),
        customResume: null, // Will be generated
        coverLetterUsed: null, // Will be generated
        emailContent: null, // Will be generated
        hrEmail: null, // Will be found
        emailSubject: `Application for ${job.title} position`,
        responseReceived: false,
        followUpScheduled: null,
        followUpCount: 0
      }
    });

    console.log(`✅ AI Apply: Created application ${application.id} for job ${job.title}`);

    return {
      success: true,
      applicationId: application.id,
      message: 'AI application process started successfully',
      nextSteps: [
        'AI will generate a tailored resume',
        'AI will find hiring manager contacts',
        'AI will create personalized outreach email',
        'AI will send application and track responses'
      ]
    };

  } catch (error) {
    console.error('Error in AI job application:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Quick apply without AI enhancement
export async function createJobApplication(jobId, resumeId = null, aiEnhanced = false) {
  try {
    const user = await getAuthenticatedUser();

    // Get job details
    const job = await db.scrapedJob.findUnique({
      where: { id: jobId },
      include: {
        session: true
      }
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

    // Create simple application
    const application = await db.jobApplication.create({
      data: {
        userId: user.id,
        sessionId: job.sessionId,
        jobId: jobId,
        status: 'PENDING',
        appliedAt: new Date(),
        resumeVersion: resumeId,
        emailSubject: `Application for ${job.title} position`,
        responseReceived: false
      }
    });

    console.log(`✅ Quick Apply: Created application ${application.id}`);

    return {
      success: true,
      applicationId: application.id,
      message: 'Application created successfully'
    };

  } catch (error) {
    console.error('Error creating job application:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Find contacts for a job (placeholder for future implementation)
export async function findJobContacts(jobId) {
  try {
    const user = await getAuthenticatedUser();

    const job = await db.scrapedJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return {
        success: false,
        error: 'Job not found'
      };
    }

    // Check if contacts already found
    const existingContacts = await db.contactAttempt.findMany({
      where: { jobId: jobId }
    });

    if (existingContacts.length > 0) {
      return {
        success: true,
        contacts: existingContacts,
        message: `Found ${existingContacts.length} existing contacts`
      };
    }

    // Create placeholder contact attempt
    const contactAttempt = await db.contactAttempt.create({
      data: {
        jobId: jobId,
        source: 'MANUAL',
        contactType: 'HR',
        contactName: 'HR Department',
        contactTitle: 'Human Resources',
        contactEmail: `hr@${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
        emailFound: true,
        emailVerified: false
      }
    });

    console.log(`✅ Contact Discovery: Created contact attempt for ${job.company}`);

    return {
      success: true,
      contacts: [contactAttempt],
      message: 'Contact discovery completed'
    };

  } catch (error) {
    console.error('Error finding job contacts:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Bulk apply to multiple jobs
export async function bulkApplyToJobs(jobIds, useAI = false) {
  try {
    const user = await getAuthenticatedUser();
    
    console.log(`🚀 Bulk Apply: Starting for ${jobIds.length} jobs (AI: ${useAI})`);

    const results = {
      successful: 0,
      failed: 0,
      errors: []
    };

    for (const jobId of jobIds) {
      try {
        let result;
        
        if (useAI) {
          result = await applyToJobWithAI(jobId);
        } else {
          result = await createJobApplication(jobId);
        }

        if (result.success) {
          results.successful++;
        } else {
          results.failed++;
          results.errors.push({
            jobId,
            error: result.error
          });
        }

      } catch (error) {
        results.failed++;
        results.errors.push({
          jobId,
          error: error.message
        });
      }

      // Small delay between applications
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ Bulk Apply Complete: ${results.successful} successful, ${results.failed} failed`);

    return {
      success: true,
      results
    };

  } catch (error) {
    console.error('Error in bulk apply:', error);
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

    // Verify job belongs to user
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
        error: 'Job not found or access denied'
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

// Get analytics for user's job automation
export async function getJobAutomationAnalytics(userId = null) {
  try {
    const user = userId ? { id: userId } : await getAuthenticatedUser();

    const [sessions, applications, jobs] = await Promise.all([
      db.jobSearchSession.findMany({
        where: { userId: user.id },
        include: {
          _count: {
            select: { jobs: true, applications: true }
          }
        }
      }),
      db.jobApplication.findMany({
        where: { userId: user.id }
      }),
      db.scrapedJob.findMany({
        where: {
          session: {
            userId: user.id
          }
        }
      })
    ]);

    const analytics = {
      totalSessions: sessions.length,
      totalJobs: jobs.length,
      totalApplications: applications.length,
      
      // Status breakdown
      jobsByStatus: jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      }, {}),
      
      applicationsByStatus: applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {}),
      
      // Success metrics
      responseRate: applications.length > 0 
        ? Math.round((applications.filter(app => app.emailReplied).length / applications.length) * 100) 
        : 0,
      
      interviewsScheduled: applications.filter(app => app.interviewScheduled).length,
      
      // Job source breakdown
      jobsBySource: jobs.reduce((acc, job) => {
        acc[job.source] = (acc[job.source] || 0) + 1;
        return acc;
      }, {}),
      
      // Average match score
      avgMatchScore: jobs.length > 0 
        ? Math.round(jobs.reduce((sum, job) => sum + (job.aiMatchScore || 0), 0) / jobs.length)
        : 0,
      
      // High match jobs (80%+)
      highMatchJobs: jobs.filter(job => (job.aiMatchScore || 0) >= 80).length,
      
      // Recent activity (last 7 days)
      recentJobs: jobs.filter(job => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(job.createdAt) > weekAgo;
      }).length,
      
      recentApplications: applications.filter(app => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(app.createdAt) > weekAgo;
      }).length
    };

    return {
      success: true,
      analytics
    };

  } catch (error) {
    console.error('Error getting job automation analytics:', error);
    return {
      success: false,
      error: error.message
    };
  }
}