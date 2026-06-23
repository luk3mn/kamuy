import { playerService } from "@/services/player.service";
import { useQuery } from "@tanstack/react-query";

export const userKeys = {
  recentlyPlayedTracks: ["tracks"] as const,
};

export function useRecentlyPlayedTracks() {
  return useQuery({
    queryKey: userKeys.recentlyPlayedTracks,
    queryFn: async () => {
      const { data, error } = await playerService.getRecentlyPlayedTracks();
      
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}