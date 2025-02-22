import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use a proper temporary directory
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
    
    // Write the file temporarily
    await fs.writeFile(tempFilePath, buffer);

    // Extract text based on file type
    let extractedText = '';
    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'pdf') {
      // Use the buffer directly for pdf-parse
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (fileType === 'docx') {
      // Use the temp file path for mammoth
      const result = await mammoth.extractRawText({ path: tempFilePath });
      extractedText = result.value;
    } else {
      // Clean up before returning error
      await fs.unlink(tempFilePath);
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }

    // Clean up the temporary file
    await fs.unlink(tempFilePath);

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 });
  }
}