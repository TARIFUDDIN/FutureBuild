// lib/tavily-research.js
// Free research API using Tavily for job automation

export class TavilyResearch {
  constructor() {
    this.apiKey = process.env.TAVILY_API_KEY;
    this.baseUrl = 'https://api.tavily.com';
  }

  async search(query, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          query,
          search_depth: options.depth || "basic", // "basic" or "advanced"
          include_answer: true,
          include_raw_content: false,
          max_results: options.maxResults || 5,
          include_domains: options.includeDomains || [],
          exclude_domains: options.excludeDomains || ["facebook.com", "twitter.com", "instagram.com"],
          include_images: false
        })
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        answer: data.answer,
        results: data.results,
        query: data.query,
        response_time: data.response_time
      };
    } catch (error) {
      console.error('Tavily search error:', error);
      return { 
        success: false, 
        error: error.message,
        query 
      };
    }
  }

  // Research company information
  async researchCompany(companyName) {
    try {
      console.log(`🔍 Researching company: ${companyName}`);
      
      const query = `${companyName} company information headquarters employees size revenue business model recent news 2024 2025 company culture values`;
      
      const result = await this.search(query, {
        depth: "advanced",
        maxResults: 8,
        includeDomains: ["linkedin.com", "crunchbase.com", "glassdoor.com", "indeed.com"],
        excludeDomains: ["facebook.com", "twitter.com", "instagram.com", "tiktok.com"]
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        company: companyName,
        summary: result.answer,
        details: this.extractCompanyDetails(result.answer),
        sources: result.results,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error researching company ${companyName}:`, error);
      return {
        success: false,
        error: error.message,
        company: companyName
      };
    }
  }

  // Research job market and salary information
  async researchJobMarket(jobTitle, location = "") {
    try {
      console.log(`📊 Researching job market: ${jobTitle} ${location ? `in ${location}` : ''}`);
      
      const locationQuery = location ? ` in ${location}` : "";
      const query = `${jobTitle}${locationQuery} job market salary range 2024 2025 hiring trends demand skills requirements market outlook employment statistics`;
      
      const result = await this.search(query, {
        depth: "advanced",
        maxResults: 6,
        includeDomains: ["glassdoor.com", "indeed.com", "salary.com", "payscale.com", "linkedin.com"],
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        jobTitle,
        location: location || "Global",
        marketOverview: result.answer,
        insights: this.extractJobMarketInsights(result.answer),
        sources: result.results,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error researching job market:`, error);
      return {
        success: false,
        error: error.message,
        jobTitle,
        location
      };
    }
  }

  // Research hiring manager or contact person
  async researchContact(contactName, companyName, jobTitle = "") {
    try {
      console.log(`👤 Researching contact: ${contactName} at ${companyName}`);
      
      const query = `${contactName} ${companyName} ${jobTitle} LinkedIn professional background role responsibilities hiring manager HR recruiter`;
      
      const result = await this.search(query, {
        depth: "basic",
        maxResults: 5,
        includeDomains: ["linkedin.com"],
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        contactName,
        company: companyName,
        insights: result.answer,
        professionalInfo: this.extractContactInsights(result.answer),
        sources: result.results,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error researching contact:`, error);
      return {
        success: false,
        error: error.message,
        contactName,
        company: companyName
      };
    }
  }

  // Research industry trends and news
  async researchIndustryTrends(industry, jobTitle = "") {
    try {
      console.log(`📈 Researching industry trends: ${industry}`);
      
      const query = `${industry} industry trends 2024 2025 ${jobTitle} future outlook growth challenges opportunities technology impact hiring`;
      
      const result = await this.search(query, {
        depth: "advanced",
        maxResults: 6,
        excludeDomains: ["facebook.com", "twitter.com", "instagram.com"]
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        industry,
        jobTitle,
        trends: result.answer,
        insights: this.extractIndustryInsights(result.answer),
        sources: result.results,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error researching industry trends:`, error);
      return {
        success: false,
        error: error.message,
        industry
      };
    }
  }

  // Extract structured company details from research
  extractCompanyDetails(summary) {
    if (!summary) return {};

    try {
      const details = {};
      
      // Extract company size
      const sizeRegex = /(\d+[,\d]*)\s*employees?/i;
      const sizeMatch = summary.match(sizeRegex);
      if (sizeMatch) {
        details.employeeCount = sizeMatch[1].replace(/,/g, '');
      }
      
      // Extract revenue
      const revenueRegex = /\$(\d+[,\d]*(?:\.\d+)?)\s*(billion|million|B|M)/i;
      const revenueMatch = summary.match(revenueRegex);
      if (revenueMatch) {
        details.revenue = `$${revenueMatch[1]} ${revenueMatch[2]}`;
      }
      
      // Extract headquarters
      const hqRegex = /headquarter(?:ed|s)?\s*(?:in|at)\s*([^,.]+)/i;
      const hqMatch = summary.match(hqRegex);
      if (hqMatch) {
        details.headquarters = hqMatch[1].trim();
      }
      
      // Extract founded year
      const foundedRegex = /founded\s*(?:in\s*)?(\d{4})/i;
      const foundedMatch = summary.match(foundedRegex);
      if (foundedMatch) {
        details.founded = foundedMatch[1];
      }

      return details;
    } catch (error) {
      console.error('Error extracting company details:', error);
      return {};
    }
  }

  // Extract job market insights
  extractJobMarketInsights(overview) {
    if (!overview) return {};

    try {
      const insights = {};
      
      // Extract salary range
      const salaryRegex = /\$(\d+[,\d]*)\s*(?:to|-)\s*\$?(\d+[,\d]*)/i;
      const salaryMatch = overview.match(salaryRegex);
      if (salaryMatch) {
        insights.salaryRange = `$${salaryMatch[1]} - $${salaryMatch[2]}`;
      }
      
      // Extract growth/demand indicators
      if (overview.match(/high.{0,10}demand|growing.{0,10}field|increasing.{0,10}opportunities/i)) {
        insights.demandLevel = "High";
      } else if (overview.match(/moderate.{0,10}demand|stable.{0,10}market/i)) {
        insights.demandLevel = "Moderate";
      }
      
      // Extract key skills mentioned
      const skillsRegex = /(Python|JavaScript|React|Node\.js|AWS|Docker|Kubernetes|SQL|Java|TypeScript|Angular|Vue|MongoDB|PostgreSQL|Redis|Git|CI\/CD|Agile|Scrum)/gi;
      const skillsMatch = overview.match(skillsRegex);
      if (skillsMatch) {
        insights.keySkills = [...new Set(skillsMatch)]; // Remove duplicates
      }

      return insights;
    } catch (error) {
      console.error('Error extracting job market insights:', error);
      return {};
    }
  }

  // Extract contact insights
  extractContactInsights(info) {
    if (!info) return {};

    try {
      const insights = {};
      
      // Extract role/title
      const roleRegex = /(director|manager|lead|senior|principal|vp|vice president|head of|recruiter|hr)/i;
      const roleMatch = info.match(roleRegex);
      if (roleMatch) {
        insights.seniorityLevel = roleMatch[1];
      }
      
      // Extract years of experience
      const expRegex = /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i;
      const expMatch = info.match(expRegex);
      if (expMatch) {
        insights.experienceYears = expMatch[1];
      }

      return insights;
    } catch (error) {
      console.error('Error extracting contact insights:', error);
      return {};
    }
  }

  // Extract industry insights
  extractIndustryInsights(trends) {
    if (!trends) return {};

    try {
      const insights = {};
      
      // Growth indicators
      if (trends.match(/rapid.{0,10}growth|expanding|booming|surge/i)) {
        insights.growthOutlook = "Positive";
      } else if (trends.match(/declining|shrinking|downturn/i)) {
        insights.growthOutlook = "Negative";
      } else {
        insights.growthOutlook = "Stable";
      }
      
      // Technology trends
      const techRegex = /(AI|artificial intelligence|machine learning|blockchain|cloud|automation|digital transformation|remote work|hybrid)/gi;
      const techMatch = trends.match(techRegex);
      if (techMatch) {
        insights.keyTrends = [...new Set(techMatch)];
      }

      return insights;
    } catch (error) {
      console.error('Error extracting industry insights:', error);
      return {};
    }
  }
}

// Main function to enhance job applications with research
export async function enhanceJobApplicationWithResearch(job, applicationData) {
  const research = new TavilyResearch();
  
  try {
    console.log(`🚀 Enhancing application for ${job.title} at ${job.company}`);
    
    // Research the company
    const companyResearch = await research.researchCompany(job.company);
    
    // Research job market for this position  
    const marketResearch = await research.researchJobMarket(job.title, job.location);
    
    // Research industry trends
    let industryResearch = null;
    if (job.industry) {
      industryResearch = await research.researchIndustryTrends(job.industry, job.title);
    }
    
    // Research the contact if available
    let contactResearch = null;
    if (applicationData.contactName) {
      contactResearch = await research.researchContact(
        applicationData.contactName,
        job.company,
        job.title
      );
    }

    return {
      success: true,
      enhancedData: {
        ...applicationData,
        research: {
          company: companyResearch,
          jobMarket: marketResearch,
          industry: industryResearch,
          contact: contactResearch,
          timestamp: new Date().toISOString()
        }
      }
    };

  } catch (error) {
    console.error('Error enhancing application with research:', error);
    return {
      success: false,
      error: error.message,
      fallbackData: applicationData
    };
  }
}

// Quick test function
export async function testTavilyAPI() {
  const research = new TavilyResearch();
  
  try {
    console.log('🧪 Testing Tavily API...');
    const result = await research.search("Google company information");
    
    if (result.success) {
      console.log('✅ Tavily API working!');
      console.log('Answer preview:', result.answer?.substring(0, 100) + '...');
      return true;
    } else {
      console.log('❌ Tavily API failed:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return false;
  }
}