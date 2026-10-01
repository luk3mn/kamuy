import { useAuthStore } from '@/features/auth/store/auth.store';

export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;

async function refreshSpotifyAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID ?? '',
    }).toString(),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Spotify token refresh failed: ${res.status} ${errorText}`);
  }

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
  };

  if (!data.access_token) {
    throw new Error('Spotify refresh response did not include an access token');
  }

  useAuthStore.getState().setSpotifyTokens({
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresIn: data.expires_in ?? 3600,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  });

  return data.access_token;
}

async function getValidSpotifyToken(): Promise<string | null> {
  const { spotifyAccessToken, spotifyRefreshToken, isSpotifyTokenExpired } = useAuthStore.getState();

  if (!spotifyAccessToken) return null;

  if (!isSpotifyTokenExpired()) return spotifyAccessToken;

  if (!spotifyRefreshToken) return null;

  return refreshSpotifyAccessToken(spotifyRefreshToken);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<{ data: T | null; error: string | null }> {
  try {
    const spotifyAccessToken = await getValidSpotifyToken();

    if (!spotifyAccessToken) {
      return { data: null, error: 'Missing/invalid/expired access token' };
    }

    const res = await fetch(`${SPOTIFY_API_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
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
