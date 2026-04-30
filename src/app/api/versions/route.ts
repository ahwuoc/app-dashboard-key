import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Version } from '@/lib/models';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function GET(request: Request) {
    const secret = request.headers.get('x-admin-secret');
    if (secret !== ADMIN_SECRET) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await connectDB();
        const versions = await Version.find().sort({ updatedAt: -1 });
        return NextResponse.json(versions);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

