import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Key } from '@/lib/models';
import { decrypt } from '@/lib/auth-core';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
    try {
        const { id, secret } = await request.json();

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

        await connectDB();
        await Key.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

