import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const secureStorage = {
  getItem: async (key: string): Promise<string | null> =>
    SecureStore.getItemAsync(key),
  setItem: async (key: string, value: string): Promise<void> =>
    SecureStore.setItemAsync(key, value),
  removeItem: async (key: string): Promise<void> =>
    SecureStore.deleteItemAsync(key),
};

import type { SpotifyTokens } from "../types/spotify";

interface AuthState {
  spotifyAccessToken: string | null;
  spotifyRefreshToken: string | null;
  spotifyExpiresAt: number | null;
  spotifyExpiresIn: number | null;
  isSpotifyConnected: boolean;

  setSpotifyTokens: (tokens: SpotifyTokens) => void;
  isSpotifyTokenExpired: () => boolean;
  clearSpotifyTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      spotifyAccessToken: null,
      spotifyRefreshToken: null,
      spotifyExpiresAt: null,
      spotifyExpiresIn: null,
      isSpotifyConnected: false,

      setSpotifyTokens: ({ accessToken, refreshToken, expiresIn, expiresAt }: SpotifyTokens) =>
        set({
          spotifyAccessToken: accessToken,
          spotifyRefreshToken: refreshToken,
          spotifyExpiresIn: expiresIn,
          spotifyExpiresAt: expiresAt,
          isSpotifyConnected: true,
        }),

      isSpotifyTokenExpired: () => {
        const { spotifyExpiresAt } = get();
        if (!spotifyExpiresAt) return true;
        return Date.now() >= spotifyExpiresAt - 60_000; // 1 min buffer
      },

      clearSpotifyTokens: () =>
        set({
          spotifyAccessToken: null,
          spotifyRefreshToken: null,
          spotifyExpiresAt: null,
          spotifyExpiresIn: null,
          isSpotifyConnected: false,
        }),
    }),
    {
      name: "spotify-auth-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
