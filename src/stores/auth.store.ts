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
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  expiresIn: number | null;
  isAuthenticated: boolean;

  setTokens: (tokens: SpotifyTokens) => void;
  setIsAuthenticated: (value: boolean) => void;
  isTokenExpired: () => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      expiresIn: null,
      isAuthenticated: false,

      setTokens: ({ accessToken, refreshToken, expiresIn, expiresAt }: SpotifyTokens) =>
        set({
          accessToken,
          refreshToken,
          expiresIn,
          expiresAt,
          isAuthenticated: true,
        }),

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;
        return Date.now() >= expiresAt - 60_000; // 1 min buffer
      },

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          expiresIn: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);