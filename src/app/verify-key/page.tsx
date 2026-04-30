import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import { KeyRequest, Key } from '@/lib/models';
import crypto from 'crypto';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Xác thực lấy Key | FB Bot Pro',
  description: 'Hệ thống xác thực người dùng để lấy key bản quyền FB Bot Pro.',
};

export default async function VerifyKeyPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const searchParamsResolved = await searchParams;
  let requestId = searchParamsResolved.id;

  const headersList = await headers();
  const userIp = headersList.get('cf-connecting-ip') ||
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1';

  let request: any;

  try {
    await connectDB();
    if (requestId) {
      request = await KeyRequest.findOne({ requestId, status: 'PENDING' });
    } else {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      request = await KeyRequest.findOne({ 
        ip: userIp, 
        status: 'PENDING', 
        createdAt: { $gt: thirtyMinutesAgo } 
      }).sort({ createdAt: -1 });
      
      if (request) requestId = request.requestId;
    }
  } catch (err) {
    console.error("Database error in verify-key:", err);
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="hero-overlay" />
        <div className="bg-mesh" />
        <div className="glass-card max-w-md w-full p-10 text-center shadow-2xl border border-white/10 animate-fade-in">
          <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
            <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black mb-4 premium-gradient-text tracking-tighter">Yêu cầu hết hạn</h1>
          <p className="text-white/50 mb-8 leading-relaxed font-medium">Phiên xác thực đã hết hạn hoặc không tồn tại. Vui lòng quay lại phần mềm để lấy link mới.</p>
          <a href="/" className="premium-button w-full justify-center text-white font-black uppercase tracking-widest text-sm">
            Quay lại Trang chủ
          </a>
        </div>
      </div>
    );
  }

  // Generate the actual key
  const newKey = `FB-BOT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 2);

  try {
    // Update request and create key
    await KeyRequest.findOneAndUpdate({ requestId }, { status: 'COMPLETED' });
    await Key.create({
        key: newKey,
        note: 'Trial Key (2 days)',
        expiresAt: expiresAt,
        ip: request.ip
    });


    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="hero-overlay" />
        <div className="bg-mesh" />

        <div className="glass-card max-w-xl w-full p-10 text-center shadow-[0_50px_150px_-20px_rgba(0,0,0,1)] relative z-10 animate-fade-in">
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-3 border border-green-500/20 shadow-lg">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-black premium-gradient-text mb-4 uppercase tracking-tighter">
            XÁC THỰC THÀNH CÔNG!
          </h1>
          <p className="text-white/40 mb-10 text-lg font-medium">Cảm ơn bạn đã ủng hộ. Đây là mã bản quyền của bạn.</p>

          <div className="bg-black/60 border border-white/5 rounded-3xl p-8 mb-10 group hover:border-brand-accent/30 transition-all duration-500">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3 font-black">Mã Bản Quyền (License Key)</div>
            <div className="text-3xl font-black text-brand-accent tracking-widest break-all select-all">
              {newKey}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 text-left mb-10">
            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2">Hết hạn vào</div>
              <div className="text-lg font-black text-white">{new Date(expiresAt).toLocaleDateString()}</div>
            </div>
            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2">Loại Key</div>
              <div className="text-lg font-black text-white italic">Trial - 2 Ngày</div>
            </div>
          </div>

          <a href="/" className="premium-button w-full justify-center text-white font-black text-lg uppercase tracking-widest py-5">
            Tiếp Tục Sử Dụng
          </a>

          <p className="text-[10px] text-white/20 mt-8 font-black uppercase tracking-widest">
            * Mỗi IP được cấp 1 key mỗi ngày. Vui lòng bảo mật mã của bạn.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="hero-overlay" />
        <div className="bg-mesh" />
        <div className="glass-card max-w-md w-full p-10 text-center border border-red-500/20">
          <h2 className="text-2xl font-black text-red-500 mb-4 uppercase tracking-tight">Lỗi Hệ Thống</h2>
          <p className="text-white/40 mb-8 font-medium">Không thể tạo key lúc này. Vui lòng liên hệ Admin.</p>
          <a href="/" className="text-red-400 font-black hover:underline uppercase tracking-widest text-sm">Quay lại</a>
        </div>
      </div>
    );
  }
}
