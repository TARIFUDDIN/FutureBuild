// lib/email-templates.js
// Email templates for job automation

export const emailTemplates = {
  // Professional application email
  professional: {
    subject: (job, user) => `Application for ${job.title} Position - ${user.name}`,
    body: (job, user, research = null) => `Dear Hiring Manager,

I hope this email finds you well. I am writing to express my strong interest in the ${job.title} position at ${job.company}.

${research?.company?.summary ? 
  `I'm particularly drawn to ${job.company} because of ${research.company.summary.substring(0, 150)}...` :
  `I'm excited about the opportunity to contribute to ${job.company}'s continued growth and success.`
}

With my background in ${user.skills?.slice(0, 3).join(', ') || 'software development'}, I believe I would be a valuable addition to your team. My experience includes:

${user.experience?.slice(0, 2).map(exp => `• ${exp}`).join('\n') || 
  '• Strong technical skills and problem-solving abilities\n• Collaborative team player with excellent communication'
}

I have attached my resume for your review and would welcome the opportunity to discuss how my skills and experience align with your team's needs.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${user.name}
${user.email || ''}
${user.phone || ''}`
  },

  // Casual/startup style email
  casual: {
    subject: (job, user) => `Excited about the ${job.title} role at ${job.company}!`,
    body: (job, user, research = null) => `Hi there!

I came across the ${job.title} position at ${job.company} and I'm really excited about it!

${research?.company?.summary ?
  `What caught my attention about ${job.company} is ${research.company.summary.substring(0, 100)}...` :
  `${job.company} seems like an amazing place to work, and I'd love to be part of the team.`
}

I've been working with ${user.skills?.slice(0, 2).join(' and ') || 'various technologies'} and have experience in:
${user.experience?.slice(0, 2).map(exp => `• ${exp}`).join('\n') || '• Building awesome software solutions\n• Working in collaborative environments'}

I've attached my resume, but I'd love to chat more about how I could contribute to your team's success.

Looking forward to hearing from you!

Cheers,
${user.name}
${user.email || ''}`
  },

  // Technical focus email
  technical: {
    subject: (job, user) => `${job.title} Application - ${user.name} | ${user.skills?.slice(0, 2).join(' & ') || 'Tech Enthusiast'}`,
    body: (job, user, research = null) => `Dear Technical Hiring Team,

I am writing to apply for the ${job.title} position at ${job.company}.

${research?.company?.summary ?
  `I'm impressed by ${job.company}'s technical approach, particularly ${research.company.summary.substring(0, 120)}...` :
  `I'm drawn to ${job.company}'s commitment to technical excellence and innovation.`
}

Technical Background:
• Programming Languages: ${user.skills?.filter(skill => 
    ['javascript', 'python', 'java', 'typescript', 'go', 'rust', 'c++'].includes(skill.toLowerCase())
  ).join(', ') || 'JavaScript, Python'}
• Frameworks & Tools: ${user.skills?.filter(skill => 
    ['react', 'angular', 'vue', 'node', 'express', 'django', 'spring'].includes(skill.toLowerCase())
  ).join(', ') || 'React, Node.js'}
• Infrastructure: ${user.skills?.filter(skill => 
    ['aws', 'docker', 'kubernetes', 'terraform', 'jenkins'].includes(skill.toLowerCase())
  ).join(', ') || 'AWS, Docker'}

Recent Experience:
${user.experience?.slice(0, 2).map(exp => `• ${exp}`).join('\n') || 
  '• Developed scalable web applications\n• Implemented CI/CD pipelines and automated testing'
}

I'm particularly interested in contributing to your technical challenges and would welcome the opportunity to discuss the technical requirements in detail.

Thank you for your consideration.

Best regards,
${user.name}
${user.email || ''}
GitHub: ${user.github || 'Available upon request'}`
  },

  // Follow-up email template
  followUp: {
    subject: (job, user) => `Following up on ${job.title} Application - ${user.name}`,
    body: (job, user) => `Dear Hiring Manager,

I hope you're doing well. I wanted to follow up on my application for the ${job.title} position at ${job.company} that I submitted on [DATE].

I remain very interested in this opportunity and would be happy to provide any additional information you might need.

If you need any clarification about my background or experience, please don't hesitate to reach out.

Thank you for your time and consideration.

Best regards,
${user.name}
${user.email || ''}
${user.phone || ''}`
  },

  // Thank you after interview email
  thankYou: {
    subject: (job, user) => `Thank you for the ${job.title} interview - ${user.name}`,
    body: (job, user, interviewerName = 'team') => `Dear ${interviewerName},

Thank you for taking the time to speak with me about the ${job.title} position at ${job.company}. I enjoyed our conversation and learning more about the role and your team.

Our discussion reinforced my enthusiasm for this opportunity. I'm excited about the possibility of contributing to ${job.company} and would welcome the chance to be part of your team.

Please don't hesitate to contact me if you need any additional information.

Thank you again for your time and consideration.

Best regards,
${user.name}
${user.email || ''}
${user.phone || ''}`
  }
};

// Email template selector based on company culture/type
export function selectEmailTemplate(job, user, research = null) {
  try {
    // Determine company culture from research or job details
    const companyInfo = research?.company?.summary?.toLowerCase() || job.description?.toLowerCase() || '';
    const companyName = job.company?.toLowerCase() || '';
    
    // Check for startup/casual indicators
    if (
      companyInfo.includes('startup') || 
      companyInfo.includes('casual') ||
      companyInfo.includes('flexible') ||
      companyName.includes('labs') ||
      companyName.includes('studio')
    ) {
      return 'casual';
    }
    
    // Check for technical company indicators
    if (
      job.title?.toLowerCase().includes('engineer') ||
      job.title?.toLowerCase().includes('developer') ||
      companyInfo.includes('technical') ||
      companyInfo.includes('engineering') ||
      companyInfo.includes('technology')
    ) {
      return 'technical';
    }
    
    // Default to professional
    return 'professional';
  } catch (error) {
    console.error('Error selecting email template:', error);
    return 'professional';
  }
}

// Generate email content
export function generateEmailContent(job, user, research = null, templateType = null) {
  try {
    // Auto-select template if not specified
    const selectedTemplate = templateType || selectEmailTemplate(job, user, research);
    const template = emailTemplates[selectedTemplate] || emailTemplates.professional;
    
    return {
      subject: template.subject(job, user),
      body: template.body(job, user, research),
      templateUsed: selectedTemplate,
      personalizedElements: {
        hasResearch: !!research,
        skillsIncluded: user.skills?.length || 0,
        experienceIncluded: user.experience?.length || 0
      }
    };
  } catch (error) {
    console.error('Error generating email content:', error);
    
    // Fallback simple email
    return {
      subject: `Application for ${job.title || 'Position'} - ${user.name || 'Applicant'}`,
      body: `Dear Hiring Manager,\n\nI am interested in the ${job.title || 'position'} at ${job.company || 'your company'}.\n\nThank you for your consideration.\n\nBest regards,\n${user.name || 'Applicant'}`,
      templateUsed: 'fallback',
      personalizedElements: {}
    };
  }
}

// Email validation
export function validateEmailContent(emailContent) {
  const errors = [];
  
  if (!emailContent.subject || emailContent.subject.trim().length === 0) {
    errors.push('Subject line is required');
  }
  
  if (!emailContent.body || emailContent.body.trim().length < 50) {
    errors.push('Email body is too short');
  }
  
  if (emailContent.subject && emailContent.subject.length > 100) {
    errors.push('Subject line is too long');
  }
  
  if (emailContent.body && emailContent.body.length > 5000) {
    errors.push('Email body is too long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Email tracking helpers
export function generateTrackingPixel(applicationId) {
  return `<img src="https://yourapp.com/api/track/email/${applicationId}" width="1" height="1" style="display:none;" />`;
}

export function addEmailTracking(htmlContent, applicationId) {
  const trackingPixel = generateTrackingPixel(applicationId);
  return htmlContent + trackingPixel;
}

// Convert plain text email to HTML
export function convertToHTML(plainTextEmail) {
  return plainTextEmail
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/• /g, '<li>')
    .replace(/<li>/g, '<ul><li>')
    .replace(/<\/p><p><ul>/g, '</p><ul>')
    .replace(/<\/li><\/p>/g, '</li></ul></p>');
}

// Email scheduling helpers
export function calculateOptimalSendTime() {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Optimal times: 9-11 AM or 2-4 PM on weekdays
  if (now.getDay() === 0 || now.getDay() === 6) {
    // Weekend - schedule for Monday 9 AM
    const monday = new Date(now);
    monday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    monday.setHours(9, 0, 0, 0);
    return monday;
  }
  
  if (currentHour < 9) {
    // Before 9 AM - send at 9 AM today
    const sendTime = new Date(now);
    sendTime.setHours(9, 0, 0, 0);
    return sendTime;
  } else if (currentHour >= 17) {
    // After 5 PM - send at 9 AM next business day
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 1);
    if (nextDay.getDay() === 0) nextDay.setDate(nextDay.getDate() + 1); // Skip Sunday
    if (nextDay.getDay() === 6) nextDay.setDate(nextDay.getDate() + 2); // Skip Saturday
    nextDay.setHours(9, 0, 0, 0);
    return nextDay;
  }
  
  // Send now if it's during business hours
  return now;
}