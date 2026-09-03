import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// CRÍTICO: deve ser chamado na tela de callback.
// Intercepta a URL de retorno do Spotify e fecha o WebBrowser,
// entregando o `code` para o useAuthRequest que está aguardando no _layout.
WebBrowser.maybeCompleteAuthSession();

export default function CallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    // Aguarda um tick para o maybeCompleteAuthSession fechar o browser
    // e o useAuthRequest no _layout processar a resposta antes de navegar.
    const timer = setTimeout(() => {
      router.replace('/(drawer)');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}