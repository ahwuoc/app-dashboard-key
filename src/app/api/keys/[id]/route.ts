import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Key } from '@/lib/models';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { note, expiresAt, hwid, secret } = body;

        if (secret !== ADMIN_SECRET) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updates: any = {};
        if (note !== undefined) updates.note = note;
        if (expiresAt !== undefined) updates.expiresAt = new Date(expiresAt);
        if (hwid !== undefined) updates.hwid = hwid;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ success: true, message: 'No changes' });
        }

        await connectDB();
        await Key.findByIdAndUpdate(id, updates);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { secret } = body;

        if (secret !== ADMIN_SECRET) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectDB();
        await Key.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


// Add a POST method just in case because the old backend used POST /delete and POST /update
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // This is a bit of a hack to support the old client-side calls if they use POST to /[id]
    // But the current frontend uses POST /delete and POST /update with ID in body.
    // I should probably create /api/delete and /api/update routes too to be fully compatible.
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
