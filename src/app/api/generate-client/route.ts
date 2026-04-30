import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { RequestLog, KeyRequest } from '@/lib/models';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { note } = body;

        const ip = request.headers.get('cf-connecting-ip') ||
            request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
            '127.0.0.1';

        await connectDB();
        await RequestLog.create({ ip, endpoint: '/generate-client' });

        const oneMinuteAgo = new Date(Date.now() - 60000);
        const recentAttemptsCount = await RequestLog.countDocuments({
            ip,
            endpoint: '/generate-client',
            timestamp: { $gt: oneMinuteAgo }
        });

        if (recentAttemptsCount > 2) {
            return NextResponse.json({ error: "Bạn đang yêu cầu quá nhanh. Vui lòng đợi 1 minute rồi thử lại." }, { status: 429 });
        }

        const tenMinutesAgo = new Date(Date.now() - 600000);
        const lastRequest = await KeyRequest.findOne({
            ip,
            status: 'PENDING',
            createdAt: { $gt: tenMinutesAgo }
        }).sort({ createdAt: -1 });

        let requestId;
        if (lastRequest) {
            requestId = lastRequest.requestId;
        } else {
            requestId = crypto.randomBytes(16).toString('hex');
            await KeyRequest.create({ requestId, ip, status: 'PENDING' });
        }
        const MY_STATIC_SHORTLINK = process.env.SHORTLINK || "https://link4m.com/go/wneiO";
        const shortLink = MY_STATIC_SHORTLINK;
        return NextResponse.json({
            success: true,
            shortLink: shortLink,
            requestId: requestId
        });
    } catch (err: any) {
        console.error('API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

