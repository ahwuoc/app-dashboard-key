'use client';

import React, { useState, useEffect } from 'react';
import { fetchKeys, generateKey, deleteKey, updateKey } from '@/lib/api';

interface KeyRecord {
  id: number;
  key: string;
  hwid: string | null;
  status: string;
  note: string;
  expiresAt: string;
  createdAt: string;
  lastIp?: string;
}

export default function Dashboard() {
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [days, setDays] = useState(30);
  const [note, setNote] = useState('');

  const loadKeys = async () => {
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await generateKey(days, note);
      await loadKeys();
      setNote('');
    } catch (error) {
      alert('Error generating key');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this key?')) return;
    try {
      await deleteKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
    } catch (error) {
      alert('Error deleting key');
    }
  };

  const handleResetHWID = async (id: number) => {
    if (!confirm('Are you sure you want to reset the HWID for this key?')) return;
    try {
      await updateKey(id, { hwid: null });
      setKeys(prev => prev.map(k => k.id === id ? { ...k, hwid: null } : k));
    } catch (error) {
      alert('Error resetting HWID');
    }
  };

  const handleUpdateNote = async (id: number, currentNote: string) => {
    const newNote = prompt('Enter new note:', currentNote);
    if (newNote === null) return;
    try {
      await updateKey(id, { note: newNote });
      setKeys(prev => prev.map(k => k.id === id ? { ...k, note: newNote } : k));
    } catch (error) {
      alert('Error updating note');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="hero-bg-overlay" />
      <div className="bg-gradient" />

      <div className="animate-fade-in">
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1>Key Management</h1>
            <p>Monitor and control your license keys in real-time.</p>
          </div>
          <div className="glass-card" style={{ padding: '1rem' }}>
            <span style={{ opacity: 0.6, fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Total Keys</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{keys.length}</span>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* Key List */}
          <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Active Licenses</h2>
              <button onClick={loadKeys} style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}>Refresh</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.8rem', opacity: 0.6 }}>
                    <th style={{ padding: '1rem 1.5rem' }}>KEY</th>
                    <th style={{ padding: '1rem 1.5rem' }}>STATUS</th>
                    <th style={{ padding: '1rem 1.5rem' }}>HWID</th>
                    <th style={{ padding: '1rem 1.5rem' }}>EXPIRES</th>
                    <th style={{ padding: '1rem 1.5rem' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }}>Loading keys...</td></tr>
                  ) : keys.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }}>No keys found</td></tr>
                  ) : (
                    keys.map((k) => (
                      <tr key={k.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="table-row">
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <code style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{k.key}</code>
                          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>{k.note}</div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '99px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backgroundColor: k.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(138, 43, 226, 0.2)',
                            color: k.status === 'active' ? '#4ade80' : '#c084fc'
                          }}>
                            {k.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                          {k.hwid || <span style={{ opacity: 0.3 }}>Not linked</span>}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                          {new Date(k.expiresAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button 
                              onClick={() => handleResetHWID(k.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              Reset HWID
                            </button>
                            <button 
                              onClick={() => handleUpdateNote(k.id, k.note)}
                              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, opacity: 0.7 }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(k.id)}
                              style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              Delete
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

          {/* Controls */}
          <aside>
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Generate New Key</h3>
              <form onSubmit={handleGenerate}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>Duration (Days)</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.75rem', color: 'white' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>Note / Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. Test Key"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.75rem', color: 'white' }}
                  />
                </div>
                <button
                  className="premium-button"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate Key'}
                </button>
              </form>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
              <h4 style={{ marginBottom: '0.75rem', color: 'white' }}>Quick Help</h4>
              <ul style={{ paddingLeft: '1.2rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Keys are valid until expiration date.</li>
                <li style={{ marginBottom: '0.5rem' }}>HWID is locked upon first verification.</li>
                <li>Status transitions from Active to Used.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>

      <style jsx>{`
        .table-row:hover {
          background: rgba(255, 255, 255, 0.03);
        }
      `}</style>
    </div>
  );
}
