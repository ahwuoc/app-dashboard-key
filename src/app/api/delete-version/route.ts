import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Version } from '@/lib/models';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';


const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
    try {
        const { id, secret } = await request.json();

        if (secret !== ADMIN_SECRET) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectDB();

        const versionData = await Version.findById(id);
        if (versionData && versionData.url.startsWith('/api/download/')) {
            const fileName = versionData.url.split('/').pop();
            if (fileName) {
                const db = mongoose.connection.db;
                if (db) {
                    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
                    const files = await bucket.find({ filename: fileName }).toArray();
                    for (const file of files) {
                        try {
                            await bucket.delete(file._id);
                        } catch (e) {
                            console.error("Error deleting GridFS file:", e);
                        }
                    }
                }
            }
        }
        await Version.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

