import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth-core';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get('session')?.value;

    // Handle Dashboard Auth
    if (pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            await decrypt(session);
        } catch (err) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Handle API CORS
    const isApiRoute = pathname.startsWith('/api') || 
                       pathname === '/generate-client' || 
                       pathname === '/verify' || 
                       pathname === '/check-update';

    if (isApiRoute) {
        // Handle Preflight (OPTIONS)
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-requested-with',
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        const response = NextResponse.next();
        
        // Add CORS headers to all API responses
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
