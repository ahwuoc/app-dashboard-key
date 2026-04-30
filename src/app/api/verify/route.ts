import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Key } from '@/lib/models';
import { generateSignature } from '@/lib/crypto';

export async function POST(request: Request) {
    try {
        const { key, hwid } = await request.json();

        await connectDB();
        const row = await Key.findOne({ key });

        let responseData: any;
        if (!row) {
            responseData = { success: false, message: 'Key không tồn tại' };
        } else if (new Date() > new Date(row.expiresAt)) {
            responseData = { success: false, message: 'Key đã hết hạn' };
        } else {
            const serverTime = new Date().toISOString();
            if (!row.hwid) {
                await Key.updateOne({ key }, { hwid, status: 'used' });
                responseData = { success: true, message: 'Kích hoạt thành công', expiresAt: row.expiresAt, serverTime };
            } else if (row.hwid !== hwid) {
                responseData = { success: false, message: 'Key đang được dùng ở máy khác' };
            } else {
                responseData = { success: true, message: 'Hợp lệ', expiresAt: row.expiresAt, serverTime };
            }
        }

        const signature = generateSignature(responseData);
        return NextResponse.json({ ...responseData, signature });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

