"use server";

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Course recommendations based on field
const courseRecommendations = {
  "DevOps": [
  ['Complete DevOps Bootcamp [Free]', 'https://youtu.be/Ou9j73aWgyE?si=Wa76e-xfoEnnGbl3'],
  ['Docker Complete Tutorial [Free]', 'https://youtu.be/3c-iBn73dDE?si=yfN9QvY2QczAucHd'],
  ['Kubernetes Tutorial [Free]', 'https://youtu.be/X48VuDVv0do?si=XnCdY-_o3114V_nx'],
  ['Jenkins CI/CD Pipeline [Free]', 'https://youtu.be/NVaP8qtLm6Q?si=RmDaHnKQ520eWbWj'],
  ['Terraform Infrastructure as Code [Free]', 'https://youtu.be/4JYtAf4M88Y?si=CcyCMw_wgBH-gTd9'],
  ['AWS Complete Tutorial [Free]', 'https://youtu.be/rKNSc8RrwxA?si=o4Q1FclmWXgtrmHs'],
  ['Prometheus & Grafana Monitoring [Free]', 'https://youtu.be/ddZjhv66o_o?si=XZvEs1OE7iSUFKWb'],
  ['DevOps Engineering on AWS by AWS', 'https://aws.amazon.com/training/classroom/devops-engineering-on-aws/'],
  ['Google Cloud DevOps Engineer Professional Certificate', 'https://www.coursera.org/professional-certificates/google-cloud-devops-engineer'],
  ['Microsoft Azure DevOps Engineer Expert', 'https://docs.microsoft.com/en-us/learn/certifications/devops-engineer/']
],
  "Data Science":[
  ['Machine Learning Crash Course by Google [Free]', 'https://developers.google.com/machine-learning/crash-course'],
  ['Machine Learning A-Z by Udemy','https://www.udemy.com/course/machinelearning/'],
  ['Machine Learning by Andrew NG','https://www.coursera.org/learn/machine-learning'],
  ['Data Scientist Master Program of Simplilearn (IBM)','https://www.simplilearn.com/big-data-and-analytics/senior-data-scientist-masters-program-training'],
  ['Data Science Foundations: Fundamentals by LinkedIn','https://www.linkedin.com/learning/data-science-foundations-fundamentals-5'],
  ['Data Scientist with Python','https://www.datacamp.com/tracks/data-scientist-with-python'],
  ['Programming for Data Science with Python','https://www.udacity.com/course/programming-for-data-science-nanodegree--nd104'],
  ['Programming for Data Science with R','https://www.udacity.com/course/programming-for-data-science-nanodegree-with-R--nd118'],
  ['Introduction to Data Science','https://www.udacity.com/course/introduction-to-data-science--cd0017'],
  ['Intro to Machine Learning with TensorFlow','https://www.udacity.com/course/intro-to-machine-learning-with-tensorflow-nanodegree--nd230']],
  
  "Frontend Development": [
    ['React Crash Course [Free]','https://youtu.be/Dorf8i6lCuk'],
    ['Advanced React [Free]','https://www.youtube.com/watch?v=0fYi8SGA20k'],
    ['React JS - React Tutorial for Beginners','https://www.udemy.com/course/react-tutorial-and-projects-course/'],
    ['The Complete Front-End Web Development Course','https://www.udemy.com/course/front-end-web-development/'],
    ['Advanced CSS and Sass: Flexbox, Grid, Animations','https://www.udemy.com/course/advanced-css-and-sass/'],
    ['Vue - The Complete Guide','https://www.udemy.com/course/vuejs-2-the-complete-guide/'],
    ['Angular - The Complete Guide','https://www.udemy.com/course/the-complete-guide-to-angular-2/'],
    ['TypeScript: The Complete Developer\'s Guide','https://www.udemy.com/course/typescript-the-complete-developers-guide/'],
    ['Frontend Web Developer Nanodegree by Udacity','https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011'],
    ['Complete UI/UX & JavaScript Building 10 Projects','https://www.udemy.com/course/complete-web-designer-mobile-designer-zero-to-mastery/']
  ],
  
  "Full Stack Development": [
    ['The Web Developer Bootcamp 2023','https://www.udemy.com/course/the-web-developer-bootcamp/'],
    ['The Complete 2023 Web Development Bootcamp','https://www.udemy.com/course/the-complete-web-development-bootcamp/'],
    ['MERN Stack Course - MongoDB, Express, React, Node [Free]','https://youtu.be/7CqJlxBYj-M'],
    ['Full Stack Web Development with React Specialization','https://www.coursera.org/specializations/full-stack-react'],
    ['CS50\'s Web Programming with Python and JavaScript','https://www.edx.org/course/cs50s-web-programming-with-python-and-javascript'],
    ['Full Stack JavaScript Techdegree','https://teamtreehouse.com/techdegree/full-stack-javascript'],
    ['Full Stack for Front-End Engineers','https://frontendmasters.com/courses/fullstack-v2/'],
    ['MEAN Stack Developer - Complete Guide','https://www.simplilearn.com/mean-stack-developer-training-course'],
    ['JavaScript Full Stack Developer Bootcamp','https://www.udemy.com/course/javascript-web-projects-to-build-your-portfolio-resume/'],
    ['Full Stack Development with Next.js & Headless CMS','https://www.udemy.com/course/nextjs-cms/']
  ],
  
  "Java Development": [
    ['Java Programming Masterclass for Software Developers','https://www.udemy.com/course/java-the-complete-java-developer-course/'],
    ['Spring & Hibernate for Beginners','https://www.udemy.com/course/spring-hibernate-tutorial/'],
    ['Java Programming: Complete Beginner to Advanced [Free]','https://youtu.be/grEKMHGYyns'],
    ['Spring Framework 5: Beginner to Guru','https://www.udemy.com/course/spring-framework-5-beginner-to-guru/'],
    ['Microservices with Spring Boot and Spring Cloud','https://www.udemy.com/course/microservices-with-spring-boot-and-spring-cloud/'],
    ['Java EE 8 Essential Training','https://www.linkedin.com/learning/java-ee-8-essential-training'],
    ['Java Backend Development Course','https://www.edx.org/professional-certificate/delftx-java-backend-developer'],
    ['Java In-Depth: Become a Complete Java Engineer','https://www.udemy.com/course/java-in-depth-become-a-complete-java-engineer/'],
    ['Build Enterprise Applications with Java EE','https://www.pluralsight.com/paths/building-enterprise-applications-with-java-ee'],
    ['Design Patterns in Java','https://www.udemy.com/course/design-patterns-java/']
  ],
  
  "Android Development": [
    ['Android Development for Beginners [Free]','https://youtu.be/fis26HvvDII'],
                  ['Android App Development Specialization','https://www.coursera.org/specializations/android-app-development'],
                  ['Associate Android Developer Certification','https://grow.google/androiddev/#?modal_active=none'],
                  ['Become an Android Kotlin Developer by Udacity','https://www.udacity.com/course/android-kotlin-developer-nanodegree--nd940'],
                  ['Android Basics by Google','https://www.udacity.com/course/android-basics-nanodegree-by-google--nd803'],
                  ['The Complete Android Developer Course','https://www.udemy.com/course/complete-android-n-developer-course/'],
                  ['Building an Android App with Architecture Components','https://www.linkedin.com/learning/building-an-android-app-with-architecture-components'],
                  ['Android App Development Masterclass using Kotlin','https://www.udemy.com/course/android-oreo-kotlin-app-masterclass/'],
                  ['Flutter & Dart - The Complete Flutter App Development Course','https://www.udemy.com/course/flutter-dart-the-complete-flutter-app-development-course/'],
                  ['Flutter App Development Course [Free]','https://youtu.be/rZLR5olMR64']
  ],
  
  "iOS Development": [
      ['IOS App Development by LinkedIn','https://www.linkedin.com/learning/subscription/topics/ios'],
  ['iOS & Swift - The Complete iOS App Development Bootcamp','https://www.udemy.com/course/ios-13-app-development-bootcamp/'],
  ['Become an iOS Developer','https://www.udacity.com/course/ios-developer-nanodegree--nd003'],
  ['iOS App Development with Swift Specialization','https://www.coursera.org/specializations/app-development'],
  ['Mobile App Development with Swift','https://www.edx.org/professional-certificate/curtinx-mobile-app-development-with-swift'],
  ['Swift Course by LinkedIn','https://www.linkedin.com/learning/subscription/topics/swift-2'],
  ['Objective-C Crash Course for Swift Developers','https://www.udemy.com/course/objectivec/'],
  ['Learn Swift by Codecademy','https://www.codecademy.com/learn/learn-swift'],
  ['Swift Tutorial - Full Course for Beginners [Free]','https://youtu.be/comQ1-x2a1Q'],
  ['Learn Swift Fast - [Free]','https://youtu.be/FcsY1YPBwzQ']
],
  
  "UI/UX Development": [
    ['Google UX Design Professional Certificate','https://www.coursera.org/professional-certificates/google-ux-design'],
  ['UI / UX Design Specialization','https://www.coursera.org/specializations/ui-ux-design'],
  ['The Complete App Design Course - UX, UI and Design Thinking','https://www.udemy.com/course/the-complete-app-design-course-ux-and-ui-design/'],
  ['UX & Web Design Master Course: Strategy, Design, Development','https://www.udemy.com/course/ux-web-design-master-course-strategy-design-development/'],
  ['The Complete App Design Course - UX, UI and Design Thinking','https://www.udemy.com/course/the-complete-app-design-course-ux-and-ui-design/'],
  ['DESIGN RULES: Principles + Practices for Great UI Design','https://www.udemy.com/course/design-rules/'],
  ['Become a UX Designer by Udacity','https://www.udacity.com/course/ux-designer-nanodegree--nd578'],
  ['Adobe XD Tutorial: User Experience Design Course [Free]','https://youtu.be/68w2VwalD5w'],
  ['Adobe XD for Beginners [Free]','https://youtu.be/WEljsc2jorI'],
  ['Adobe XD in Simple Way','https://learnux.io/course/adobe-xd']]
};

// Resume tips videos
const resumeVideos = [
  "https://www.youtube.com/watch?v=y8YH0Qbu5h4",
  "https://www.youtube.com/watch?v=JkLEmP1pF4U",
  "https://www.youtube.com/watch?v=BYUy1yvjHxE",
  "https://www.youtube.com/watch?v=HQzWU4LLrwE"
];

// Interview tips videos
const interviewVideos = [
  "https://www.youtube.com/watch?v=Ji46s5BHdr0",
  "https://www.youtube.com/watch?v=2HQmjLu-6RQ",
  "https://www.youtube.com/watch?v=oJRgGS3d2wY",
  "https://www.youtube.com/watch?v=9FgX-1EISGU"
];

// Skills keyword mapping
const skillKeywords = {
  devops: ['devops', 'dev ops', 'ci/cd', 'continuous integration', 'continuous deployment', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'puppet', 'chef','aws', 'azure', 'gcp', 'google cloud', 'cloud computing', 'infrastructure as code','containerization', 'orchestration', 'microservices', 'monitoring', 'logging','prometheus', 'grafana', 'elk stack', 'elasticsearch', 'kibana', 'logstash','git', 'github actions', 'gitlab ci', 'bitbucket pipelines', 'circleci','linux', 'bash', 'shell scripting', 'python automation', 'yaml', 'json','nginx', 'apache', 'load balancing', 'auto scaling', 'vpc', 'security groups','iam', 'route53', 'cloudformation', 'cloudwatch', 'lambda', 's3', 'ec2', 'ecs','helm', 'istio', 'service mesh', 'api gateway', 'backup', 'disaster recovery','infrastructure monitoring', 'application monitoring', 'alerting', 'incident management','configuration management', 'version control', 'artifact management', 'nexus', 'artifactory'],
  dataScience: ['tensorflow', 'keras', 'pytorch', 'machine learning', 'deep learning', 'flask', 'streamlit', 'python', 'data analysis', 'pandas', 'numpy', 'scikit-learn', 'statistics', 'data mining', 'ai', 'artificial intelligence', 'big data'],
  
  frontendDevelopment: ['react', 'vue.js', 'angular', 'javascript', 'typescript', 'html', 'css', 'bootstrap', 'tailwind', 'sass', 'less', 'webpack', 'vite', 'next.js', 'redux', 'jquery', 'responsive design', 'pwa', 'web accessibility'],
  
  fullStackDevelopment: ['node.js', 'express.js', 'mongodb', 'mongoose', 'sql', 'nosql', 'graphql', 'rest api', 'mern', 'mean', 'lamp', 'full stack', 'docker', 'kubernetes', 'aws', 'azure', 'heroku', 'netlify', 'vercel', 'git', 'ci/cd'],
  
  javaDevelopment: ['java', 'spring', 'spring boot', 'hibernate', 'jpa', 'jdbc', 'servlets', 'jsp', 'maven', 'gradle', 'junit', 'mockito', 'tomcat', 'websphere', 'jboss', 'microservices', 'restful services', 'soap', 'design patterns', 'multithreading'],
  
  androidDevelopment: ['android', 'android development', 'flutter', 'kotlin', 'xml', 'kivy', 'firebase', 'java', 'react native', 'jetpack compose', 'material design'],
  
  iosDevelopment: ['ios', 'ios development', 'swift', 'cocoa', 'cocoa touch', 'xcode', 'objective-c', 'swiftui', 'core data', 'uikit'],
  
  uiuxDevelopment: ['ux', 'ui', 'adobe xd', 'figma', 'zeplin', 'balsamiq', 'prototyping', 'wireframes', 'storyframes', 'photoshop', 'editing', 'illustrator', 'after effects', 'premier pro', 'indesign', 'wireframe', 'user research', 'user experience', 'design systems', 'accessibility']
};

// Recommended skills based on field
const recommendedSkills = {
  "Data Science": ['Data Visualization', 'Predictive Analysis', 'Statistical Modeling', 'Data Mining', 'Clustering & Classification', 'Data Analytics', 'Quantitative Analysis', 'Web Scraping', 'ML Algorithms', 'Keras', 'Pytorch', 'Probability', 'Scikit-learn', 'Tensorflow', 'Flask', 'Streamlit'],
  
  "Frontend Development": ['React', 'TypeScript', 'Redux', 'Next.js', 'CSS-in-JS', 'Responsive Design', 'Accessibility (a11y)', 'Performance Optimization', 'Component Design', 'Webpack', 'Vite', 'Jest', 'React Testing Library', 'State Management', 'CSS Grid/Flexbox', 'Animation Libraries'],
  
  "Full Stack Development": ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'RESTful APIs', 'GraphQL', 'Authentication/JWT', 'AWS/Cloud Services', 'Docker', 'CI/CD', 'Microservices', 'Redis', 'Socket.IO', 'Server-Side Rendering', 'Serverless Functions', 'Git Workflow'],
  
  "Java Development": ['Spring Boot', 'Hibernate', 'JPA', 'Spring Security', 'RESTful Services', 'Microservices', 'Maven/Gradle', 'JUnit/Mockito', 'Design Patterns', 'Java 8+ Features', 'Multithreading', 'Apache Kafka', 'Elasticsearch', 'SQL Optimization', 'Docker/Kubernetes', 'CI/CD for Java'],
  
  "Android Development": ['Android', 'Kotlin', 'Jetpack Compose', 'MVVM Architecture', 'Retrofit', 'Room Database', 'Dagger/Hilt', 'Coroutines', 'Flow', 'Firebase', 'Material Design', 'Unit Testing', 'UI Testing', 'Gradle'],
  
  "iOS Development": ['Swift', 'SwiftUI', 'UIKit', 'Core Data', 'Combine', 'ARKit', 'CoreML', 'XCTest', 'CocoaPods', 'Grand Central Dispatch', 'MVVM', 'Push Notifications', 'App Store Connect'],
  
  "UI/UX Development": ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'Interaction Design', 'Visual Design', 'Usability Testing', 'Information Architecture', 'Design Systems', 'Accessibility', 'User Personas', 'Journey Maps', 'A/B Testing']
};

// EXISTING FUNCTION: General Resume Analysis
export async function analyzeResume(formData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const resumeText = formData.get('resumeText');
    if (!resumeText || resumeText.trim() === '') {
      return { success: false, error: "No resume text provided" };
    }

    // Enhanced prompt for Gemini to extract more accurate information
    const extractionPrompt = `
      Analyze the following resume text and extract the following information in JSON format:
      1. "name": Full name of the person
      2. "email": Email address
      3. "phone": Phone number (if available)
      4. "skills": Extract ALL technical skills, programming languages, frameworks, tools, and technologies mentioned in the resume. Be very thorough and detailed. Include both hard skills and soft skills if mentioned. Return as an array of strings with standardized naming (e.g., "JavaScript" not "javascript").
      5. "education": Education details as an array of objects with "institution", "degree", "field", "year" (if available)
      6. "experience": Years of experience if it can be determined directly, or estimate based on work history
      7. "projects": List of projects as an array of objects with "name", "description", and "technologies" used
      
      Resume text:
      ${resumeText}
      
      Return ONLY a clean, valid JSON object with these fields, with no markdown formatting, no code blocks, and no extra text. If any field cannot be determined, use null or an empty array as appropriate.
      Be especially thorough with the skills extraction - look for skills in project descriptions, technical skills sections, and throughout the resume.
    `;

    const extractionResult = await model.generateContent(extractionPrompt);
    const extractionResponseText = extractionResult.response.text().trim();
    
    
    let cleanedResponse = extractionResponseText;
    
    // Remove markdown code block indicators if present
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\n/, "");
      cleanedResponse = cleanedResponse.replace(/```$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n/, "");
      cleanedResponse = cleanedResponse.replace(/```$/, "");
    }
    
    // Parse the JSON
    let extractedInfo;
    try {
      extractedInfo = JSON.parse(cleanedResponse);
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      console.log("Response received:", extractionResponseText);
      
      // Fallback with basic structure
      extractedInfo = {
        name: null,
        email: null,
        phone: null,
        skills: [],
        education: [],
        experience: null,
        projects: []
      };
    }

    // Normalize skills to lowercase for comparison
    
    // Determine job field based on skills with enhanced detection
const skills = extractedInfo.skills || [];
const skillsLower = skills.map(skill => skill.toLowerCase());

// Determine job field based on skills with enhanced detection
let jobField = "Unknown";
let fieldScore = { 
  "DevOps": 0,
  "Data Science": 0, 
  "Frontend Development": 0, 
  "Full Stack Development": 0,
  "Java Development": 0,
  "Android Development": 0, 
  "iOS Development": 0, 
  "UI/UX Development": 0 
};

// Calculate scores for each field based on skills with weighted scoring
skillsLower.forEach(skill => {
  // DevOps scoring with weights
if (skillKeywords.devops.some(keyword => skill.includes(keyword))) {
  // Give higher weight to core DevOps skills
  const weight = ['docker', 'kubernetes', 'jenkins', 'terraform', 'aws', 'ci/cd', 'devops', 'ansible'].some(key => skill.includes(key)) ? 3 : 1;
  fieldScore["DevOps"] += weight;
}
  if (skillKeywords.dataScience.some(keyword => skill.includes(keyword))) {
    // Give higher weight to core data science skills
    const weight = ['tensorflow', 'pytorch', 'machine learning', 'deep learning', 'data analysis', 'pandas', 'numpy', 'scikit-learn'].some(key => skill.includes(key)) ? 2 : 1;
    fieldScore["Data Science"] += weight;
  }
  
  // Frontend Development scoring with weights
  if (skillKeywords.frontendDevelopment.some(keyword => skill.includes(keyword))) {
    // Give higher weight to modern frontend frameworks
    const weight = ['react', 'angular', 'vue', 'next.js', 'typescript'].some(key => skill.includes(key)) ? 2 : 1;
    fieldScore["Frontend Development"] += weight;
  }
  
  // Full Stack Development scoring with weights
  if (skillKeywords.fullStackDevelopment.some(keyword => skill.includes(keyword))) {
    // Give higher weight to core full stack skills
    const weight = ['node.js', 'express', 'mongodb', 'rest api', 'mern', 'mean'].some(key => skill.includes(key)) ? 2 : 1;
    fieldScore["Full Stack Development"] += weight;
  }
  
  // Java Development scoring with weights
  if (skillKeywords.javaDevelopment.some(keyword => skill.includes(keyword))) {
    // Give higher weight to core Java skills
    const weight = ['java', 'spring', 'spring boot', 'hibernate', 'jpa'].some(key => skill.includes(key)) ? 2 : 1;
    fieldScore["Java Development"] += weight;
  }
  
  // Android Development scoring with weights
  if (skillKeywords.androidDevelopment.some(keyword => skill.includes(keyword))) {
    // Give higher weight to core Android skills
    const weight = ['android', 'kotlin', 'java', 'flutter'].some(key => skill.includes(key)) ? 2 : 1;
    fieldScore["Android Development"] += weight;
  }
  
  // iOS Development scoring with weights
  if (skillKeywords.iosDevelopment.some(keyword => skill.includes(keyword))) {
    // Give higher weight to core iOS skills
    const weight = ['ios', 'swift', 'objective-c', 'swiftui', 'uikit'].some(key => skill.includes(key)) ? 2 : 1;
    fieldScore["iOS Development"] += weight;
  }
  
  // UI/UX Development scoring with weights
  if (skillKeywords.uiuxDevelopment.some(keyword => skill.includes(keyword))) {
    // Give higher weight to core UI/UX skills
    const weight = ['ux', 'ui', 'figma', 'adobe xd', 'user experience', 'wireframe'].some(key => skill.includes(key)) ? 2 : 1;
    fieldScore["UI/UX Development"] += weight;
  }
});

// Also check project descriptions for additional clues about the job field
const projects = extractedInfo.projects || [];
projects.forEach(project => {
  const description = (project.description || '').toLowerCase();
  const techs = (project.technologies || []).map(tech => tech.toLowerCase());
  
  // Combine description and technologies for analysis
  const combinedText = description + ' ' + techs.join(' ');
  
  // Check for field-specific terms in project descriptions
  for (const [field, keywords] of Object.entries(skillKeywords)) {
    let fieldKey;
    // Map the field from camelCase to the appropriate category name
    switch (field) {
      case 'devops':
        fieldKey = 'DevOps';
        break;
      case 'dataScience':
        fieldKey = 'Data Science';
        break;
      case 'frontendDevelopment':
        fieldKey = 'Frontend Development';
        break;
      case 'fullStackDevelopment':
        fieldKey = 'Full Stack Development';
        break;
      case 'javaDevelopment':
        fieldKey = 'Java Development';
        break;
      case 'androidDevelopment':
        fieldKey = 'Android Development';
        break;
      case 'iosDevelopment':
        fieldKey = 'iOS Development';
        break;
      case 'uiuxDevelopment':
        fieldKey = 'UI/UX Development';
        break;
      default:
        continue;
    }
    
    const matchCount = keywords.filter(keyword => combinedText.includes(keyword)).length;
    if (matchCount > 0) {
      fieldScore[fieldKey] += matchCount * 0.5; // Add 0.5 points per matching keyword in projects
    }
  }
});

// Find the field with the highest score
let maxScore = 0;
for (const [field, score] of Object.entries(fieldScore)) {
  if (score > maxScore) {
    maxScore = score;
    jobField = field;
  }
}

// If no field is detected or score is too low, make an educated guess based on the resume content
if (jobField === "Unknown" || maxScore < 2) {
  const resumeLower = resumeText.toLowerCase();
  
if (resumeLower.includes('devops') || resumeLower.includes('ci/cd') || resumeLower.includes('docker') || 
    resumeLower.includes('kubernetes') || resumeLower.includes('jenkins') || resumeLower.includes('terraform') ||
    resumeLower.includes('infrastructure') || resumeLower.includes('deployment automation')) {
  jobField = "DevOps";
}
  if (resumeLower.includes('react') || resumeLower.includes('angular') || resumeLower.includes('vue') || 
      resumeLower.includes('frontend') || resumeLower.includes('html') || resumeLower.includes('css')) {
    jobField = "Frontend Development";
  } else if (resumeLower.includes('node') || resumeLower.includes('express') || resumeLower.includes('full stack') ||
             resumeLower.includes('mern') || resumeLower.includes('mean')) {
    jobField = "Full Stack Development";
  } else if (resumeLower.includes('java') || resumeLower.includes('spring') || resumeLower.includes('hibernate')) {
    jobField = "Java Development";
  } else if (resumeLower.includes('android') || resumeLower.includes('mobile app') || resumeLower.includes('kotlin')) {
    jobField = "Android Development";
  } else if (resumeLower.includes('ios') || resumeLower.includes('swift') || resumeLower.includes('objective-c')) {
    jobField = "iOS Development";
  } else if (resumeLower.includes('data') || resumeLower.includes('machine learning') || resumeLower.includes('analytics')) {
    jobField = "Data Science";
  } else if (resumeLower.includes('design') || resumeLower.includes('ui') || resumeLower.includes('ux')) {
    jobField = "UI/UX Development";
  } else {
    // Default to Full Stack Development if nothing else matches
    jobField = "Full Stack Development";
  }
}
    // Determine experience level more accurately
    let experienceLevel = "Fresher";
    const yearsExperience = extractedInfo.experience;
    const hasWorkExperience = resumeText.toLowerCase().includes('experience') || 
                             resumeText.toLowerCase().includes('worked at') ||
                             resumeText.toLowerCase().includes('work history');
    
    // Use extracted years if available, otherwise estimate
    if (yearsExperience && yearsExperience > 3) {
      experienceLevel = "Experienced";
    } else if (yearsExperience && yearsExperience > 1) {
      experienceLevel = "Intermediate";
    } else if (hasWorkExperience) {
      experienceLevel = "Intermediate";
    }
    
    // Check the number of projects as another indicator
    if (projects.length >= 3 && experienceLevel === "Fresher") {
      experienceLevel = "Intermediate";
    }

    // Enhanced ATS analysis prompt with more detailed evaluation criteria
    const analysisPrompt = `
      Analyze the following resume for a ${jobField} position:
      
      ${resumeText}
      
      Provide a detailed ATS (Applicant Tracking System) analysis in JSON format:
      
      1. "atsScore": A score from 0-100 based on these weighted factors:
         - Keyword optimization (30%): Presence of job-relevant keywords
         - Format & structure (25%): Clean formatting, appropriate sections, scannable
         - Content quality (25%): Quantifiable achievements, action verbs, relevance
         - Contact info & basics (10%): Clear contact details and basic info
         - Education & certifications (10%): Relevant education/certifications
      
      2. "scoringBreakdown": An object with scores for each category above (each from 0-100)
      
      3. "keywordAnalysis": {
         "present": [list of relevant keywords found in resume],
         "missing": [important keywords missing for ${jobField} roles]
      }
      
      4. "formatIssues": Array of specific formatting issues
      
      5. "contentIssues": Array of content improvement suggestions
      
      6. "strengthAreas": Array of resume's strongest points
      
      7. "actionItems": Array of 3-5 prioritized improvement tasks
      
      8. "overallAnalysis": A 3-4 sentence executive summary of the resume's effectiveness
      
      Be extremely thorough in your analysis, particularly for keyword detection and the ATS optimization score.
      
      Return ONLY a clean, valid JSON object with NO markdown formatting, NO code blocks, and NO extra text.
    `;

    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisResponseText = analysisResult.response.text().trim();
    
    // Clean up the response to ensure it's valid JSON
    let cleanedAnalysisResponse = analysisResponseText;
    
    // Remove markdown code block indicators if present
    if (cleanedAnalysisResponse.startsWith("```json")) {
      cleanedAnalysisResponse = cleanedAnalysisResponse.replace(/```json\n/, "");
      cleanedAnalysisResponse = cleanedAnalysisResponse.replace(/```$/, "");
    } else if (cleanedAnalysisResponse.startsWith("```")) {
      cleanedAnalysisResponse = cleanedAnalysisResponse.replace(/```\n/, "");
      cleanedAnalysisResponse = cleanedAnalysisResponse.replace(/```$/, "");
    }
    
    // Parse the JSON
    let analysis;
    try {
      analysis = JSON.parse(cleanedAnalysisResponse);
    } catch (jsonError) {
      console.error("Failed to parse analysis JSON:", jsonError);
      console.log("Analysis response received:", analysisResponseText);
      
      // Fallback with basic structure
      analysis = {
        atsScore: 50,
        scoringBreakdown: {
          keywordOptimization: 50,
          formatStructure: 50,
          contentQuality: 50,
          contactInfoBasics: 50,
          educationCertifications: 50
        },
        keywordAnalysis: {
          present: ["Unable to determine keywords"],
          missing: ["Unable to determine missing keywords"]
        },
        formatIssues: ["Unable to analyze format"],
        contentIssues: ["Unable to analyze content"],
        strengthAreas: ["Unable to determine strengths"],
        actionItems: ["Review your resume with a professional"],
        overallAnalysis: "We encountered an issue analyzing your resume. Please try again or consider seeking professional review."
      };
    }

    // Get recommended skills based on job field that the user DOESN'T already have
    const fieldRecommendedSkills = recommendedSkills[jobField] || [];
    
    // Filter out skills the user already has (case-insensitive comparison)
    const missingRecommendedSkills = fieldRecommendedSkills.filter(
      recommendedSkill => !skillsLower.some(
        userSkill => userSkill.toLowerCase().includes(recommendedSkill.toLowerCase()) || 
                    recommendedSkill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    // Get courses based on job field
    const fieldCourses = courseRecommendations[jobField] || [];
    
    // Get random resume and interview videos
    const randomResumeVideo = resumeVideos[Math.floor(Math.random() * resumeVideos.length)];
    const randomInterviewVideo = interviewVideos[Math.floor(Math.random() * interviewVideos.length)];

    // Save analysis to database
    const resumeAnalysis = await db.resumeAnalysis.create({
      data: {
        userId: user.id,
        atsScore: analysis.atsScore,
        missingKeywords: analysis.keywordAnalysis?.missing || [],
        structureIssues: analysis.formatIssues || [],
        contentSuggestions: analysis.contentIssues || [],
        actionItems: analysis.actionItems || [],
        jobTitle: jobField
      }
    });

    return {
      success: true,
      analysis: {
        id: resumeAnalysis.id,
        analysisType: "general",
        basicInfo: {
          name: extractedInfo.name,
          email: extractedInfo.email,
          phone: extractedInfo.phone
        },
        skills: extractedInfo.skills,
        projects: extractedInfo.projects,
        education: extractedInfo.education,
        experienceLevel,
        jobField,
        atsScore: analysis.atsScore,
        scoringBreakdown: analysis.scoringBreakdown,
        keywordAnalysis: analysis.keywordAnalysis,
        missingKeywords: analysis.keywordAnalysis?.missing || [],
        structureIssues: analysis.formatIssues || [],
        contentSuggestions: analysis.contentIssues || [],
        strengthAreas: analysis.strengthAreas || [],
        actionItems: analysis.actionItems || [],
        overallAnalysis: analysis.overallAnalysis,
        recommendedSkills: missingRecommendedSkills.slice(0, 8),
        recommendedCourses: fieldCourses,
        resumeVideo: randomResumeVideo,
        interviewVideo: randomInterviewVideo
      }
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return { success: false, error: "Failed to analyze resume: " + error.message };
  }
}

// NEW FUNCTION: Job Description-based Resume Analysis
export async function analyzeResumeWithJobDescription(formData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    console.log("Starting job-specific analysis...");
    
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    console.log("User found:", user.id);

    const resumeText = formData.get('resumeText');
    const jobDescription = formData.get('jobDescription');
    
    console.log("Resume text length:", resumeText?.length || 0);
    console.log("Job description length:", jobDescription?.length || 0);
    
    if (!resumeText || resumeText.trim() === '') {
      return { success: false, error: "No resume text provided" };
    }
    
    if (!jobDescription || jobDescription.trim() === '') {
      return { success: false, error: "No job description provided" };
    }

    console.log("Starting basic info extraction...");

    // Extract basic info from resume
    const extractionPrompt = `
      Analyze the following resume text and extract the following information in JSON format:
      1. "name": Full name of the person
      2. "email": Email address
      3. "phone": Phone number (if available)
      4. "skills": Extract ALL technical skills, programming languages, frameworks, tools, and technologies mentioned in the resume. Be very thorough and detailed. Return as an array of strings with standardized naming.
      5. "education": Education details as an array of objects with "institution", "degree", "field", "year" (if available)
      6. "experience": Years of experience if it can be determined directly, or estimate based on work history
      7. "projects": List of projects as an array of objects with "name", "description", and "technologies" used
      
      Resume text:
      ${resumeText}
      
      Return ONLY a clean, valid JSON object with these fields, with no markdown formatting, no code blocks, and no extra text.
    `;

    let extractedInfo;
    
    try {
      console.log("Calling Gemini for extraction...");
      const extractionResult = await model.generateContent(extractionPrompt);
      console.log("Extraction completed");
      
      let cleanedResponse = extractionResult.response.text().trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/```json\n/, "").replace(/```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n/, "").replace(/```$/, "");
      }
      extractedInfo = JSON.parse(cleanedResponse);
      console.log("Info extracted successfully");
    } catch (jsonError) {
      console.error("Failed to parse extraction JSON:", jsonError);
      extractedInfo = {
        name: null, email: null, phone: null, skills: [], education: [], experience: null, projects: []
      };
    }

    console.log("Starting job analysis...");

    // Enhanced job description analysis with detailed scoring
    const jobAnalysisPrompt = `
      You are an expert ATS (Applicant Tracking System) and hiring manager. Analyze the following resume against the specific job description provided.

      JOB DESCRIPTION:
      ${jobDescription}

      RESUME:
      ${resumeText}

      Provide a comprehensive analysis in JSON format with the following structure:

      {
        "overallScore": <number 0-100>,
        "detailedScoring": {
          "skillsMatch": <number 0-100>,
          "experienceRelevance": <number 0-100>,
          "educationMatch": <number 0-100>,
          "keywordOptimization": <number 0-100>,
          "projectRelevance": <number 0-100>,
          "formatQuality": <number 0-100>
        },
        "jobInfo": {
          "jobTitle": "<extracted job title>",
          "company": "<extracted company name>",
          "location": "<extracted location>",
          "experienceRequired": "<extracted experience requirement>",
          "salaryRange": "<extracted salary if mentioned>"
        },
        "skillsAnalysis": {
          "requiredSkillsFound": ["<skills from job description that candidate has>"],
          "requiredSkillsMissing": ["<critical skills from job description that candidate lacks>"],
          "preferredSkillsFound": ["<nice-to-have skills that candidate has>"],
          "preferredSkillsMissing": ["<nice-to-have skills that candidate lacks>"],
          "additionalSkills": ["<relevant skills candidate has that weren't mentioned in job description>"]
        },
        "experienceAnalysis": {
          "meetsCriteria": <boolean>,
          "candidateExperience": "<candidate's experience level>",
          "requiredExperience": "<job's experience requirement>",
          "relevantExperience": ["<specific relevant experiences from resume>"],
          "experienceGaps": ["<areas where candidate lacks required experience>"]
        },
        "strengthsForThisRole": ["<specific strengths that match this job>"],
        "weaknessesForThisRole": ["<specific areas where candidate doesn't match this job>"],
        "improvementSuggestions": [
          {
            "area": "<area to improve>",
            "suggestion": "<specific actionable suggestion>",
            "priority": "<High/Medium/Low>"
          }
        ],
        "keywordOptimization": {
          "wellOptimized": ["<keywords/phrases that are well represented>"],
          "needsImprovement": ["<keywords that should be added or emphasized>"],
          "atsCompatibility": <number 0-100>
        },
        "competitiveAdvantage": ["<what makes this candidate stand out for this specific role>"],
        "redFlags": ["<potential concerns for this specific role>"],
        "interviewReadiness": {
          "score": <number 0-100>,
          "areasToFocus": ["<areas candidate should prepare for interviews>"],
          "potentialQuestions": ["<likely interview questions based on gaps>"]
        },
        "overallAssessment": "<3-4 sentence executive summary of how well this candidate matches this specific job>"
      }

      Be extremely thorough and realistic in your analysis. Consider industry standards, role requirements, and current market conditions. Focus specifically on this job match rather than general resume quality.

      Return ONLY a clean, valid JSON object with NO markdown formatting, NO code blocks, and NO extra text.
    `;

    let jobAnalysis;
    
    try {
      console.log("Calling Gemini for job analysis...");
      const jobAnalysisResult = await model.generateContent(jobAnalysisPrompt);
      console.log("Job analysis completed");
      
      let cleanedJobResponse = jobAnalysisResult.response.text().trim();
      if (cleanedJobResponse.startsWith("```json")) {
        cleanedJobResponse = cleanedJobResponse.replace(/```json\n/, "").replace(/```$/, "");
      } else if (cleanedJobResponse.startsWith("```")) {
        cleanedJobResponse = cleanedJobResponse.replace(/```\n/, "").replace(/```$/, "");
      }
      jobAnalysis = JSON.parse(cleanedJobResponse);
      console.log("Job analysis parsed successfully");
    } catch (jsonError) {
      console.error("Failed to parse job analysis JSON:", jsonError);
      // Fallback structure
      jobAnalysis = {
        overallScore: 50,
        detailedScoring: {
          skillsMatch: 50, experienceRelevance: 50, educationMatch: 50,
          keywordOptimization: 50, projectRelevance: 50, formatQuality: 50
        },
        jobInfo: { jobTitle: "Unknown", company: "Unknown", location: "Unknown", experienceRequired: "Unknown", salaryRange: "Not specified" },
        skillsAnalysis: {
          requiredSkillsFound: [], requiredSkillsMissing: [], preferredSkillsFound: [],
          preferredSkillsMissing: [], additionalSkills: []
        },
        experienceAnalysis: {
          meetsCriteria: false, candidateExperience: "Unknown", requiredExperience: "Unknown",
          relevantExperience: [], experienceGaps: []
        },
        strengthsForThisRole: [], weaknessesForThisRole: [], improvementSuggestions: [],
        keywordOptimization: { wellOptimized: [], needsImprovement: [], atsCompatibility: 50 },
        competitiveAdvantage: [], redFlags: [], 
        interviewReadiness: { score: 50, areasToFocus: [], potentialQuestions: [] },
        overallAssessment: "Analysis could not be completed properly. Please try again."
      };
    }

    console.log("Processing recommendations...");

    // Get relevant courses based on missing skills
    const missingSkills = [
      ...(jobAnalysis.skillsAnalysis?.requiredSkillsMissing || []),
      ...(jobAnalysis.skillsAnalysis?.preferredSkillsMissing || [])
    ];
    
    // Enhanced job field detection based on both job description and analysis
    let jobField = "Unknown";
    
    // Get job title and description for analysis
    const jobTitle = (jobAnalysis.jobInfo?.jobTitle || "").toLowerCase();
    const jobDescriptionLower = jobDescription.toLowerCase();
    const allSkillsFromJob = [
      ...(jobAnalysis.skillsAnalysis?.requiredSkillsFound || []),
      ...(jobAnalysis.skillsAnalysis?.requiredSkillsMissing || []),
      ...(jobAnalysis.skillsAnalysis?.preferredSkillsFound || []),
      ...(jobAnalysis.skillsAnalysis?.preferredSkillsMissing || [])
    ].map(skill => skill.toLowerCase()).join(' ');
    
    // Combine all text for comprehensive analysis
    const combinedJobText = `${jobTitle} ${jobDescriptionLower} ${allSkillsFromJob}`;
    
    console.log("Job title detected:", jobTitle);
    console.log("Combined text for field detection:", combinedJobText.substring(0, 200) + "...");
    
    // Enhanced field detection with better keywords and scoring
    const fieldScores = {
      "DevOps": 0,
      "Data Science": 0,
      "Frontend Development": 0,
      "Full Stack Development": 0,
      "Java Development": 0,
      "Android Development": 0,
      "iOS Development": 0,
      "UI/UX Development": 0
    };
    // DevOps keywords with weights
const devopsKeywords = [
  { words: ['devops engineer', 'devops specialist', 'site reliability engineer', 'sre', 'cloud engineer', 'infrastructure engineer'], weight: 5 },
  { words: ['docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'puppet', 'chef'], weight: 4 },
  { words: ['ci/cd', 'continuous integration', 'continuous deployment', 'pipeline', 'automation'], weight: 4 },
  { words: ['aws', 'azure', 'gcp', 'google cloud', 'cloud computing', 'infrastructure as code'], weight: 3 },
  { words: ['monitoring', 'prometheus', 'grafana', 'elk stack', 'logging', 'alerting'], weight: 3 },
  { words: ['containerization', 'orchestration', 'microservices', 'service mesh', 'istio'], weight: 2 }
];
    // Data Science keywords with weights
    const dataKeywords = [

      { words: ['data scientist', 'data science', 'machine learning engineer', 'ml engineer', 'ai engineer'], weight: 5 },
      { words: ['python', 'r programming', 'sql', 'pandas', 'numpy', 'scikit-learn'], weight: 3 },
      { words: ['tensorflow', 'pytorch', 'keras', 'machine learning', 'deep learning'], weight: 4 },
      { words: ['statistics', 'statistical analysis', 'data analysis', 'data mining'], weight: 3 },
      { words: ['jupyter', 'anaconda', 'matplotlib', 'seaborn', 'plotly'], weight: 2 },
      { words: ['big data', 'hadoop', 'spark', 'etl', 'data warehouse'], weight: 2 }
    ];
    
    // Frontend keywords
    const frontendKeywords = [
      { words: ['frontend developer', 'front-end developer', 'ui developer', 'react developer'], weight: 5 },
      { words: ['react', 'angular', 'vue.js', 'javascript', 'typescript'], weight: 4 },
      { words: ['html', 'css', 'sass', 'bootstrap', 'tailwind'], weight: 3 },
      { words: ['webpack', 'vite', 'npm', 'yarn', 'redux'], weight: 2 }
    ];
    
    // Full Stack keywords
    const fullStackKeywords = [
      { words: ['full stack developer', 'fullstack developer', 'full-stack'], weight: 5 },
      { words: ['node.js', 'express', 'mongodb', 'postgresql', 'mysql'], weight: 4 },
      { words: ['rest api', 'graphql', 'microservices', 'docker'], weight: 3 },
      { words: ['aws', 'azure', 'cloud', 'deployment'], weight: 2 }
    ];
    
    // Java keywords
    const javaKeywords = [
      { words: ['java developer', 'java engineer', 'backend developer'], weight: 5 },
      { words: ['java', 'spring boot', 'spring framework', 'hibernate'], weight: 4 },
      { words: ['maven', 'gradle', 'junit', 'microservices'], weight: 3 }
    ];
    
    // Android keywords
    const androidKeywords = [
      { words: ['android developer', 'mobile developer', 'android engineer'], weight: 5 },
      { words: ['kotlin', 'android studio', 'java', 'flutter'], weight: 4 },
      { words: ['firebase', 'room database', 'retrofit'], weight: 3 }
    ];
    
    // iOS keywords
    const iosKeywords = [
      { words: ['ios developer', 'swift developer', 'mobile developer'], weight: 5 },
      { words: ['swift', 'objective-c', 'xcode', 'swiftui'], weight: 4 },
      { words: ['core data', 'uikit', 'cocoapods'], weight: 3 }
    ];
    
    // UI/UX keywords
    const uiuxKeywords = [
      { words: ['ui designer', 'ux designer', 'product designer', 'graphic designer'], weight: 5 },
      { words: ['figma', 'adobe xd', 'sketch', 'photoshop'], weight: 4 },
      { words: ['wireframe', 'prototype', 'user research', 'design system'], weight: 3 }
    ];
    
    // Calculate scores for each field
    const keywordSets = {
      "DevOps": devopsKeywords,
      "Data Science": dataKeywords,
      "Frontend Development": frontendKeywords,
      "Full Stack Development": fullStackKeywords,
      "Java Development": javaKeywords,
      "Android Development": androidKeywords,
      "iOS Development": iosKeywords,
      "UI/UX Development": uiuxKeywords
    };
    
    // Score each field based on keyword matches
    Object.entries(keywordSets).forEach(([field, keywords]) => {
      keywords.forEach(({ words, weight }) => {
        words.forEach(word => {
          if (combinedJobText.includes(word)) {
            fieldScores[field] += weight;
            console.log(`Found "${word}" for ${field}, adding ${weight} points`);
          }
        });
      });
    });
    
    // Find the field with highest score
    let maxScore = 0;
    Object.entries(fieldScores).forEach(([field, score]) => {
      console.log(`${field}: ${score} points`);
      if (score > maxScore) {
        maxScore = score;
        jobField = field;
      }
    });
    
    // If no clear winner or very low score, do fallback detection
    if (maxScore < 3) {
      console.log("Low confidence in field detection, using fallback logic");
      if (combinedJobText.includes('devops') || combinedJobText.includes('sre') || 
        combinedJobText.includes('site reliability') || combinedJobText.includes('infrastructure') ||
        combinedJobText.includes('ci/cd') || combinedJobText.includes('docker') ||
        combinedJobText.includes('kubernetes') || combinedJobText.includes('jenkins')) {
        jobField = "DevOps";
}
      if (combinedJobText.includes('data') || combinedJobText.includes('analyst') || 
          combinedJobText.includes('scientist') || combinedJobText.includes('python') ||
          combinedJobText.includes('machine learning') || combinedJobText.includes('statistics')) {
        jobField = "Data Science";
      } else if (combinedJobText.includes('react') || combinedJobText.includes('frontend') || 
                 combinedJobText.includes('javascript') || combinedJobText.includes('html')) {
        jobField = "Frontend Development";
      } else if (combinedJobText.includes('full stack') || combinedJobText.includes('node') || 
                 combinedJobText.includes('backend')) {
        jobField = "Full Stack Development";
      } else if (combinedJobText.includes('java') && !combinedJobText.includes('javascript')) {
        jobField = "Java Development";
      } else if (combinedJobText.includes('android') || combinedJobText.includes('mobile')) {
        jobField = "Android Development";
      } else if (combinedJobText.includes('ios') || combinedJobText.includes('swift')) {
        jobField = "iOS Development";
      } else if (combinedJobText.includes('design') || combinedJobText.includes('ui') || 
                 combinedJobText.includes('ux')) {
        jobField = "UI/UX Development";
      } else {
        jobField = "Full Stack Development"; // Default fallback
      }
    }
    
    console.log(`Final detected job field: ${jobField} (score: ${maxScore})`);

    const fieldCourses = courseRecommendations[jobField] || [];
    
    // Get random videos
    const randomResumeVideo = resumeVideos[Math.floor(Math.random() * resumeVideos.length)];
    const randomInterviewVideo = interviewVideos[Math.floor(Math.random() * interviewVideos.length)];

    console.log("Saving to database...");

    // Save job-specific analysis to database
    try {
      const resumeAnalysis = await db.jobSpecificAnalysis.create({
        data: {
          userId: user.id,
          jobDescription: jobDescription,
          jobTitle: jobAnalysis.jobInfo?.jobTitle || "Unknown Position",
          companyName: jobAnalysis.jobInfo?.company || "Unknown Company",
          overallScore: parseFloat(jobAnalysis.overallScore) || 0,
          skillsMatch: parseFloat(jobAnalysis.detailedScoring?.skillsMatch) || 0,
          experienceMatch: parseFloat(jobAnalysis.detailedScoring?.experienceRelevance) || 0,
          educationMatch: parseFloat(jobAnalysis.detailedScoring?.educationMatch) || 0,
          keywordOptimization: parseFloat(jobAnalysis.keywordOptimization?.atsCompatibility) || 0,
          requiredSkillsFound: jobAnalysis.skillsAnalysis?.requiredSkillsFound || [],
          requiredSkillsMissing: jobAnalysis.skillsAnalysis?.requiredSkillsMissing || [],
          preferredSkillsFound: jobAnalysis.skillsAnalysis?.preferredSkillsFound || [],
          preferredSkillsMissing: jobAnalysis.skillsAnalysis?.preferredSkillsMissing || [],
          additionalSkills: jobAnalysis.skillsAnalysis?.additionalSkills || [],
          experienceAlignment: jobAnalysis.experienceAnalysis?.meetsCriteria || false,
          candidateExperience: jobAnalysis.experienceAnalysis?.candidateExperience || "Unknown",
          requiredExperience: jobAnalysis.experienceAnalysis?.requiredExperience || "Unknown",
          relevantExperience: jobAnalysis.experienceAnalysis?.relevantExperience || [],
          experienceGaps: jobAnalysis.experienceAnalysis?.experienceGaps || [],
          strengthsForRole: jobAnalysis.strengthsForThisRole || [],
          weaknessesForRole: jobAnalysis.weaknessesForThisRole || [],
          competitiveAdvantage: jobAnalysis.competitiveAdvantage || [],
          redFlags: jobAnalysis.redFlags || [],
          recommendedImprovements: jobAnalysis.improvementSuggestions?.map(imp => imp.suggestion) || [],
          missingSkills: jobAnalysis.skillsAnalysis?.requiredSkillsMissing || [],
          interviewPreparation: jobAnalysis.interviewReadiness?.areasToFocus || [],
          overallAssessment: jobAnalysis.overallAssessment || "No assessment available",
          hiringRecommendation: jobAnalysis.overallScore >= 80 ? "Strong Match" : 
                               jobAnalysis.overallScore >= 60 ? "Good Match" : 
                               jobAnalysis.overallScore >= 40 ? "Weak Match" : "Not Suitable"
        }
      });

      console.log("Analysis saved successfully:", resumeAnalysis.id);
    } catch (dbError) {
      console.error("Database save error:", dbError);
      console.error("Full error details:", JSON.stringify(dbError, null, 2));
      
      // Try with only the required fields from your schema
      try {
        console.log("Trying to save with minimal fields...");
        const resumeAnalysis = await db.jobSpecificAnalysis.create({
          data: {
            userId: user.id,
            jobDescription: jobDescription,
            jobTitle: jobAnalysis.jobInfo?.jobTitle || "Unknown Position", 
            companyName: jobAnalysis.jobInfo?.company || "Unknown Company",
            overallScore: parseFloat(jobAnalysis.overallScore) || 0,
            skillsMatch: parseFloat(jobAnalysis.detailedScoring?.skillsMatch) || 0,
            experienceMatch: parseFloat(jobAnalysis.detailedScoring?.experienceRelevance) || 0,
            missingSkills: jobAnalysis.skillsAnalysis?.requiredSkillsMissing || [],
            recommendedImprovements: jobAnalysis.improvementSuggestions?.map(imp => imp.suggestion) || [],
            strengthsForRole: jobAnalysis.strengthsForThisRole || [],
            weaknessesForRole: jobAnalysis.weaknessesForThisRole || []
          }
        });
        console.log("Minimal save successful:", resumeAnalysis.id);
      } catch (minimalError) {
        console.error("Even minimal save failed:", minimalError);
        console.log("Continuing without database save...");
      }
    }

    return {
      success: true,
      analysis: {
        id: Math.random().toString(36).substr(2, 9), // Generate temporary ID if DB save failed
        analysisType: "job-specific",
        basicInfo: {
          name: extractedInfo.name,
          email: extractedInfo.email,
          phone: extractedInfo.phone
        },
        skills: extractedInfo.skills,
        projects: extractedInfo.projects,
        education: extractedInfo.education,
        jobInfo: jobAnalysis.jobInfo,
        overallScore: jobAnalysis.overallScore,
        detailedScoring: jobAnalysis.detailedScoring,
        skillsAnalysis: jobAnalysis.skillsAnalysis,
        experienceAnalysis: jobAnalysis.experienceAnalysis,
        strengthsForThisRole: jobAnalysis.strengthsForThisRole,
        weaknessesForThisRole: jobAnalysis.weaknessesForThisRole,
        improvementSuggestions: jobAnalysis.improvementSuggestions,
        keywordOptimization: jobAnalysis.keywordOptimization,
        competitiveAdvantage: jobAnalysis.competitiveAdvantage,
        redFlags: jobAnalysis.redFlags,
        interviewReadiness: jobAnalysis.interviewReadiness,
        overallAssessment: jobAnalysis.overallAssessment,
        recommendedCourses: fieldCourses,
        resumeVideo: randomResumeVideo,
        interviewVideo: randomInterviewVideo
      }
    };
  } catch (error) {
    console.error("Error analyzing resume with job description:", error || "Unknown error");
    return { 
      success: false, 
      error: "Failed to analyze resume: " + (error?.message || "Unknown error occurred")
    };
  }
}

export async function getResumeAnalyses() {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const analyses = await db.resumeAnalysis.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, analyses };
  } catch (error) {
    console.error("Error fetching resume analyses:", error);
    return { success: false, error: "Failed to fetch resume analyses" };
  }
}

export async function getJobSpecificAnalyses() {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const analyses = await db.jobSpecificAnalysis.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, analyses };
  } catch (error) {
    console.error("Error fetching job-specific analyses:", error);
    return { success: false, error: "Failed to fetch job-specific analyses" };
  }
}

export async function getResumeAnalysis(id) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const analysis = await db.resumeAnalysis.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!analysis) {
      return { success: false, error: "Analysis not found" };
    }

    return { success: true, analysis };
  } catch (error) {
    console.error("Error fetching resume analysis:", error);
    return { success: false, error: "Failed to fetch resume analysis" };
  }
}

export async function deleteResumeAnalysis(id) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await db.resumeAnalysis.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting resume analysis:", error);
    return { success: false, error: "Failed to delete resume analysis" };
  }
}