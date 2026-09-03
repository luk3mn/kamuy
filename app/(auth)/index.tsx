import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { signInWithGoogle } from "@/features/auth/api/google-auth";
import { AntDesign } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Não precisa de router.replace aqui:
      // o AuthGate detecta onAuthStateChanged e redireciona automaticamente
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao entrar com Google");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 32 }}>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={loading}
        style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 12,
          borderRadius: 16,
          width: '100%',
          height: 64,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#6366f1',
          opacity: loading ? 0.7 : 1,
        }}
      >
        <AntDesign name="google" size={20} color="#fff" />
        <ThemedText>{loading ? "Entrando..." : "Entrar com Google"}</ThemedText>
      </TouchableOpacity>
      {error ? (
        <Text style={{ marginBottom: 40, textAlign: 'center', fontSize: 14, color: '#f44' }}>
          {error}
        </Text>
      ) : (
        <View style={{ marginBottom: 40 }} />
      )}
    </ThemedView>
  );
}
