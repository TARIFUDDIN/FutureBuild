import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Helper function to analyze resume text
function analyzeResume(text, fileType) {
  let atsScore = 65; 
  
  const structureIssues = [];
  const contentSuggestions = [];
  const missingKeywords = [];
  const actionItems = [];

  if (fileType === 'pdf') {
    structureIssues.push("Resume is a PDF, not a text file, making it unreadable by many ATS systems.");
    actionItems.push("Convert the resume to a plain text format (.txt or .docx).");
    atsScore -= 10;
  }
  if (!text.toLowerCase().includes('summary') && !text.toLowerCase().includes('objective')) {
    structureIssues.push("Lack of a clear and concise summary/objective statement.");
    contentSuggestions.push("Add a compelling summary/objective statement highlighting relevant skills and experience for your target position.");
    actionItems.push("Craft a strong summary/objective statement highlighting your key skills.");
    atsScore -= 5;
  }
  
  if (text.includes('  ') || text.split('\n\n\n').length > 3) {
    structureIssues.push("Inconsistent formatting and spacing throughout the resume.");
    atsScore -= 5;
  }
  
  
  if (!text.match(/\d+%|increased|reduced|improved|generated|managed|\$\d+/gi)) {
    structureIssues.push("Project descriptions are weak and lack quantifiable achievements.");
    contentSuggestions.push("Quantify achievements in each project, using numbers and data to showcase impact.");
    actionItems.push("Rewrite project descriptions with quantifiable achievements and relevant keywords.");
    atsScore -= 10;
  }
  

  if (!text.toLowerCase().includes('skills:') && !text.toLowerCase().includes('skills section')) {
    structureIssues.push("No clear delineation of skills, only links to online profiles.");
    contentSuggestions.push("Create a dedicated 'Skills' section that explicitly lists relevant keywords for your industry.");
    actionItems.push("Develop a dedicated 'Skills' section with all necessary keywords.");
    atsScore -= 10;
  }
  

  const commonKeywords = [
    'JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'Java', 'SQL', 
    'API', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Agile', 'Scrum'
  ];
  
  commonKeywords.forEach(keyword => {
    if (!text.toLowerCase().includes(keyword.toLowerCase())) {
      missingKeywords.push(keyword);
    }
  });
  
  if (missingKeywords.length > 0) {
    atsScore -= Math.min(missingKeywords.length * 2, 15); // Deduct up to 15 points
  }
  
  // Additional content suggestions
  contentSuggestions.push(
    "Use action verbs to start each bullet point in the work experience section.",
    "Proofread carefully for any grammatical errors and typos.",
    "Tailor the resume to the specific requirements of each job description."
  );
  
  // Additional action items
  actionItems.push(
    "Proofread the entire resume for grammatical errors and typos.",
    "Tailor the resume to the specific job descriptions of target companies."
  );
  
  // Ensure the score stays within 0-100 range
  atsScore = Math.max(0, Math.min(100, atsScore));
  
  return {
    atsScore,
    structureIssues,
    contentSuggestions,
    missingKeywords,
    actionItems,
    rawText: text
  };
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
    
    await fs.writeFile(tempFilePath, buffer);
    
    let extractedText = '';
    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (fileType === 'pdf') {
      console.log('Processing PDF with pdf-parse, buffer length:', buffer.length);
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (fileType === 'docx') {
      console.log('Processing DOCX with mammoth, temp path:', tempFilePath);
      const result = await mammoth.extractRawText({ path: tempFilePath });
      extractedText = result.value;
    } else {
      await fs.unlink(tempFilePath);
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }
    
    await fs.unlink(tempFilePath);
    
    // Analyze the extracted text
    const analysisResult = analyzeResume(extractedText, fileType);
    
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 });
  }
}