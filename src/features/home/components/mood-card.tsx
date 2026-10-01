import { SpotifyIcon } from "@/components/icon/spotify";
import { useRecentlyPlayedTracksWithAudioFeatures } from "@/features/songs/hooks/use-songs";
import { calculateAura } from "@/features/songs/lib/aura";
import { useLayout } from "@/hooks/use-layout";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function MoodCard() {
  const heights = [8, 16, 22, 30, 20, 42, 34, 54, 26, 60, 38, 70, 24, 64, 45, 76, 30, 56, 70, 82, 42, 66, 78];

  const { data: songsWithAudioFeatures, error: errorSongsWithAudioFeatures, refetch: refreshSongsWithAudioFeatures } = useRecentlyPlayedTracksWithAudioFeatures();

  const mood = useMemo(() => {
    const features: Array<{ valence: number; energy: number }> =
      songsWithAudioFeatures?.items
        .map((item) => {
          const audioFeature = songsWithAudioFeatures.audioFeatures?.[item.track.id];
          if (!audioFeature) return null;
          return {
            valence: audioFeature.valence,
            energy: audioFeature.energy,
          } satisfies { valence: number; energy: number };
        })
        .filter((feature): feature is { valence: number; energy: number } => Boolean(feature)) ?? [];

    if (!features.length) {
      return {
        title: "Sem dados",
        subtitle: "Conecte o Spotify para medir sua aura",
        bonus: "+0% em Espírito (SPR)",
      };
    }

    const aura = calculateAura(features);
    const statBoost = Object.entries(aura.statBoost)[0] ?? ["spirit", 0];

    return {
      title: aura.name,
      subtitle: aura.dominantSentiment,
      bonus: `+${statBoost[1]}% em ${statBoost[0].toUpperCase()} `,
    };
  }, [songsWithAudioFeatures]);

  const { icon } = useLayout();

  return (
    <TouchableOpacity
      onPress={() => refreshSongsWithAudioFeatures()}
      className="items-center min-h-19 overflow-hidden flex-row gap-3.5 px-4.5 border border-[rgba(255,255,255,0.11)] bg-[#252078]"
      style={{ borderCurve: "continuous", borderRadius: 10 }}
    >
      <SpotifyIcon height={icon.xl} width={icon.xl} />
      <View className="flex-1 z-10">
        <Text selectable className="text-[#d5d3ff]" style={{ fontSize: 13 }}>
          Humor do dia
        </Text>
        <Text selectable className="text-white font-black" style={{ fontSize: 15 }}>
          {mood.title}
        </Text>
        <Text selectable className="text-white" style={{ fontSize: 13 }}>
          {errorSongsWithAudioFeatures ? "Spotify indisponível" : mood.subtitle}
        </Text>
        <Text selectable className="text-[#d5d3ff]" style={{ fontSize: 12, marginTop: 2 }}>
          {errorSongsWithAudioFeatures ? "Tente novamente" : mood.bonus}
        </Text>
      </View>

      <View className="absolute right-2.5 bottom-0 top-0 items-center flex-row gap-1.5">
        {heights.map((height, index) => (
          <View
            key={`${height}-${index}`}
            className="w-1 bg-[#69b8ff]"
            style={{
              height: height * 0.56,
              opacity: 0.22 + index / heights.length,
              borderRadius: 3,
              boxShadow: "0 0 12px rgba(91, 144, 255, 0.78)",
            }}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
}