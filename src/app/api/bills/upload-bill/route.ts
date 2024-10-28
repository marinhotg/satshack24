import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
                    tokenPayload: JSON.stringify({
                        billType: 'utility', 
                    }),
                };
            },
            onUploadCompleted: async ({ blob }) => {
                console.log('Bill uploaded:', blob);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}
