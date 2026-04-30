const API_BASE = '/api';
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
export async function fetchVersion() {
  const response = await fetch(`${API_BASE}/check-update`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch version');
  return response.json();
}

export async function updateVersion(data: { version: string; url: string; note?: string }) {
  const response = await fetch(`${API_BASE}/set-version`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      secret: ADMIN_SECRET,
    }),
  });
  if (!response.ok) throw new Error('Failed to update version');
  return response.json();
}
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'x-admin-secret': ADMIN_SECRET,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Upload error (${response.status}):`, errorText);
    throw new Error(`Failed to upload file: ${response.status} ${errorText}`);
  }
  return response.json();
}

export async function generateLatestYml() {
  const response = await fetch(`${API_BASE}/generate-yml`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: ADMIN_SECRET,
    }),
  });
  if (!response.ok) throw new Error('Failed to generate latest.yml');
  return response.json();
}

export async function fetchLatestYml() {
  const response = await fetch(`${API_BASE}/get-yml?secret=${ADMIN_SECRET}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch latest.yml');
  return response.json();
}
export async function fetchVersions() {
  const response = await fetch(`${API_BASE}/versions`, {
    headers: {
      'x-admin-secret': ADMIN_SECRET,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Fetch versions error (${response.status}):`, errorText);
    throw new Error(`Failed to fetch versions: ${response.status} ${errorText}`);
  }
  return response.json();
}

export async function deleteVersion(id: number) {
  const response = await fetch(`${API_BASE}/delete-version`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      secret: ADMIN_SECRET,
    }),
  });
  if (!response.ok) throw new Error('Failed to delete version');
  return response.json();
}
