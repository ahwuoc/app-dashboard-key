import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { encrypt } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        await connectDB();
        const user = await User.findOne({ username, password });

        if (!user) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // Create the session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const session = await encrypt({ user: { id: user.id, username: user.username }, expires });

        const response = NextResponse.json({ success: true });
        response.cookies.set('session', session, { 
            expires, 
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: false
        });

        return response;
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

