// services/reccobeatsService.ts
const RECCOBEATS_BASE_URL = 'https://api.reccobeats.com/v1';
const BATCH_SIZE = 15;

type AudioFeatures = {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
};

type ReccoBeatsResponse = {
  content: Array<AudioFeatures & { id: string; href: string }>;
};

function extractSpotifyId(href: string): string {
  return href.split('/track/')[1] ?? href;
}

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

export async function getAudioFeatures(
  spotifyTrackIds: string[]
): Promise<Record<string, AudioFeatures>> {
  const batches = chunk(spotifyTrackIds, BATCH_SIZE);
  const result: Record<string, AudioFeatures> = {};

  for (const batch of batches) {
    const url = `${RECCOBEATS_BASE_URL}/audio-features?ids=${batch.join(',')}`;
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