'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { fetchKeys, generateKey, deleteKey, updateKey } from '@/lib/api';

interface KeyRecord {
  id: number;
  key: string;
  hwid: string | null;
  status: string;
  note: string;
  expiresAt: string;
  createdAt: string;
}

export default function KeysPage() {
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [days, setDays] = useState(30);
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadKeys = async () => {
    setLoading(true);
    try {
      const data = await fetchKeys();
      setKeys(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const filteredKeys = useMemo(() => {
    return keys.filter(k =>
      k.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.note && k.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (k.hwid && k.hwid.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [keys, searchTerm]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await generateKey(days, note);
      await loadKeys();
      setNote('');
      alert('Key mới đã được tạo thành công!');
    } catch (error) {
      alert('Lỗi khi tạo key');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa key này? Thao tác này không thể hoàn tác.')) return;
    try {
      await deleteKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
    } catch (error) {
      alert('Lỗi khi xóa key');
    }
  };

  const handleResetHWID = async (id: number) => {
    if (!confirm('Reset HWID sẽ cho phép key này được sử dụng trên máy tính khác. Tiếp tục?')) return;
    try {
      await updateKey(id, { hwid: null });
      setKeys(prev => prev.map(k => k.id === id ? { ...k, hwid: null } : k));
    } catch (error) {
      alert('Lỗi khi reset HWID');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="animate-fade-in space-y-10 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black premium-gradient-text tracking-tighter uppercase italic">
            License Control
          </h1>
          <p className="text-white/40 font-medium tracking-wide">Quản trị viên / Quản lý khóa bản quyền thời gian thực.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-8 py-5 flex flex-col items-center border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent shadow-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black mb-1">Authenticated</span>
            <span className="text-3xl font-black text-brand-accent tabular-nums">{keys.filter(k => k.hwid).length}</span>
          </div>
          <div className="glass-card px-8 py-5 flex flex-col items-center border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent shadow-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black mb-1">Total Issued</span>
            <span className="text-3xl font-black text-white tabular-nums">{keys.length}</span>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-brand-accent transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm key, khách hàng hoặc HWID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-brand-accent/30 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <button
              onClick={loadKeys}
              className="glass-card px-8 py-4 flex items-center justify-center gap-2 text-white/60 hover:text-white hover:bg-white/10 transition-all font-bold border border-white/10"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              LÀM MỚI
            </button>
          </div>

          {/* Key Table */}
          <div className="glass-card overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] uppercase tracking-[0.2em] text-white/40 font-black border-b border-white/10">
                    <th className="p-6">License Data</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Security (HWID)</th>
                    <th className="p-6">Expiration</th>
                    <th className="p-6 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {loading && keys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
                          <p className="text-white/20 font-black tracking-widest uppercase text-xs">Synchronizing Core...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredKeys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-32 text-center text-white/10 font-black italic tracking-widest uppercase">
                        {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Hệ thống chưa có license nào'}
                      </td>
                    </tr>
                  ) : (
                    filteredKeys.map((k) => (
                      <tr key={k.id} className="hover:bg-white/[0.03] transition-all group duration-300">
                        <td className="p-6">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <code className="text-lg font-black text-brand-accent tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => copyToClipboard(k.key)}>
                                {k.key}
                              </code>
                              <button onClick={() => copyToClipboard(k.key)} className="text-white/10 hover:text-brand-accent transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <div className="text-[10px] text-white/30 font-black uppercase flex items-center gap-2">
                              {k.note || 'No client info'}
                              <span className="w-1 h-1 rounded-full bg-white/10" />
                              ID: #{k.id}
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className={`relative flex items-center justify-center w-2 h-2 rounded-full 
                              ${k.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                              <div className={`absolute inset-0 w-full h-full rounded-full animate-ping opacity-40 
                                ${k.status === 'active' ? 'bg-green-500 font-bold' : 'bg-red-500'}`} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest 
                              ${k.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                              {k.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          {k.hwid ? (
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-[11px] font-mono font-bold text-white/50 tracking-tight truncate max-w-[120px]">{k.hwid}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-white/10">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span className="text-[10px] font-black uppercase tracking-widest italic">Ready for binding</span>
                            </div>
                          )}
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-black text-white/80 tabular-nums">
                              {new Date(k.expiresAt).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-white/20 font-bold uppercase tracking-tighter">
                              Ends at 23:59:59
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() => handleResetHWID(k.id)}
                              className="px-4 py-2 bg-white/[0.03] border border-white/5 hover:border-brand-accent/40 text-[10px] font-black text-white/40 hover:text-brand-accent uppercase tracking-widest rounded-xl transition-all"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => handleDelete(k.id)}
                              className="px-4 py-2 bg-white/[0.03] border border-white/5 hover:border-red-500/40 text-[10px] font-black text-white/40 hover:text-red-500 uppercase tracking-widest rounded-xl transition-all"
                            >
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <aside className="space-y-8 h-fit lg:sticky lg:top-8">
          <div className="glass-card p-10 border border-white/10 relative overflow-hidden bg-gradient-to-br from-brand-primary/5 to-transparent">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-primary/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-accent/5 blur-[100px] rounded-full" />

            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3">
              <span className="w-4 h-[2px] bg-brand-primary" />
              New License
            </h3>

            <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-white/30 font-black ml-1">Subscription Days</label>
                <div className="relative group">
                  <input
                    type="number"
                    min="1"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-xl font-black text-white focus:outline-none focus:border-brand-primary/50 focus:bg-black/60 transition-all tabular-nums"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase tracking-widest">Days</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-white/30 font-black ml-1">Client Descriptor</label>
                <input
                  type="text"
                  placeholder="e.g. Premium User #123"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-brand-primary/50 focus:bg-black/60 transition-all placeholder:text-white/10"
                />
              </div>

              <button
                type="submit"
                className="premium-button w-full justify-center text-white font-black uppercase tracking-[0.2em] py-6 text-sm shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
                disabled={generating}
              >
                {generating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Deploying...
                  </div>
                ) : 'Generate Access Key'}
              </button>
            </form>
          </div>

          <div className="glass-card p-8 border border-white/5 bg-white/[0.01] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <span className="text-orange-500 text-sm">⚡</span>
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white/60">System Protocol</h4>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 p-4 rounded-2xl border border-white/[0.03] bg-white/[0.01]">
                <div className="text-brand-accent font-black text-sm">01</div>
                <p className="text-[11px] text-white/40 leading-relaxed font-medium mt-0.5">
                  Khóa sẽ tự động hết hạn vào lúc **23:59:59** của ngày cuối cùng trong chu kỳ đăng ký.
                </p>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl border border-white/[0.03] bg-white/[0.01]">
                <div className="text-brand-accent font-black text-sm">02</div>
                <p className="text-[11px] text-white/40 leading-relaxed font-medium mt-0.5">
                  Reset HWID sẽ giải phóng thiết bị hiện tại, cho phép người dùng đăng nhập trên trạm làm việc mới.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

