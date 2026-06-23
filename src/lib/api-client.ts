import { useAuthStore } from '@/stores/auth.store';

export const ENDPOINT_URL = 'https://api.spotify.com/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<{ data: T | null; error: string | null }> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res = await fetch(`${ENDPOINT_URL}${path}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { data: null, error: err?.error?.message ?? `Request failed: ${res.status}` };
    }

    const data: T = await res.json();
    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message ?? 'Unknown error' };
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};