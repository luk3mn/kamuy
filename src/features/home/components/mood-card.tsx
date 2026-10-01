import { SpotifyIcon } from "@/components/icon/spotify";
import { useRecentlyPlayedTracksWithAudioFeatures } from "@/features/songs/hooks/use-songs";
import type { AudioFeatures } from "@/features/songs/types";
import { useLayout } from "@/hooks/use-layout";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getMoodFromFeatures(features: AudioFeatures[]) {
  if (!features.length) {
    return {
      title: "Sem dados",
      subtitle: "Conecte o Spotify para medir sua aura",
      bonus: "+0% em Espírito (SPR)",
    };
  }

  const valence = average(features.map((item) => item.valence));
  const energy = average(features.map((item) => item.energy));
  const acousticness = average(features.map((item) => item.acousticness));

  if (energy >= 0.68 && valence >= 0.6) {
    return {
      title: "Foco & Harmonia",
      subtitle: "Treino, presença e fluxo mental",
      bonus: "+12% em Espírito (SPR)",
    };
  }

  if (energy >= 0.7 && valence < 0.45) {
    return {
      title: "Aura Guerreira",
      subtitle: "Energia alta e foco intenso",
      bonus: "+9% em Força (STR)",
    };
  }

  if (energy < 0.45 && valence >= 0.6) {
    return {
      title: "Aura de Harmonia",
      subtitle: "Paz, presença e manifestação",
      bonus: "+10% em Espírito (SPR)",
    };
  }

  if (acousticness >= 0.6 && valence < 0.5) {
    return {
      title: "Introspecção",
      subtitle: "Momento mais profundo e reflexivo",
      bonus: "+7% em Mente (INT)",
    };
  }

  return {
    title: "Equilíbrio em Movimento",
    subtitle: "Humor misto com energia controlada",
    bonus: "+6% em Vitalidade (VIT)",
  };
}

export function MoodCard() {
  const heights = [8, 16, 22, 30, 20, 42, 34, 54, 26, 60, 38, 70, 24, 64, 45, 76, 30, 56, 70, 82, 42, 66, 78];

  const { data: songsWithAudioFeatures, error: errorSongsWithAudioFeatures, refetch: refreshSongsWithAudioFeatures } = useRecentlyPlayedTracksWithAudioFeatures();

  const mood = useMemo(() => {
    const features = songsWithAudioFeatures?.items
      .map((item) => songsWithAudioFeatures.audioFeatures?.[item.track.id])
      .filter((feature): feature is AudioFeatures => Boolean(feature)) ?? [];

    return getMoodFromFeatures(features);
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