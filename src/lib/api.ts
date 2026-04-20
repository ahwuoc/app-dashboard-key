const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

export async function fetchKeys() {
  const response = await fetch(`${API_BASE}/keys`, {
    headers: {
      'x-admin-secret': ADMIN_SECRET,
    },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch keys');
  return response.json();
}

export async function generateKey(days: number, note: string) {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      days,
      note,
      secret: ADMIN_SECRET,
    }),
  });
  if (!response.ok) throw new Error('Failed to generate key');
  return response.json();
}
export async function deleteKey(id: number) {
  const response = await fetch(`${API_BASE}/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      secret: ADMIN_SECRET,
    }),
  });
  if (!response.ok) throw new Error('Failed to delete key');
  return response.json();
}

export async function updateKey(id: number, data: { note?: string; expiresAt?: string; hwid?: string | null }) {
  const response = await fetch(`${API_BASE}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      ...data,
      secret: ADMIN_SECRET,
    }),
  });
  if (!response.ok) throw new Error('Failed to update key');
  return response.json();
}
