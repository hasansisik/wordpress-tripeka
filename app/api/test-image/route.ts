import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  
  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
  }

  try {
    console.log('Testing image URL:', imageUrl)
    
    const response = await fetch(imageUrl, {
      method: 'HEAD', // Just check if the image exists
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-ImageTest/1.0)',
      },
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Image not accessible',
        status: response.status,
        statusText: response.statusText,
        url: imageUrl
      }, { status: response.status })
    }

    return NextResponse.json({ 
      success: true,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      url: imageUrl
    })
  } catch (error) {
    console.error('Error testing image:', error)
    return NextResponse.json({ 
      error: 'Failed to test image',
      message: error instanceof Error ? error.message : 'Unknown error',
      url: imageUrl
    }, { status: 500 })
  }
} 