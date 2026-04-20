import React from 'react';

export default function Home() {
  return (
    <main>
      <div className="hero-bg-overlay" />
      <div className="bg-gradient" />
      
      <section className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
          <h1>Future-Ready Next.js Powered by Bun</h1>
          <p>
            Experience lightning-fast development and performance with the next generation 
            of the web. Built with visual excellence and rich aesthetics at its core.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <a href="/dashboard" className="premium-button">
              Manage Keys
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.16666 10H15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 4.16666L15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <button className="glass-card" style={{ padding: '0.8rem 2rem', borderRadius: '9999px', fontSize: '1rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}>
              Documentation
            </button>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Engineered for Speed</h2>
          <p style={{ margin: '0 auto' }}>Leveraging Bun's high-performance runtime to deliver unmatched user experiences.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-card">
            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(138, 43, 226, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#8a2be2', fontSize: '1.5rem' }}>
              ⚡
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Lightning Fast</h3>
            <p style={{ fontSize: '1rem' }}>Bun's runtime and bundler provide sub-second startup and build times.</p>
          </div>

          <div className="glass-card">
            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0, 255, 255, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#00ffff', fontSize: '1.5rem' }}>
              🎨
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Rich Aesthetics</h3>
            <p style={{ fontSize: '1rem' }}>Carefully curated design tokens and components for a premium feel.</p>
          </div>

          <div className="glass-card">
            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              💎
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Modern Stack</h3>
            <p style={{ fontSize: '1rem' }}>The latest Next.js features with App Router and Server Components.</p>
          </div>
        </div>
      </section>

      <footer className="container" style={{ padding: '4rem 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', margin: '0 auto' }}>© 2026 FutureWeb Inc. Built with Next.js & Bun.</p>
      </footer>
    </main>
  );
}
