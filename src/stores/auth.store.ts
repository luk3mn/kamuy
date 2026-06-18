import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },
};

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (accessToken: string | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      logout: () => set({ accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);