import { NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== ADMIN_SECRET) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const ymlPath = path.join(process.cwd(), 'public', 'download', 'latest.yml');
        const content = await readFile(ymlPath, 'utf-8');
        return NextResponse.json({ content });
    } catch (err: any) {
        return NextResponse.json({ content: '' });
    }
}
