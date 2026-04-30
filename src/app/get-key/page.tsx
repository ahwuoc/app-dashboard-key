import connectDB from '@/lib/mongodb';
import { Key } from '@/lib/models';
import { notFound } from 'next/navigation';
import CopyButton from './CopyButton';

export default async function GetKeyPage({
    searchParams,
}: {
    searchParams: Promise<{ key?: string }>;
}) {
    const { key } = await searchParams;

    if (!key) return notFound();

    await connectDB();
    const row = await Key.findOne({ key });
    
    if (!row) {

        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="bg-gradient" />
                <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--accent-secondary)', marginBottom: '1rem' }}>Lỗi</h2>
                    <p>Key không tồn tại hoặc đã bị xóa.</p>
                </div>
            </div>
        );
    }

    if (row.hwid || row.status === 'used') {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="bg-gradient" />
                <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--accent-secondary)', marginBottom: '1rem' }}>Lỗi</h2>
                    <p>Key này đã được sử dụng bởi một máy khác.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="bg-gradient" />
            <div className="glass-card animate-fade-in" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Key của bạn đã sẵn sàng!</h2>
                <div style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    padding: '1.5rem', 
                    borderRadius: '16px', 
                    fontSize: '1.5rem', 
                    fontWeight: '800', 
                    color: 'var(--accent-secondary)', 
                    border: '2px dashed var(--glass-border)', 
                    marginBottom: '1.5rem',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace'
                }}>
                    {key}
                </div>
                <CopyButton text={key} />
                <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.6 }}>Key này có hiệu lực trong 2 ngày.</p>
            </div>
        </div>
    );
}
