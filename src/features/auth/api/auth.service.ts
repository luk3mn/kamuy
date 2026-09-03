import { apiClient } from '@/api/client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { SpotifyUser } from '@/features/auth/types';

const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET!;

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function persistAuthData(data: SpotifyTokenResponse): Promise<void> {
  useAuthStore.getState().setSpotifyTokens({
    accessToken: data.access_token,
    refreshToken: null,
    expiresIn: data.expires_in,
    expiresAt: Date.now() + data.expires_in * 1000,
  });
}

export const userService = {
  getMe: () => apiClient.get<SpotifyUser>('/me'),
};

export const authService = {
  signIn: async (): Promise<SpotifyTokenResponse> => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error_description ?? 'Falha ao autenticar com o Spotify');
    }

    const data: SpotifyTokenResponse = await response.json();
    if (!data.access_token) throw new Error('Falha no login');

    await persistAuthData(data);
    return data;
  },
};
