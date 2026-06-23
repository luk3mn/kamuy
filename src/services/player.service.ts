import { apiClient } from "@/lib/api-client";
import { SpotifyRecentlyPlayedItem } from "@/types/player";
import { SpotifyCursorPaginatedResponse } from "@/types/spotify";

export const playerService = {
  getRecentlyPlayedTracks: () =>
    apiClient.get<SpotifyCursorPaginatedResponse<SpotifyRecentlyPlayedItem>>(
      `/me/player/recently-played`
    ),
};