import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Key } from '@/lib/models';
import crypto from 'crypto';
import { decrypt } from '@/lib/auth-core';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { days, note, secret } = body;

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

        const key = `FB-BOT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (days || 30));

        await connectDB();
        await Key.create({
            key,
            note: note || '',
            expiresAt
        });

        return NextResponse.json({ success: true, key, expiresAt: expiresAt.toISOString() });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

