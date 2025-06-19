// lib/enhanced-ai-helpers.js
// Advanced AI features using OpenAI API

import OpenAI from 'openai';

export class EnhancedAIHelpers {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Advanced job query parsing with AI
  async parseJobQueryWithAI(query) {
    try {
      const prompt = `
Parse this job search query and extract structured information:
"${query}"

Return a JSON object with:
- jobTitle: specific job title
- location: location or "remote" if mentioned
- skills: array of technical skills mentioned
- jobType: "Full-time", "Part-time", "Contract", "Remote", "Hybrid", or "Internship"
- experienceLevel: "Entry", "Junior", "Mid-level", "Senior", or "Executive"
- industry: industry if mentioned
- salaryRange: if mentioned
- companySize: if mentioned
- benefits: any specific benefits mentioned

Example query: "Senior React developer job in San Francisco with remote options, $120k+"
Example response: {
  "jobTitle": "Senior React Developer",
  "location": "San Francisco",
  "skills": ["React", "JavaScript"],
  "jobType": "Remote",
  "experienceLevel": "Senior",
  "salaryRange": "$120,000+",
  "industry": null,
  "companySize": null,
  "benefits": []
}
`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 500
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        ...parsed,
        originalQuery: query
      };

    } catch (error) {
      console.error('AI job query parsing error:', error);
      
      // Fallback to basic parsing
      return this.fallbackJobParsing(query);
    }
  }

  // AI-powered job description analysis
  async analyzeJobDescription(jobDescription, userProfile) {
    try {
      const prompt = `
Analyze this job description and provide insights:

Job Description:
"${jobDescription}"

User Profile:
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${userProfile.experienceYears || 'Not specified'} years
- Target Role: ${userProfile.targetRole || 'Not specified'}

Provide analysis in JSON format:
{
  "matchScore": number (0-100),
  "requiredSkills": [array of skills mentioned],
  "preferredSkills": [array of preferred skills],
  "experienceRequired": "Entry/Junior/Mid/Senior/Executive",
  "redFlags": [potential concerns],
  "opportunities": [growth opportunities mentioned],
  "companyBenefits": [benefits mentioned],
  "workStyle": "Remote/Hybrid/Onsite/Flexible",
  "matchingSkills": [user skills that match],
  "missingSkills": [required skills user doesn't have],
  "recommendations": [how to improve application],
  "keywordOptimization": [keywords to include in resume/cover letter]
}
`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1000
      });

      return {
        success: true,
        analysis: JSON.parse(response.choices[0].message.content)
      };

    } catch (error) {
      console.error('Job description analysis error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // AI-powered resume tailoring
  async tailorResumeForJob(userProfile, jobDescription, companyResearch = null) {
    try {
      console.log('🎯 AI tailoring resume for job...');

      const prompt = `
Create a tailored resume for this job application:

Job Description:
"${jobDescription}"

Company Research:
${companyResearch?.summary || 'No additional research available'}

User Profile:
- Name: ${userProfile.name}
- Email: ${userProfile.email}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${JSON.stringify(userProfile.experience || [])}
- Education: ${JSON.stringify(userProfile.education || [])}
- Target Role: ${userProfile.targetRole || 'Software Developer'}

Generate an optimized resume in JSON format:
{
  "summary": "tailored professional summary (2-3 sentences)",
  "keySkills": [reordered skills based on job requirements],
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "time period",
      "achievements": [tailored achievement bullets highlighting relevant experience],
      "technologies": [relevant tech stack]
    }
  ],
  "education": [education entries],
  "projects": [relevant projects if any],
  "tailoredElements": {
    "keywordsAdded": [job-specific keywords included],
    "skillsReordered": [skills reordered by relevance],
    "achievementsHighlighted": [specific achievements emphasized]
  }
}

Focus on:
1. Matching job requirements
2. Using similar language/keywords from job description
3. Highlighting most relevant experience first
4. Quantifying achievements where possible
`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500
      });

      const tailoredResume = JSON.parse(response.choices[0].message.content);

      return {
        success: true,
        tailoredResume,
        optimizationScore: this.calculateOptimizationScore(tailoredResume, jobDescription)
      };

    } catch (error) {
      console.error('AI resume tailoring error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // AI-powered personalized email generation
  async generatePersonalizedEmail(job, userProfile, companyResearch = null, contactInfo = null) {
    try {
      console.log('✉️ AI generating personalized email...');

      const prompt = `
Write a personalized job application email:

Job Details:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
- Description: ${job.description?.substring(0, 500) || 'Not available'}

User Profile:
- Name: ${userProfile.name}
- Current Role: ${userProfile.currentRole || userProfile.targetRole}
- Key Skills: ${userProfile.skills?.slice(0, 5).join(', ') || 'Not specified'}
- Experience: ${userProfile.experienceYears || 'Several'} years
- Location: ${userProfile.location || 'Not specified'}

Company Research:
${companyResearch?.summary || 'No additional research available'}

Contact Information:
${contactInfo ? `Hiring Manager: ${contactInfo.name} (${contactInfo.title})` : 'Hiring Manager'}

Generate a professional email in JSON format:
{
  "subject": "compelling subject line with job title and name",
  "greeting": "personalized greeting",
  "opening": "engaging opening paragraph showing genuine interest",
  "body": "2-3 paragraphs highlighting relevant experience and value proposition",
  "companyConnection": "specific mention of why you're interested in THIS company",
  "callToAction": "professional closing with next steps",
  "signature": "professional signature",
  "tone": "Professional/Casual/Technical",
  "personalizedElements": [list of personalization used],
  "keyPoints": [main selling points highlighted]
}

Requirements:
1. Reference specific company details if available
2. Match tone to company culture (startup=casual, enterprise=formal)
3. Highlight 2-3 most relevant skills/experiences
4. Show genuine interest in the company
5. Keep professional but engaging
6. Include subtle value proposition
7. Use the contact's name if available
`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 1200
      });

      const emailContent = JSON.parse(response.choices[0].message.content);

      // Combine into full email
      const fullEmail = `${emailContent.greeting}

${emailContent.opening}

${emailContent.body}

${emailContent.companyConnection}

${emailContent.callToAction}

${emailContent.signature}`;

      return {
        success: true,
        subject: emailContent.subject,
        body: fullEmail,
        tone: emailContent.tone,
        personalizedElements: emailContent.personalizedElements,
        keyPoints: emailContent.keyPoints,
        optimization: {
          personalizedForCompany: !!companyResearch,
          personalizedForContact: !!contactInfo,
          skillsHighlighted: emailContent.keyPoints?.length || 0
        }
      };

    } catch (error) {
      console.error('AI email generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // AI-powered company culture analysis
  async analyzeCompanyCulture(companyResearch, jobDescription) {
    try {
      const prompt = `
Analyze the company culture and work environment:

Company Information:
${companyResearch?.summary || 'Limited information available'}

Job Description:
${jobDescription?.substring(0, 1000) || 'Not available'}

Provide culture analysis in JSON format:
{
  "cultureType": "Startup/Corporate/Tech/Creative/Traditional/Remote-first",
  "communicationStyle": "Formal/Casual/Technical/Collaborative",
  "workEnvironment": "Fast-paced/Structured/Flexible/Results-driven",
  "values": [company values mentioned],
  "benefits": [benefits and perks],
  "redFlags": [potential concerns],
  "emailTone": "Professional/Casual/Technical",
  "applicationTips": [specific tips for applying to this company],
  "interviewPrep": [what to expect in interviews]
}
`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 600
      });

      return {
        success: true,
        culture: JSON.parse(response.choices[0].message.content)
      };

    } catch (error) {
      console.error('Company culture analysis error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // AI-powered interview preparation
  async generateInterviewPrep(job, userProfile, companyResearch = null) {
    try {
      const prompt = `
Generate interview preparation materials:

Job: ${job.title} at ${job.company}
Job Description: ${job.description?.substring(0, 800) || 'Not available'}

User Background:
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${userProfile.experienceYears || 'Several'} years

Company Research:
${companyResearch?.summary || 'No additional research available'}

Generate comprehensive interview prep in JSON format:
{
  "technicalQuestions": [likely technical questions for this role],
  "behavioralQuestions": [STAR method behavioral questions],
  "companySpecificQuestions": [questions about the company],
  "questionsToAsk": [thoughtful questions to ask the interviewer],
  "keyTopics": [important topics to study],
  "codeChallenge": {
    "possibleTopics": [coding topics that might be tested],
    "practiceProblems": [types of problems to practice]
  },
  "preparationPlan": [step-by-step prep checklist]
}
`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1200
      });

      return {
        success: true,
        interviewPrep: JSON.parse(response.choices[0].message.content)
      };

    } catch (error) {
      console.error('Interview prep generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate optimization score
  calculateOptimizationScore(tailoredResume, jobDescription) {
    try {
      const jobWords = jobDescription.toLowerCase().split(/\W+/);
      const resumeText = JSON.stringify(tailoredResume).toLowerCase();
      
      const commonSkills = ['javascript', 'python', 'react', 'node', 'aws', 'docker', 'sql'];
      let matches = 0;
      
      jobWords.forEach(word => {
        if (word.length > 3 && resumeText.includes(word)) {
          matches++;
        }
      });

      return Math.min(Math.round((matches / jobWords.length) * 100), 95);
    } catch (error) {
      return 75; // Default score
    }
  }

  // Fallback parsing if AI fails
  fallbackJobParsing(query) {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      success: true,
      jobTitle: 'Software Developer',
      location: '',
      skills: words.filter(w => ['react', 'javascript', 'python', 'java'].includes(w)),
      jobType: words.includes('remote') ? 'Remote' : 'Full-time',
      experienceLevel: words.includes('senior') ? 'Senior' : 'Mid-level',
      originalQuery: query
    };
  }
}

// Export singleton instance
export const aiHelpers = new EnhancedAIHelpers();