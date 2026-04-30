import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Version } from '@/lib/models';
import { generateSignature } from '@/lib/crypto';

export async function GET() {
    try {
        await connectDB();
        const data = await Version.findOne().sort({ _id: -1 }).select('version url note');
        if (!data) return NextResponse.json({ error: 'No version info' }, { status: 404 });

        const dataObj = data.toObject();
        const signature = generateSignature(dataObj);
        return NextResponse.json({ ...dataObj, signature });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

