'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
            <div className="hero-overlay" />
            <div className="bg-mesh" />
            
            <div className="glass-card animate-fade-in max-w-md w-full p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 relative z-10 transition-all duration-700">
                <header className="text-center mb-10">
                    <h2 className="text-4xl font-black bg-gradient-to-r from-white to-brand-primary bg-clip-text text-transparent tracking-tighter mb-2 italic">
                        ADMIN LOGIN
                    </h2>
                    <p className="text-sm text-white/40 font-medium">Truy cập bảng điều khiển hệ thống</p>
                </header>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-white/30 mb-2 ml-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Tên đăng nhập"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-white/30 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl text-center font-bold animate-fade-in">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="premium-button w-full justify-center text-white font-black text-lg uppercase tracking-widest py-5"
                        disabled={loading}
                    >
                        {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}
