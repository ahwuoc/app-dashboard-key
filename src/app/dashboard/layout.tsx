'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'License Keys', href: '/dashboard/keys', icon: '🔑' },
    { name: 'App Updates', href: '/dashboard/updates', icon: '🚀' },
  ];

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen flex gap-8 relative max-w-[1400px]">
      <div className="hero-overlay" />
      <div className="bg-mesh" />

      {/* Sidebar */}
      <aside className="w-72 shrink-0">
        <div className="glass-card p-6 sticky top-10 h-fit border border-white/5 shadow-2xl">
          <h2 className="text-xl font-black mb-10 bg-gradient-to-r from-white to-brand-accent bg-clip-text text-transparent tracking-tighter">
            ADMIN DASHBOARD
          </h2>
          
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-medium group
                    ${isActive 
                      ? 'bg-white/10 text-brand-accent border border-white/10 shadow-lg' 
                      : 'text-white/50 hover:bg-white/3 hover:text-white hover:translate-x-1'
                    }`}
                >
                  <span className={`text-xl transition-opacity ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-12 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
             <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2">System Status</p>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />
                <span className="text-xs font-bold text-white/80">Operational</span>
             </div>
          </div>

          <button
            onClick={async () => {
              await fetch('/api/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="mt-6 w-full flex items-center gap-4 p-4 rounded-2xl border border-red-500/10 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all font-bold cursor-pointer"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
