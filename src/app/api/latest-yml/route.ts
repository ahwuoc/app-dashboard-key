import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Version } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const data = await Version.findOne().sort({ updatedAt: -1 });
        
        if (!data) {
            return new NextResponse('No version found', { status: 404 });
        }

        const fileName = data.url.split('/').pop() || 'update.exe';
        
        const ymlContent = `version: ${data.version}
files:
  - url: ${fileName}
    sha512: ${data.sha512 || ''}
    size: ${data.size || 0}
path: ${fileName}
sha512: ${data.sha512 || ''}
releaseDate: ${data.updatedAt.toISOString()}
`;

        return new NextResponse(ymlContent, {
            headers: {
                'Content-Type': 'text/yaml',
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (err: any) {
        return new NextResponse(err.message, { status: 500 });
    }
}
