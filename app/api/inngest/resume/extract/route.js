import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export async function POST(request) {
  let tempFilePath = null;
  
  try {
    const data = await request.formData();
    const file = data.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Get file type
    const fileType = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(fileType)) {
      return NextResponse.json({ error: `Unsupported file format: ${fileType}` }, { status: 400 });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Extract text based on file type
    let extractedText = '';
    
    if (fileType === 'pdf') {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return NextResponse.json({ 
          error: 'Failed to parse PDF', 
          details: pdfError.message 
        }, { status: 422 });
      }
    } else if (fileType === 'docx') {
      // Save file temporarily using os.tmpdir() for cross-platform compatibility
      tempFilePath = path.join(os.tmpdir(), `tmp-${Date.now()}-${file.name}`);
      await fs.writeFile(tempFilePath, buffer);
      
      try {
        const result = await mammoth.extractRawText({ path: tempFilePath });
        extractedText = result.value;
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        return NextResponse.json({ 
          error: 'Failed to parse DOCX', 
          details: docxError.message 
        }, { status: 422 });
      }
    }
    
    return NextResponse.json({ text: extractedText });
    
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json({ 
      error: 'Failed to extract text', 
      details: error.message,
      code: error.code 
    }, { status: 500 });
  } finally {
    // Clean up temp file if it exists
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Failed to clean up temp file:', cleanupError);
      }
    }
  }
}