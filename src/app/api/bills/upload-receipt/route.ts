import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Validate that the user is allowed to upload
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          tokenPayload: JSON.stringify({
            maxSize: 5 * 1024 * 1024, // 5MB
            pathname,
          }),
        }
      },
      onUploadCompleted: async (upload) => {
        // Log the upload
        console.log('Upload completed:', upload);
      },
    });
    
    return NextResponse.json(jsonResponse);
  } catch (error) {
		console.error(error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}