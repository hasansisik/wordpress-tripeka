import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read projects data from JSON file
    const filePath = path.join(process.cwd(), 'data/projects.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(fileContents);
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching local projects data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects data' },
      { status: 500 }
    );
  }
} 