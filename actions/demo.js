"use server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { extractTextFromPDF } from "../lib/pdf-utils";
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile } from 'fs/promises';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Course recommendations based on field
const courseRecommendations = {
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
  "Web Development": [
    ['Django Crash course [Free]','https://youtu.be/e1IyzVyrLSU'],
  ['Python and Django Full Stack Web Developer Bootcamp','https://www.udemy.com/course/python-and-django-full-stack-web-developer-bootcamp'],
  ['React Crash Course [Free]','https://youtu.be/Dorf8i6lCuk'],
  ['ReactJS Project Development Training','https://www.dotnettricks.com/training/masters-program/reactjs-certification-training'],
  ['Full Stack Web Developer - MEAN Stack','https://www.simplilearn.com/full-stack-web-developer-mean-stack-certification-training'],
  ['Node.js and Express.js [Free]','https://youtu.be/Oe421EPjeBE'],
  ['Flask: Develop Web Applications in Python','https://www.educative.io/courses/flask-develop-web-applications-in-python'],
  ['Full Stack Web Developer by Udacity','https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044'],
  ['Front End Web Developer by Udacity','https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011'],
  ['Become a React Developer by Udacity','https://www.udacity.com/course/react-nanodegree--nd019']],
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
  "UI/UX Development": [['Google UX Design Professional Certificate','https://www.coursera.org/professional-certificates/google-ux-design'],
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
const interviewVideos = [
  "https://www.youtube.com/watch?v=DSNdeLYxE2Y", // Tech interview preparation
  "https://www.youtube.com/watch?v=1lL2b-V4wk4", // How to nail a coding interview
  "https://www.youtube.com/watch?v=bZpf8aKBWzM", // 5 things to avoid in tech interviews
  "https://www.youtube.com/watch?v=4tYoVx0QoN0", // Common behavioral questions
  "https://www.youtube.com/watch?v=09_LlHjoEiY"  // Mock interview example
];
const resumeVideos = [
  "https://www.youtube.com/watch?v=UeMmCex9uTU", // Resume mistakes to avoid
  "https://www.youtube.com/watch?v=Tt08KmFfIYQ", // ATS optimization tips
  "https://www.youtube.com/watch?v=HQqqQx5BCFY", // Resume formatting tips
  "https://www.youtube.com/watch?v=y8YH0Qbu5h4", // How to write a tech resume
  "https://www.youtube.com/watch?v=B8xLCKbVCJw"  // Resume for career changers
];
export async function analyzeResume(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    // Get the uploaded file
    const file = formData.get("resume");
    if (!file) throw new Error("No file uploaded");

    // Save the file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `resume-${uuidv4()}.pdf`;
    const filepath = join(tmpdir(), filename);
    await writeFile(filepath, buffer);

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(filepath);
    if (!resumeText) throw new Error("Could not extract text from PDF");

    // Get number of pages
    const pageCount = await getPageCount(filepath);

    // Analyze the resume content using Gemini
    const basicAnalysisPrompt = `
      Analyze the following resume content and provide structured information:
      
      Resume Content:
      ${resumeText}
      
      Return a JSON object with the following information:
      1. Basic info (name, email, phone, location, LinkedIn, website)
      2. Experience level (Fresher, Intermediate, Experienced) based on content and the fact that this resume is ${pageCount} pages long
      3. Predicted field (e.g. Data Science, Web Development, UI/UX, etc.)
      4. Skills detected in the resume
      5. Sections present in the resume (boolean values for: objective, summary, experience, education, skills, projects, achievements, certifications, languages, interests, volunteer, publications, references, declaration, hobbies)
      
      Format the response as a valid JSON object without any additional text.
    `;

    const advancedAnalysisPrompt = `
      Analyze the following resume for ATS optimization and improvement opportunities:
      
      Resume Content:
      ${resumeText}
      
      The person works in the ${user.industry || "technology"} industry.
      
      Return a JSON object with the following information:
      1. Resume score (0-100) based on content, format, and completeness
      2. ATS score (0-100) based on keyword optimization, formatting, and readability
      3. List of improvement tips, each with a title, description, and severity (high, medium, low)
      4. ATS optimization tips, each with title, description, and status (pass/fail)
      5. Keyword optimization with score, industry keywords list, matched keywords list, and missing keywords list
      6. Recommendations for skills to add based on industry standards
      7. Skill gap analysis with categories, coverage percentage, and missing skills per category
      8. Technical resume tips with specific actionable advice
      9. General resume tips for structure, formatting, and content
      
      Format the response as a valid JSON object without any additional text.
    `;

    const [basicAnalysisResult, advancedAnalysisResult] = await Promise.all([
      model.generateContent(basicAnalysisPrompt),
      model.generateContent(advancedAnalysisPrompt)
    ]);

    const basicAnalysis = JSON.parse(basicAnalysisResult.response.text());
    const advancedAnalysis = JSON.parse(advancedAnalysisResult.response.text());

    // Calculate resume tips score based on sections present
    let resumeTipsScore = 0;
    const sections = basicAnalysis.sections;
    
    if (sections.objective) resumeTipsScore += 20;
    if (sections.declaration) resumeTipsScore += 20;
    if (sections.hobbies || sections.interests) resumeTipsScore += 20;
    if (sections.achievements) resumeTipsScore += 20;
    if (sections.projects) resumeTipsScore += 20;

    // Get recommended courses based on predicted field
    const predictedField = basicAnalysis.predictedField;
    const recommendedCourses = courseRecommendations[predictedField] || courseRecommendations["Data Science"];

    // Get random interview and resume tips videos
    const randomInterviewVideo = interviewVideos[Math.floor(Math.random() * interviewVideos.length)];
    const randomResumeVideo = resumeVideos[Math.floor(Math.random() * resumeVideos.length)];

    // Store analysis in database
    await db.resumeAnalysis.create({
      data: {
        userId: user.id,
        content: resumeText,
        score: advancedAnalysis.resumeScore,
        atsScore: advancedAnalysis.atsScore,
        experienceLevel: basicAnalysis.experienceLevel,
        predictedField: basicAnalysis.predictedField,
        pages: pageCount,
        basicInfo: basicAnalysis.basicInfo,
        skills: {
          detected: basicAnalysis.skills,
          recommended: advancedAnalysis.recommendedSkills,
          gap: advancedAnalysis.skillGapAnalysis
        },
        sections: basicAnalysis.sections,
        improvementTips: advancedAnalysis.improvementTips,
        atsTips: advancedAnalysis.atsTips,
        keywordOptimization: advancedAnalysis.keywordOptimization,
        recommendations: {
          courses: recommendedCourses,
          careerPaths: advancedAnalysis.recommendations?.careerPaths || [],
          interviewVideo: randomInterviewVideo,
          resumeVideo: randomResumeVideo
        }
      }
    });

    revalidatePath("/resume/analyzer");

    // Return the analysis results
    return {
      basicInfo: basicAnalysis.basicInfo,
      experienceLevel: basicAnalysis.experienceLevel,
      predictedField: basicAnalysis.predictedField,
      pages: pageCount,
      resumeTipsScore: resumeTipsScore,
      score: advancedAnalysis.resumeScore,
      atsScore: advancedAnalysis.atsScore,
      skills: {
        detected: basicAnalysis.skills,
        recommended: advancedAnalysis.recommendedSkills,
        gap: advancedAnalysis.skillGapAnalysis
      },
      sections: basicAnalysis.sections,
      improvementTips: advancedAnalysis.improvementTips,
      atsTips: advancedAnalysis.atsTips,
      keywordOptimization: advancedAnalysis.keywordOptimization,
      recommendations: {
        courses: recommendedCourses,
        careerPaths: advancedAnalysis.recommendations?.careerPaths || [],
        interviewVideo: randomInterviewVideo,
        resumeVideo: randomResumeVideo
      },
      tips: {
        technical: advancedAnalysis.technicalResumeTips || [],
        general: advancedAnalysis.generalResumeTips || []
      }
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume");
  }
}
async function getPageCount(filePath) {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const fileBuffer = await import('fs').then(fs => fs.promises.readFile(filePath));
    const pdfDoc = await PDFDocument.load(fileBuffer);
    return pdfDoc.getPageCount();
  } catch (error) {
    console.error("Error counting PDF pages:", error);
    return 1; // Default to 1 page if count fails
  }
}
 