import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { SpotifyTrack, SpotifyUser } from "@/types/spotify";
import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function Auth() {
    const { login, getValidToken, isReady } = useSpotifyAuth();
    const [user, setUser] = useState<SpotifyUser | null>(null);
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    console.log(isReady)

    // const scope = 'user-read-private user-read-email user-read-playback-state user-read-currently-playing user-read-recently-played';

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // const token = await getValidToken();
            // if (!token) return;

            // const [profile, topTracks] = await Promise.all([
            //     getMyProfile(token),
            //     getMyTopTracks(token, 'short_term', 10),
            // ]);

            // setUser(profile);
            // setTracks(topTracks.items);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [getValidToken]);

    return (
        <ThemedView className="flex-1">
            <View className="flex-1"></View>
            <TouchableOpacity onPress={login} disabled={!isReady} className="bg-accent mb-14 rounded-2xl w-2/3 h-16 items-center justify-center self-center">
                <ThemedText>Login com Spotify</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    )
}