import { createContext, useContext, type ReactNode } from 'react';

interface SpotifyAuthContextValue {
  login: () => Promise<void>;
  getValidToken: () => Promise<string | null>;
  isReady: boolean;
}

export const SpotifyAuthContext = createContext<SpotifyAuthContextValue>({
  login: async () => {},
  getValidToken: async () => null,
  isReady: false,
});

export function useSpotifyAuthContext() {
  return useContext(SpotifyAuthContext);
}
