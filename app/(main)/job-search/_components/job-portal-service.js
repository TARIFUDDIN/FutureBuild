

export const JOB_SUGGESTIONS = [
  { id: "software-engineer", text: "Software Engineer" },
  { id: "data-scientist", text: "Data Scientist" },
  { id: "product-manager", text: "Product Manager" },
  { id: "ui-ux-designer", text: "UI/UX Designer" },
  { id: "frontend-developer", text: "Frontend Developer" },
  { id: "backend-developer", text: "Backend Developer" },
  { id: "full-stack-developer", text: "Full Stack Developer" },
  { id: "devops-engineer", text: "DevOps Engineer" },
  { id: "machine-learning-engineer", text: "Machine Learning Engineer" },
  { id: "business-analyst", text: "Business Analyst" },
  { id: "project-manager", text: "Project Manager" },
  { id: "qa-engineer", text: "QA Engineer" },
  { id: "android-developer", text: "Android Developer" },
  { id: "ios-developer", text: "iOS Developer" },
  { id: "data-analyst", text: "Data Analyst" },
  { id: "digital-marketing", text: "Digital Marketing" },
];

export const LOCATION_SUGGESTIONS = [
  { id: "bangalore", text: "Bangalore" },
  { id: "mumbai", text: "Mumbai" },
  { id: "delhi", text: "Delhi" },
  { id: "hyderabad", text: "Hyderabad" },
  { id: "chennai", text: "Chennai" },
  { id: "pune", text: "Pune" },
  { id: "kolkata", text: "Kolkata" },
  { id: "noida", text: "Noida" },
  { id: "gurgaon", text: "Gurgaon" },
  { id: "ahmedabad", text: "Ahmedabad" },
  { id: "remote", text: "Remote" },
];

export const EXPERIENCE_RANGES = [
  { id: "all", text: "All Levels" },
  { id: "0-1", text: "0-1 years" },
  { id: "1-3", text: "1-3 years" },
  { id: "3-5", text: "3-5 years" },
  { id: "5-7", text: "5-7 years" },
  { id: "7-10", text: "7-10 years" },
  { id: "10+", text: "10+ years" },
];

export const SALARY_RANGES = [
  { id: "all", text: "All Ranges" },
  { id: "0-3", text: "0-3 LPA" },
  { id: "3-6", text: "3-6 LPA" },
  { id: "6-10", text: "6-10 LPA" },
  { id: "10-15", text: "10-15 LPA" },
  { id: "15-25", text: "15-25 LPA" },
  { id: "25+", text: "25+ LPA" },
];

export const JOB_TYPES = [
  { id: "all", text: "All Types" },
  { id: "full-time", text: "Full Time" },
  { id: "part-time", text: "Part Time" },
  { id: "contract", text: "Contract" },
  { id: "remote", text: "Remote" },
  { id: "internship", text: "Internship" },
];


const extractTextValue = (input) => {
  // Case 1: Input is null or undefined
  if (input == null) {
    return '';
  }
  
  // Case 2: Input is a string
  if (typeof input === 'string') {
    // Check if it's the string "[object Object]" which indicates a stringified object
    return input === '[object Object]' ? '' : input;
  }
  
  // Case 3: Input is an object with a text property (like from a dropdown)
  if (typeof input === 'object' && 'text' in input) {
    return input.text;
  }
  
  // Case 4: Input is an object with an id property
  if (typeof input === 'object' && 'id' in input) {
    return input.id;
  }
  
  // Case 5: Fallback - try to stringify if possible, otherwise empty string
  try {
    return String(input);
  } catch (e) {
    return '';
  }
};

// Job portal configurations
export const JOB_PORTALS = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    color: "#0077B5",
    baseUrl: "https://www.linkedin.com/jobs/search/",
    buildUrl: (job, location, experience) => {
      const jobText = extractTextValue(job);
      const locationText = extractTextValue(location);
      const experienceText = extractTextValue(experience);

      if (!jobText) return "https://www.linkedin.com/jobs/";

      const keywords = encodeURIComponent(jobText);
      const locationParam = locationText ? `&location=${encodeURIComponent(locationText)}` : "";
      const experienceParam = experienceText ? `&f_E=${encodeURIComponent(experienceText)}` : "";
      return `https://www.linkedin.com/jobs/search/?keywords=${keywords}${locationParam}${experienceParam}`;
    },
  },
  {
    id: "indeed",
    name: "Indeed",
    icon: "search",
    color: "#003A9B",
    baseUrl: "https://in.indeed.com/",
    buildUrl: (job, location, experience) => {
      const jobText = extractTextValue(job);
      const locationText = extractTextValue(location);
      const experienceText = extractTextValue(experience);

      if (!jobText) return "https://in.indeed.com/";

      const keywords = encodeURIComponent(jobText);
      const locationParam = locationText ? `&l=${encodeURIComponent(locationText)}` : "";
      const experienceParam = experienceText ? `&explvl=${encodeURIComponent(experienceText)}` : "";
      return `https://in.indeed.com/jobs?q=${keywords}${locationParam}${experienceParam}`;
    },
  },
  {
    id: "naukri",
    name: "Naukri",
    icon: "briefcase",
    color: "#FF7555",
    baseUrl: "https://www.naukri.com/",
    buildUrl: (job, location, experience) => {
      const jobText = extractTextValue(job);
      const locationText = extractTextValue(location);
      const experienceText = extractTextValue(experience);

      if (!jobText) return "https://www.naukri.com/";

      const keywords = jobText.replace(/ /g, "-").toLowerCase();
      const locationParam = locationText ? `-in-${locationText.toLowerCase()}` : "";
      const experienceParam = experienceText ? `?experience=${encodeURIComponent(experienceText)}` : "";
      return `https://www.naukri.com/${keywords}-jobs${locationParam}${experienceParam}`;
    },
  },
    {
      id: "foundit",
      name: "foundit (Monster)",
      icon: "target",
      color: "#6401E1",
      baseUrl: "https://www.foundit.in/",
      buildUrl: (job, location, experience) => {
        const jobText = extractTextValue(job);
        const locationText = extractTextValue(location);
        const experienceText = extractTextValue(experience);
  
        if (!jobText) return "https://www.foundit.in/";
  
        // Encode job title and location
        const keywords = encodeURIComponent(jobText);
        const locationParam = locationText ? `&locations=${encodeURIComponent(locationText)}` : "";
        let experienceRangesParam = "";
        let experienceParam = "";
  
        if (experienceText) {
          const experienceMap = {
            "0-1": "0%7E0", 
            "1-3": "1%7E3", 
            "3-5": "3%7E5", 
            "5-7": "5%7E7", 
            "7-10": "7%7E10",
            "10+": "10%7E99",
          };
  
          experienceRangesParam = experienceMap[experienceText] || "";
          experienceParam = experienceText.split("-")[0]; // Use the lower bound for the "experience" parameter
        }
  
        // Construct the URL
        return `https://www.foundit.in/srp/results?query=${keywords}${locationParam}&experienceRanges=${experienceRangesParam}&experience=${experienceParam}`;
      },
    },

  {
    id: "instahyre",
    name: "Instahyre",
    icon: "zap",
    color: "#00A0DC",
    baseUrl: "https://www.instahyre.com/",
    buildUrl: (job, location) => {
      const jobText = extractTextValue(job);
      const locationText = extractTextValue(location);

      if (!jobText) return "https://www.instahyre.com/";

      const keywords = jobText.replace(/ /g, "-").toLowerCase();
      const locationParam = locationText ? `-in-${locationText.toLowerCase()}` : "";
      return `https://www.instahyre.com/${keywords}-jobs${locationParam}`;
    },
  },
  {
    id: "freshersworld",
    name: "Freshersworld",
    icon: "user-plus",
    color: "#FF6200",
    baseUrl: "https://www.freshersworld.com/",
    buildUrl: (job, location) => {
      const jobText = extractTextValue(job);
      const locationText = extractTextValue(location);

      if (!jobText) return "https://www.freshersworld.com/";

      const keywords = jobText.replace(/ /g, "-").toLowerCase();
      const locationParam = locationText ? `-in-${locationText.toLowerCase()}` : "";
      return `https://www.freshersworld.com/jobs/jobsearch/${keywords}-jobs${locationParam}`;
    },
  },
  {
    id: "internshala",
    name: "Internshala",
    icon: "graduation-cap",
    color: "#008BDC",
    baseUrl: "https://internshala.com/",
    buildUrl: (job, location) => {
      const jobText = extractTextValue(job);
      const locationText = extractTextValue(location);

      if (!jobText) return "https://internshala.com/";

      const keywords = jobText.replace(/ /g, "-").toLowerCase();
      const locationParam = locationText ? `&location=${encodeURIComponent(locationText)}` : "";
      return `https://internshala.com/internships/${keywords}${locationParam}`;
    },
  },
  {
    id: "glassdoor",
    name: "Glassdoor",
    icon: "door-open",
    color: "#0CAA41",
    baseUrl: "https://www.glassdoor.co.in/",
    buildUrl: (job, location) => {
      const jobText = extractTextValue(job);
      const locationText = extractTextValue(location);

      if (!jobText) return "https://www.glassdoor.co.in/";

      const keywords = encodeURIComponent(jobText);
      const locationParam = locationText ? `&locT=N&locId=0&locKeyword=${encodeURIComponent(locationText)}` : "";
      return `https://www.glassdoor.co.in/Job/index.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=${keywords}${locationParam}`;
    },
  },
  
  
];

export const searchJobsAcrossPortals = (jobTitle, location, experienceLevel, salaryRange, jobType) => {
  try {
    console.log('Raw inputs:', {
      jobTitle,
      location,
      experienceLevel,
      salaryRange,
      jobType
    });

    // Process the inputs to extract meaningful values
    const jobTitleText = extractTextValue(jobTitle);
    const locationText = extractTextValue(location);
    
    console.log('Processed inputs:', {
      jobTitle: jobTitleText,
      location: locationText,
      experienceLevel,
      salaryRange,
      jobType
    });

    if (!jobTitleText) {
      console.warn('Job title is empty or invalid after processing');
      return [];
    }
    
    return JOB_PORTALS.map(portal => {
      try {
        const url = portal.buildUrl(jobTitleText, locationText, experienceLevel);
        return {
          portalId: portal.id,
          portal: portal.name,
          title: `${jobTitleText} jobs${locationText ? ` in ${locationText}` : ""}`,
          url: url,
          icon: `fa fa-${portal.icon}`,
          color: portal.color,
        };
      } catch (err) {
        console.error(`Error generating URL for portal ${portal.name}:`, err);
        return {
          portalId: portal.id,
          portal: portal.name,
          title: `${jobTitleText} jobs`,
          url: portal.baseUrl,
          icon: `fa fa-${portal.icon}`,
          color: portal.color,
          error: true
        };
      }
    });
  } catch (err) {
    console.error('Error in searchJobsAcrossPortals:', err);
    return [];
  }
};

export const getFeaturedCompanies = (category = null) => {
  const companies = [
    {
      name: "Google",
      description: "Leading technology company specializing in search, cloud, and AI",
      icon: "fab fa-google",
      color: "#4285F4",
      careersUrl: "https://careers.google.com/",
      categories: ["tech", "global_corps", "ai"]
    },
    {
      name: "Microsoft",
      description: "Technology company developing software, hardware, and cloud services",
      icon: "fab fa-microsoft",
      color: "#00A4EF",
      careersUrl: "https://careers.microsoft.com/",
      categories: ["tech", "global_corps"]
    },
    {
      name: "Amazon",
      description: "E-commerce and cloud computing company with diverse operations",
      icon: "fab fa-amazon",
      color: "#FF9900",
      careersUrl: "https://www.amazon.jobs/",
      categories: ["tech", "global_corps", "ecommerce"]
    },
    {
      name: "Meta",
      description: "Social media and technology conglomerate focusing on metaverse",
      icon: "fab fa-facebook",
      color: "#1877F2",
      careersUrl: "https://www.metacareers.com/",
      categories: ["tech", "global_corps", "social_media"]
    },
    {
      name: "Infosys",
      description: "Indian IT services and consulting company",
      icon: "fas fa-building",
      color: "#007CC3",
      careersUrl: "https://www.infosys.com/careers/",
      categories: ["tech", "indian_tech", "it_services"]
    },
    {
      name: "TCS",
      description: "Largest Indian IT services and consulting company",
      icon: "fas fa-building",
      color: "#282828",
      careersUrl: "https://www.tcs.com/careers",
      categories: ["tech", "indian_tech", "it_services"]
    },
    {
      name: "Wipro",
      description: "Global IT consulting and services company",
      icon: "fas fa-leaf",
      color: "#0063AE",
      careersUrl: "https://careers.wipro.com/",
      categories: ["tech", "indian_tech", "it_services"]
    },
    {
      name: "HCL Technologies",
      description: "IT services and consulting company with global presence",
      icon: "fas fa-building",
      color: "#0062AC",
      careersUrl: "https://www.hcltech.com/careers",
      categories: ["tech", "indian_tech", "it_services"]
    },
    {
      name: "Accenture",
      description: "Global professional services company with expertise in digital, cloud and security",
      icon: "fas fa-greater-than",
      color: "#A100FF",
      careersUrl: "https://www.accenture.com/in-en/careers",
      categories: ["tech", "global_corps", "consulting"]
    },
    {
      name: "IBM",
      description: "Technology and consulting company specializing in AI and cloud computing",
      icon: "fab fa-ibm",
      color: "#1F70C1",
      careersUrl: "https://www.ibm.com/careers/",
      categories: ["tech", "global_corps"]
    }
  ];

  if (category) {
    return companies.filter(company => company.categories.includes(category));
  }
  
  return companies;
};