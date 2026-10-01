import { useQuery } from '@tanstack/react-query';
import { songsKeys } from '../api/query-keys';
import { getAudioFeatures, playerService } from '../api/songs-api';

export function useRecentlyPlayedTracks() {
  return useQuery({
    queryKey: songsKeys.recentlyPlayed,
    queryFn: async () => {
      const { data, error } = await playerService.getRecentlyPlayedTracks();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecentlyPlayedTracksWithAudioFeatures() {
  return useQuery({
    queryKey: songsKeys.recentlyPlayed,
    queryFn: async () => {
      const { data, error } = await playerService.getRecentlyPlayedTracks();
      if (error) throw new Error(error);
      if (!data) throw new Error('No recently played tracks returned by Spotify');

      const trackIds = data.items.map((item) => item.track.id);
      const audioFeatures = await getAudioFeatures(trackIds);
      console.log('useRecentlyPlayedTracksWithAudioFeatures - audioFeatures:', audioFeatures);

      return { ...data, audioFeatures };
    },
    staleTime: 1000 * 60 * 5,
  });
}
