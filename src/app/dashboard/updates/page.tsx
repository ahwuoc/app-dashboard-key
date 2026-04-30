'use client';

import React, { useState, useEffect } from 'react';
import { fetchVersion, updateVersion, uploadFile, generateLatestYml, fetchVersions, deleteVersion, fetchLatestYml } from '@/lib/api';

export default function UpdatesPage() {
  const [currentVersion, setCurrentVersion] = useState({ version: '', url: '', note: '', signature: '' });
  const [allVersions, setAllVersions] = useState<any[]>([]);
  const [vInput, setVInput] = useState({ version: '', url: '', note: '' });
  const [updatingVersion, setUpdatingVersion] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatingYml, setGeneratingYml] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [ymlContent, setYmlContent] = useState('');

  const loadData = async () => {
    try {
      const current = await fetchVersion();
      if (current) {
        setCurrentVersion(current);
        setVInput(current);
      }
    } catch (error) {
      console.warn('Could not fetch current version:', error);
    }

    try {
      const list = await fetchVersions();
      if (list) {
        setAllVersions(list);
      }
    } catch (error) {
      console.warn('Could not fetch version history:', error);
    }

    try {
      const yml = await fetchLatestYml();
      if (yml) {
        setYmlContent(yml.content);
      }
    } catch (error) {
      console.warn('Could not fetch latest.yml:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVersionUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingVersion(true);
    setIsUploading(true);
    try {
      let finalUrl = vInput.url;

      if (selectedFile) {
        const result = await uploadFile(selectedFile);
        finalUrl = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}${result.url}`;
      }

      await updateVersion({ ...vInput, url: finalUrl });
      setSelectedFile(null);
      await loadData();
      alert('Cập nhật phiên bản thành công!');
    } catch (error: any) {
      console.error(error);
      alert(`Lỗi: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setUpdatingVersion(false);
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleGenerateYml = async () => {
    setGeneratingYml(true);
    try {
      await generateLatestYml();
      await loadData();
      alert('Đã sinh file latest.yml thành công!');
    } catch (error) {
      alert('Lỗi khi sinh latest.yml');
    } finally {
      setGeneratingYml(false);
    }
  };

  const handleDeleteVersion = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bản ghi phiên bản này?')) return;

    setIsDeleting(id);
    try {
      await deleteVersion(id);
      await loadData();
    } catch (error) {
      alert('Lỗi khi xóa phiên bản');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black premium-gradient-text tracking-tighter">APP UPDATES</h1>
          <p className="text-white/40 font-medium">Phát hành phiên bản mới và quản lý tài nguyên.</p>
        </div>
        <div className="glass-card px-6 py-4 flex gap-10 border border-white/5 bg-white/[0.02]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1 block">Live Version</span>
            <span className="text-2xl font-black text-brand-secondary">v{currentVersion.version || '0.0.0'}</span>
          </div>
          <div className="border-l border-white/5 pl-10">
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1 block">Server Signature</span>
            <code className="text-xs text-green-400 font-mono block max-w-[200px] truncate">
              {currentVersion.signature || 'N/A'}
            </code>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
        {/* Release Management */}
        <div className="glass-card p-8 border border-white/5 space-y-8">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-secondary shadow-[0_0_10px_var(--color-brand-secondary)]" />
            Release Management
          </h2>

          <form onSubmit={handleVersionUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 ml-1">Version Number</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 2.1.0"
                  value={vInput.version}
                  onChange={(e) => setVInput({ ...vInput, version: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-brand-secondary/50 transition-all placeholder:text-white/10"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 ml-1">Binary Upload (.exe/.zip)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".exe,.zip,.rar"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`block w-full p-4 rounded-2xl text-center cursor-pointer transition-all border border-dashed text-sm font-bold
                      ${selectedFile
                        ? 'bg-green-500/5 border-green-500/40 text-green-400'
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20'
                      } ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {selectedFile ? (
                      <span className="flex items-center justify-center gap-2">
                        📎 {selectedFile.name}
                      </span>
                    ) : 'Chọn file hoặc kéo thả'}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 ml-1">Update URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={vInput.url}
                onChange={(e) => setVInput({ ...vInput, url: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-brand-secondary/50 transition-all placeholder:text-white/10"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 ml-1">Release Notes</label>
              <textarea
                placeholder="Mô tả các thay đổi..."
                value={vInput.note}
                onChange={(e) => setVInput({ ...vInput, note: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-brand-secondary/50 transition-all placeholder:text-white/10 min-h-[120px] resize-none"
              />
            </div>

            <button
              type="submit"
              className="premium-button w-full justify-center text-white font-black uppercase tracking-widest py-5"
              disabled={updatingVersion || isUploading}
            >
              {isUploading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                  Đang tải lên...
                </div>
              ) : updatingVersion ? 'Đang thực thi...' : (selectedFile ? '📤 Tải lên & Phát hành' : 'Cập nhật hệ thống')}
            </button>

            <div className="p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">Auto-Updater Assets</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Generate latest.yml for Electron</p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateYml}
                  disabled={generatingYml}
                  className="px-4 py-2 bg-brand-primary text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                >
                  {generatingYml ? '...' : 'Generate'}
                </button>
              </div>
              {ymlContent && (
                <pre className="bg-black/60 p-4 rounded-xl text-[10px] text-green-400 font-mono overflow-x-auto border border-white/5 whitespace-pre">
                  {ymlContent}
                </pre>
              )}
            </div>
          </form>
        </div>

        {/* Version History */}
        <div className="glass-card p-8 border border-white/5 space-y-6 max-h-[850px] overflow-hidden flex flex-col">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/20" />
            Version History
          </h2>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {allVersions.length === 0 ? (
              <div className="p-20 text-center text-white/10 font-bold italic tracking-widest uppercase">No history found</div>
            ) : allVersions.map((v) => (
              <div key={v.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative group hover:border-brand-secondary/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-brand-secondary tracking-tighter">v{v.version}</span>
                    <span className="text-[10px] text-white/30 font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      {new Date(v.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteVersion(v.id)}
                    className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                    title="Xóa bản ghi"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-white/40 font-mono mb-4 break-all bg-black/40 p-3 rounded-xl border border-white/5">
                  {v.url}
                </p>
                <div className="text-sm text-white/60 leading-relaxed font-medium bg-white/[0.01] p-4 rounded-xl">
                  {v.note || 'Không có ghi chú.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
