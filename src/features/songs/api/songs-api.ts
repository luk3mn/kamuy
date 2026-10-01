import { apiClient } from "@/api/client";
import { RECCOBEATS_API_URL } from "@/api/endpoints";
import { SpotifyCursorPaginatedResponse } from "@/features/auth/types";
import { BATCH_SIZE, chunk, extractSpotifyId } from "../lib/map-reccobeats";
import { AudioFeatures, ReccoBeatsResponse, SpotifyRecentlyPlayedItem } from "../types";

export const playerService = {
  getRecentlyPlayedTracks: () =>
    apiClient.get<SpotifyCursorPaginatedResponse<SpotifyRecentlyPlayedItem>>(
      '/me/player/recently-played'
    ),
};

export async function getAudioFeatures(
  spotifyTrackIds: string[]
): Promise<Record<string, AudioFeatures>> {
  const batches = chunk(spotifyTrackIds, BATCH_SIZE);
  const result: Record<string, AudioFeatures> = {};

  for (const batch of batches) {
    const url = `${RECCOBEATS_API_URL}/audio-features?ids=${batch.join(',')}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      throw new Error(`ReccoBeats error: ${response.status}`);
    }

    const data: ReccoBeatsResponse = await response.json();

    for (const track of data.content) {
      const spotifyId = extractSpotifyId(track.href);
      result[spotifyId] = {
        acousticness: track.acousticness,
        danceability: track.danceability,
        energy: track.energy,
        instrumentalness: track.instrumentalness,
        liveness: track.liveness,
        loudness: track.loudness,
        speechiness: track.speechiness,
        tempo: track.tempo,
        valence: track.valence,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return result;
}