import { apiClient } from '@/api/client';
import type { SpotifyCursorPaginatedResponse } from '@/features/auth/types';
import type { SpotifyRecentlyPlayedItem } from '@/features/player/types';

export const playerService = {
  getRecentlyPlayedTracks: () =>
    apiClient.get<SpotifyCursorPaginatedResponse<SpotifyRecentlyPlayedItem>>(
      '/me/player/recently-played'
    ),
};
