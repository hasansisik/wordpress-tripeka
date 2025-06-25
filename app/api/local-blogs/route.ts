import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read blog data from JSON file
    const filePath = path.join(process.cwd(), 'data/blog.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const blogs = JSON.parse(fileContents);
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching local blog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog data' },
      { status: 500 }
    );
  }
} 