import { useAuthStore } from '@/stores/auth.store';
import {
    CodeChallengeMethod,
    makeRedirectUri,
    useAuthRequest
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect } from 'react';
import type { SpotifyTokens } from '../types/spotify';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID!;

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-library-read',
  'playlist-read-private',
  'user-read-recently-played',
  'user-read-playback-state',
] as const;

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

interface UseSpotifyAuthReturn {
  login: () => Promise<void>;
  getValidToken: () => Promise<string | null>;
  isReady: boolean;
}

export function useSpotifyAuth(): UseSpotifyAuthReturn {
  const { setTokens, accessToken, refreshToken, isTokenExpired } = useAuthStore();

  const redirectUri = makeRedirectUri({ scheme: 'kamuy', path: 'callback' });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [...SCOPES],
      usePKCE: true,
      redirectUri,
      codeChallengeMethod: CodeChallengeMethod.S256,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success' && request?.codeVerifier) {
      exchangeCode(response.params.code, request.codeVerifier);
    }
  }, [response]);

  async function exchangeCode(code: string, codeVerifier: string): Promise<void> {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier,
      }).toString(),
    });

    if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);

    const data = await res.json();
    setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      expiresAt: Date.now() + data.expires_in * 1000,
    });
  }

  async function refreshAccessToken(token: string): Promise<SpotifyTokens> {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token,
        client_id: CLIENT_ID,
      }).toString(),
    });

    if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);

    const data = await res.json();
    const tokens: SpotifyTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token,
      expiresIn: data.expires_in,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    setTokens(tokens);
    return tokens;
  }

  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (!accessToken || !refreshToken) return null;

    if (isTokenExpired()) {
      const refreshed = await refreshAccessToken(refreshToken);
      return refreshed.accessToken;
    }

    return accessToken;
  }, [accessToken, refreshToken, isTokenExpired]);

  const login = useCallback(async () => {
    await promptAsync();
  }, [promptAsync]);

  return { login, getValidToken, isReady: !!request };
}