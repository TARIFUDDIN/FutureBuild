
import { NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = path.join('/tmp', file.name);
    await fs.writeFile(tempFilePath, buffer);
    
    // Extract text based on file type
    let extractedText = '';
    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (fileType === 'pdf') {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (fileType === 'docx') {
      const result = await mammoth.extractRawText({ path: tempFilePath });
      extractedText = result.value;
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }
    
    // Delete temp file
    await fs.unlink(tempFilePath);
    
    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 });
  }
}