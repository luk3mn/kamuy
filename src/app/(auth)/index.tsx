import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { signInWithGoogle } from "@/services/googleAuth";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Auth() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
            router.replace("/");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Falha ao entrar com Google");
        } finally {
            setLoading(false);
        }
    }, [router]);

    return (
        <ThemedView className="flex-1 px-8">
            <View className="flex-1"></View>
            <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                className="bg-primary mb-3 rounded-2xl w-full h-16 flex-row gap-3 items-center justify-center self-center"
                style={{ opacity: loading ? 0.7 : 1 }}
            >
                <AntDesign name="google" size={20} color="#fff" />
                <ThemedText>{loading ? "Entrando..." : "Entrar com Google"}</ThemedText>
            </TouchableOpacity>
            {error ? (
                <Text className="mb-10 text-center text-sm" style={{ color: "#f44" }}>
                    {error}
                </Text>
            ) : (
                <View className="mb-10" />
            )}
        </ThemedView>
    )
}
