import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  Slot,
  useRouter,
  useSegments,
} from 'expo-router';
import { ActivityIndicator, StatusBar, useColorScheme } from 'react-native';

import { ThemedView } from '@/components/ui/themed-view';
import { useSpotifyAuth } from '@/features/auth/hooks/use-spotify-auth';
import { SpotifyAuthContext } from '@/features/auth/store/spotify-auth.context';
import '@/global.css';
import {
  ThemeMode,
  ThemeProvider as ThemeSwitchProvider,
} from '@/shared/ui/organisms/theme-switch/context';
import { useTheme as useThemeSwitch } from '@/shared/ui/organisms/theme-switch/hooks';
import { getAuth, onAuthStateChanged, User } from '@react-native-firebase/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 300000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const defaultTheme = colorScheme === 'dark' ? ThemeMode.Dark : ThemeMode.Light;

  return (
    <ThemeSwitchProvider defaultTheme={defaultTheme} customLightColors={{}} customDarkColors={{}}>
      <QueryClientProvider client={queryClient}>
        <AuthGate />
      </QueryClientProvider>
    </ThemeSwitchProvider>
  );
}

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { isDark } = useThemeSwitch();

  // useSpotifyAuth fica AQUI no root — sempre montado, nunca perde o `response`
  // durante navegações. O contexto expõe login/isReady para os filhos.
  const spotifyAuth = useSpotifyAuth();

  const [firebaseUser, setFirebaseUser] = useState<User | null | undefined>(
    getAuth().currentUser ?? undefined
  );

  useEffect(() => {
    return onAuthStateChanged(getAuth(), setFirebaseUser);
  }, []);

  useEffect(() => {
    if (firebaseUser === undefined) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!firebaseUser && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (firebaseUser && inAuthGroup) {
      router.replace('/(drawer)');
    }
  }, [firebaseUser, segments]);

  if (firebaseUser === undefined) {
    return (
      <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </ThemedView>
      </NavigationThemeProvider>
    );
  }

  return (
    <SpotifyAuthContext.Provider value={spotifyAuth}>
      <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Slot />
      </NavigationThemeProvider>
    </SpotifyAuthContext.Provider>
  );
}
