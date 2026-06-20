import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth.store";
import { SpotifyUser } from "@/types/spotify";

const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET!;

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function persistAuthData(data: SpotifyTokenResponse): Promise<void> {
  useAuthStore.getState().setTokens({
    accessToken: data.access_token,
    refreshToken: null,          // Client Credentials doesn't provide a refresh token
    expiresIn: data.expires_in,
    expiresAt: Date.now() + data.expires_in * 1000,
  });
}

// export const getMyProfile = (token: string): Promise<SpotifyUser> => apiClient<SpotifyUser>('/me', token);
export const userService = {
  getMe: (token: string) => apiClient.get<SpotifyUser>("/me", { token }),
};

export const authService = {
  signIn: async (): Promise<SpotifyTokenResponse> => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error_description ?? "Falha ao autenticar com o Spotify");
    }

    const data: SpotifyTokenResponse = await response.json();
    if (!data.access_token) throw new Error("Falha no login");

    await persistAuthData(data);
    return data;
  },
};