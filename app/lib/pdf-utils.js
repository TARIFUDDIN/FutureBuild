// File: app/lib/pdfUtils.js
// Note: moved to app directory to fix import issues
import pdfParse from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';

/**
 * Extract text from a PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<{text: string, pages: number}>} - Extracted text and page count
 */
export async function extractTextFromPDF(buffer) {
  try {
    // Extract text
    const pdfData = await pdfParse(buffer);
    let text = pdfData.text;
    
    // Get page count
    const pdfDoc = await PDFDocument.load(buffer);
    const pageCount = pdfDoc.getPageCount();
    
    // Clean the text
    text = cleanResumeText(text);
    
    return {
      text,
      pages: pageCount
    };
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(error.message || "Failed to extract text from PDF");
  }
}

/**
 * Clean up extracted resume text
 * @param {string} text - Raw extracted text
 * @returns {string} - Cleaned text
 */
function cleanResumeText(text) {
  if (!text) return "";
  
  // Replace multiple newlines with a single one
  let cleaned = text.replace(/\n{3,}/g, '\n\n');
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  // Fix common PDF extraction issues
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between lowercase and uppercase letters
  
  // Remove any non-printable characters
  cleaned = cleaned.replace(/[^\x20-\x7E\n]/g, '');
  
  return cleaned.trim();
}