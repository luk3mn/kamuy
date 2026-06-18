import { useAuthStore } from "@/stores/auth.store";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function persistAuthData(data: SpotifyTokenResponse) {
    useAuthStore.getState().setAccessToken(data.access_token);
    useAuthStore.getState().setIsAuthenticated(true);
}

export const authService = {
  signIn: async (): Promise<SpotifyTokenResponse> => {
    const clientId = "";
    const clientSecret = "";

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error_description ?? "Falha ao autenticar com o Spotify");
    }

    const data: SpotifyTokenResponse = await response.json();
    console.log(data);
    if (!data.access_token) throw new Error("Falha no login");

    await persistAuthData(data);
    return data;
  },
};