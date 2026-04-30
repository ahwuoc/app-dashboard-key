import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Version } from '@/lib/models';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
    try {
        const { version, url, note, secret } = await request.json();

        if (secret !== ADMIN_SECRET) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectDB();
        await Version.create({
            version,
            url,
            note: note || ''
        });

        return NextResponse.json({ success: true, version });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

