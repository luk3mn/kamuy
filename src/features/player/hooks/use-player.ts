import { playerService } from '@/features/player/api/player.service';
import { useQuery } from '@tanstack/react-query';

export const playerKeys = {
  recentlyPlayed: ['player', 'recently-played'] as const,
};

export function useRecentlyPlayedTracks() {
  return useQuery({
    queryKey: playerKeys.recentlyPlayed,
    queryFn: async () => {
      const { data, error } = await playerService.getRecentlyPlayedTracks();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
