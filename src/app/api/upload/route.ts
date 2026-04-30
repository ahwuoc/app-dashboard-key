import { NextResponse } from 'next/server';
import path from 'path';
import { mkdir, readdir, rename, rm, writeFile, readFile, stat } from 'fs/promises';
import { spawn } from 'child_process';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import { Version } from '@/lib/models';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export const maxDuration = 300;

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const secret = request.headers.get('x-admin-secret');
    if (secret !== ADMIN_SECRET) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const version = formData.get('version') as string;
        const note = formData.get('note') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        await connectDB();
        const db = mongoose.connection.db;
        if (!db) throw new Error("Database connection not ready");
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

        const fileName = file.name;
        let finalExeName = fileName;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const tempDir = path.join('/tmp', 'temp-upload');
        await mkdir(tempDir, { recursive: true });
        let finalBuffer = buffer;


        if (file.name.toLowerCase().endsWith('.zip')) {
            const zipPath = path.join(tempDir, fileName);
            await writeFile(zipPath, buffer);

            const extractDir = path.join(tempDir, `extract-${Date.now()}`);
            await mkdir(extractDir, { recursive: true });

            await new Promise((resolve, reject) => {
                const unzip = spawn('unzip', ['-o', zipPath, '-d', extractDir]);
                unzip.on('close', (code) => {
                    if (code === 0) resolve(null);
                    else reject(new Error(`Unzip failed with code ${code}`));
                });
            });

            const extractedFiles = await readdir(extractDir);
            const exeFile = extractedFiles.find(f => f.toLowerCase().endsWith('.exe'));

            if (exeFile) {
                finalExeName = exeFile;
                const exePath = path.join(extractDir, exeFile);
                finalBuffer = await readFile(exePath);
                await rm(extractDir, { recursive: true, force: true });
                await rm(zipPath, { force: true });
            } else {
                await rm(extractDir, { recursive: true, force: true });
                await rm(zipPath, { force: true });
                throw new Error("No .exe file found inside the ZIP archive");
            }
        }

        const existingFiles = await bucket.find({ filename: finalExeName }).toArray();
        for (const existingFile of existingFiles) {
            await bucket.delete(existingFile._id);
        }

        const uploadStream = bucket.openUploadStream(finalExeName);
        await new Promise((resolve, reject) => {
            uploadStream.on('error', reject);
            uploadStream.on('finish', resolve);
            uploadStream.end(finalBuffer);
        });

        const fileUrl = `/api/download/${finalExeName}`;

        const sha512 = crypto.createHash('sha512').update(finalBuffer).digest('base64');
        const fileSize = finalBuffer.length;

        if (version) {
            await Version.create({
                version,
                url: fileUrl,
                note: note || '',
                sha512,
                size: fileSize
            });
        }

        return NextResponse.json({
            success: true,
            url: fileUrl,
            version: version || '1.0.0',
            message: `Upload thành công vào MongoDB GridFS (Vercel Ready)`
        });

    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}





