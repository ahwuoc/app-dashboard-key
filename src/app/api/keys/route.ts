import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Key } from '@/lib/models';
import { decrypt } from '@/lib/auth-core';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function GET(request: Request) {
    const secret = request.headers.get('x-admin-secret');
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/session=([^;]+)/);
    const session = sessionMatch ? sessionMatch[1] : null;

    let isAuthenticated = (ADMIN_SECRET && secret === ADMIN_SECRET);

    if (!isAuthenticated && session) {
        try {
            await decrypt(session);
            isAuthenticated = true;
        } catch (err) {
            isAuthenticated = false;
        }
    }

    if (!isAuthenticated) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await connectDB();
        const keys = await Key.find().sort({ createdAt: -1 });
        return NextResponse.json(keys);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}



