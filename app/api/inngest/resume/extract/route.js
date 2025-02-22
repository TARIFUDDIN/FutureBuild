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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
    
    await fs.writeFile(tempFilePath, buffer);

    let extractedText = '';
    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'pdf') {
      console.log('Processing PDF with pdf-parse, buffer length:', buffer.length); // Debug
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (fileType === 'docx') {
      console.log('Processing DOCX with mammoth, temp path:', tempFilePath); // Debug
      const result = await mammoth.extractRawText({ path: tempFilePath });
      extractedText = result.value;
    } else {
      await fs.unlink(tempFilePath);
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }

    await fs.unlink(tempFilePath);

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 });
  }
}