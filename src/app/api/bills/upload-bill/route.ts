import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Authorize the upload
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          tokenPayload: JSON.stringify({
            billType: 'utility', // Optional metadata you want to track
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Bill uploaded:', blob);
        try {
          // Handle post-upload actions here
        } catch (error) {
          throw new Error('Post-upload processing failed');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
