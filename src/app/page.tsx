import React from 'react';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="hero-overlay" />
      <div className="bg-mesh" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 min-h-screen flex items-center pt-20">
        <div className="animate-fade-in max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter premium-gradient-text mb-6">
            Lấy Key Bot <br /> Nhanh - Xịn - Chuẩn
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl leading-relaxed">
            Hệ thống quản lý và cấp key bản quyền FB Bot Pro. Thiết kế để tối ưu hóa trải nghiệm và hiệu suất của bạn.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/dashboard" className="premium-button text-white">
              Quản Lý Key
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.16666 10H15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 4.16666L15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <button className="glass-card px-8 py-4 text-white hover:bg-white/10 transition-all font-semibold">
              Tài Liệu Hướng Dẫn
            </button>
          </div>
        </div>
      </section>
      <footer className="container mx-auto px-6 py-20 border-t border-white/10 text-center">
        <p className="text-white/30 text-sm tracking-widest uppercase font-bold">© 2026 FB Bot Pro Service. Powered by Antigravity.</p>
      </footer>
    </main>
  );
}
