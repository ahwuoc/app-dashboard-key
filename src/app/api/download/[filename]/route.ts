import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) throw new Error("Database connection not ready");
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

        const files = await bucket.find({ filename }).toArray();
        if (files.length === 0) {
            return new NextResponse('File not found', { status: 404 });
        }

        const file = files[0];
        const downloadStream = bucket.openDownloadStreamByName(filename);

        // Convert the stream to a readable stream for Next.js
        const stream = new ReadableStream({
            start(controller) {
                downloadStream.on('data', (chunk) => controller.enqueue(chunk));
                downloadStream.on('end', () => controller.close());
                downloadStream.on('error', (err) => controller.error(err));
            }
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': file.length.toString(),
            },
        });
    } catch (err: any) {
        return new NextResponse(err.message, { status: 500 });
    }
}
