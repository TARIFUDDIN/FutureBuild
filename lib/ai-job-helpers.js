export class EnhancedAIHelpers {
  constructor() {
   
  }

  
  parseJobQuery(query) {
    const words = query.toLowerCase().split(/\s+/);
    
    return {
      jobTitle: this.extractJobTitleFallback(query),
      location: this.extractLocationFallback(query),
      skills: this.extractSkillsFallback(query),
      jobType: this.extractJobTypeFallback(query),
      experienceLevel: this.extractExperienceFallback(query),
      originalQuery: query
    };
  }

  extractJobTitleFallback(query) {
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

  extractLocationFallback(query) {
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

  extractSkillsFallback(query) {
    const query_lower = query.toLowerCase();
    const allSkills = [
      'react', 'angular', 'vue', 'javascript', 'typescript', 'node.js',
      'python', 'java', 'html', 'css', 'mongodb', 'postgresql', 'aws'
    ];
    
    return allSkills.filter(skill => 
      query_lower.includes(skill.toLowerCase())
    ).slice(0, 6);
  }

  extractJobTypeFallback(query) {
    const query_lower = query.toLowerCase();
    
    if (query_lower.includes('full time')) return 'Full-time';
    if (query_lower.includes('part time')) return 'Part-time';
    if (query_lower.includes('contract')) return 'Contract';
    if (query_lower.includes('remote')) return 'Remote';
    if (query_lower.includes('internship')) return 'Internship';
    
    return 'Full-time';
  }

  extractExperienceFallback(query) {
    const query_lower = query.toLowerCase();
    
    if (query_lower.includes('senior')) return 'Senior';
    if (query_lower.includes('junior')) return 'Junior';
    if (query_lower.includes('entry')) return 'Entry';
    
    return 'Mid-level';
  }

  // Basic match score calculation
  calculateBasicMatchScore(job, parsedQuery) {
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

  // Generate basic job description if missing
  generateBasicJobDescription(title, company) {
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
}

// Export singleton instance
export const aiHelpers = new EnhancedAIHelpers();