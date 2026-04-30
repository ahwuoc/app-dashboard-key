import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Version } from '@/lib/models';
import path from 'path';
import { writeFile, readFile, stat } from 'fs/promises';
import { mkdir } from 'fs/promises';
import crypto from 'crypto';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
    try {
        const { secret } = await request.json();
        if (secret !== ADMIN_SECRET) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectDB();
        const data = await Version.findOne().sort({ _id: -1 });
        if (!data) return NextResponse.json({ error: 'No version data' }, { status: 404 });

        let sha512 = '';
        let size = 0;
        const fileName = data.url.split('/').pop() || 'update.exe';

        const db = mongoose.connection.db;
        if (!db) throw new Error("Database connection not ready");
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

        const files = await bucket.find({ filename: fileName }).toArray();
        if (files.length > 0) {
            const file = files[0];
            size = file.length;

            const downloadStream = bucket.openDownloadStreamByName(fileName);
            const chunks: Buffer[] = [];
            for await (const chunk of downloadStream) {
                chunks.push(chunk);
            }
            const fileBuffer = Buffer.concat(chunks);
            sha512 = crypto.createHash('sha512').update(fileBuffer).digest('base64');
        } else if (!data.url.startsWith('http')) {
            // Local file (Legacy path)
            // Clean up the path (remove leading slashes or /api/ prefixes for local search)
            let localRelativePath = data.url.replace(/^\/?(api\/)?(download\/)?/, '');
            const filePath = path.join(process.cwd(), 'public', 'download', localRelativePath);
            try {
                const fileBuffer = await readFile(filePath);
                sha512 = crypto.createHash('sha512').update(fileBuffer).digest('base64');
                size = (await stat(filePath)).size;
            } catch (err) {
                // If still not found, we'll just have empty hash
            }
        }


        const ymlContent = `version: ${data.version}
files:
  - url: ${fileName}
    sha512: ${sha512}
    size: ${size}
path: ${fileName}
sha512: ${sha512}
releaseDate: ${new Date().toISOString()}
`;

        return NextResponse.json({ success: true, content: ymlContent });

    } catch (err: any) {
        console.error("Generate YML error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


