import { HeroDrawerContent } from '@/features/home/components/hero-drawer-content';
import { useMe } from '@/features/auth/hooks/use-auth';
import { signOutGoogle } from '@/features/auth/api/google-auth';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useSpotifyAuthContext } from '@/features/auth/store/spotify-auth.context';
import { useTheme as useThemeSwitch } from '@/shared/ui/organisms/theme-switch/hooks';
import { AnimationType } from '@/shared/ui/organisms/theme-switch/types';
import { getAuth } from '@react-native-firebase/auth';
import { useRouter, useSegments } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useCallback } from 'react';

export default function DrawerLayout() {
  const router = useRouter();
  const segments = useSegments();

  // Consome o Spotify auth do contexto provido pelo root _layout.tsx
  // — garante que é o mesmo useAuthRequest (não uma segunda instância)
  const { login, isReady } = useSpotifyAuthContext();

  const clearSpotifyTokens = useAuthStore((s) => s.clearSpotifyTokens);
  const isSpotifyConnected = useAuthStore((s) => s.isSpotifyConnected);
  const { data: profile } = useMe();
  const { isDark, toggleTheme } = useThemeSwitch();

  const firebaseUser = getAuth().currentUser;
  const activeRoute = segments[segments.length - 1] ?? 'index';

  const handleLogout = useCallback(async () => {
    clearSpotifyTokens();
    await signOutGoogle();
    router.replace('/(auth)');
  }, [clearSpotifyTokens, router]);

  return (
    <Drawer
      drawerContent={() => (
        <HeroDrawerContent
          activeRoute={activeRoute}
          avatarUrl={profile?.images?.[0]?.url ?? firebaseUser?.photoURL}
          displayName={profile?.display_name ?? firebaseUser?.displayName ?? 'Luke'}
          isGoogleConnected={Boolean(firebaseUser)}
          isSpotifyConnected={isSpotifyConnected}
          isDark={isDark}
          onLogout={handleLogout}
          onSpotifyPress={() => {
            if (isReady && !isSpotifyConnected) login();
          }}
          onThemePress={(event) =>
            toggleTheme({
              animationType: isDark ? AnimationType.CircularInverted : AnimationType.Circular,
              touchX: event.nativeEvent.pageX,
              touchY: event.nativeEvent.pageY,
            })
          }
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.55)',
        drawerStyle: {
          width: 330,
          backgroundColor: '#070a0f',
        },
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Hero's Hub" }} />
      <Drawer.Screen name="explore" options={{ title: 'Quest Log' }} />
    </Drawer>
  );
}
