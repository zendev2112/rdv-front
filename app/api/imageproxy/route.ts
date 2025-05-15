import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the URL from the query parameter
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }
  
  try {
    // Custom headers to avoid CORS issues
    const headers = new Headers();
    headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    headers.append('Referer', 'https://www.instagram.com/');
    headers.append('Origin', 'https://www.instagram.com');
    
    // Fetch the image with custom headers
    const response = await fetch(url, { 
      headers,
      cache: 'force-cache' // Cache the response to avoid multiple requests
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      return new NextResponse('Failed to fetch image', { status: response.status });
    }
    
    // Get the image data as an array buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Return the image with the same content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error in image proxy:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}