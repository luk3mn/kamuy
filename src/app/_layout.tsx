import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { HeroDrawerContent } from '@/components/hero-drawer-content';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import "@/global.css";
import { useMe } from '@/hooks/api/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { signInWithGoogle, signOutGoogle } from '@/services/googleAuth';
import {
  ThemeMode,
  ThemeProvider as ThemeSwitchProvider,
} from '@/shared/ui/organisms/theme-switch/context';
import { useTheme as useThemeSwitch } from '@/shared/ui/organisms/theme-switch/hooks';
import { AnimationType } from '@/shared/ui/organisms/theme-switch/types';
import { useAuthStore } from '@/stores/auth.store';
import { AntDesign } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged, User } from '@react-native-firebase/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Drawer } from 'expo-router/drawer';
import { useCallback, useEffect, useState } from 'react';

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

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const defaultTheme = colorScheme === 'dark' ? ThemeMode.Dark : ThemeMode.Light;

  return (
    <ThemeSwitchProvider
      defaultTheme={defaultTheme}
      customLightColors={Colors.light}
      customDarkColors={Colors.dark}
    >
      <QueryClientProvider client={queryClient}>
        <DrawerLayout />
      </QueryClientProvider>
    </ThemeSwitchProvider>
  );
}

function DrawerLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { login, getValidToken, isReady } = useSpotifyAuth();
  const clearSpotifyTokens = useAuthStore((s) => s.clearSpotifyTokens);
  const isSpotifyConnected = useAuthStore((s) => s.isSpotifyConnected);
  const { data: profile } = useMe();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setFirebaseUser(user);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const loadData = useCallback(async () => {
    try {
      const token = await getValidToken();
      if (!token) return;
    } catch (e) {
      console.error(e);
    }
  }, [getValidToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const { background, backgroundElement, primary, text } = useTheme();
  const { isDark, toggleTheme } = useThemeSwitch();
  const activeRoute = segments[segments.length - 1] ?? 'index';

  const handleGoogleSignIn = useCallback(async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      router.replace('/');
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Falha ao entrar com Google');
    } finally {
      setIsSigningIn(false);
    }
  }, [router]);

  const handleLogout = useCallback(async () => {
    clearSpotifyTokens();
    await signOutGoogle();
    router.replace('/(auth)');
  }, [clearSpotifyTokens, router]);

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {!isAuthReady ? (
        <ThemedView className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </ThemedView>
      ) : firebaseUser ? (
        <Drawer
          drawerContent={() => (
            <HeroDrawerContent
              activeRoute={activeRoute}
              avatarUrl={profile?.images?.[0]?.url ?? firebaseUser.photoURL}
              displayName={profile?.display_name ?? firebaseUser.displayName ?? 'Luke'}
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
          <Drawer.Screen
            name="index"
            options={{
              title: 'Home',
              drawerStyle: { backgroundColor: backgroundElement },
              drawerActiveTintColor: primary,
              drawerInactiveTintColor: text,
            }}
          />
          <Drawer.Screen
            name="explore"
            options={{
              title: 'Insights',
              drawerStyle: { backgroundColor: backgroundElement },
              drawerActiveTintColor: primary,
              drawerInactiveTintColor: text,
            }}
          />
        </Drawer>
      ) : (
        <ThemedView className="flex-1 px-8">
          <View className="flex-1" />
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={isSigningIn}
            className="flex-row gap-3 mb-3 rounded-2xl w-full h-16 items-center justify-center self-center"
            style={{ backgroundColor: primary, opacity: isSigningIn ? 0.7 : 1 }}
          >
            <AntDesign name='google' size={20} color={'#fff'} />
            <ThemedText>{isSigningIn ? 'Entrando...' : 'Entrar com Google'}</ThemedText>
          </TouchableOpacity>
          {authError ? (
            <Text className='mb-10 text-center text-sm' style={{ color: '#f44' }}>
              {authError}
            </Text>
          ) : (
            <View className='mb-10' />
          )}
        </ThemedView>
      )}
    </NavigationThemeProvider>
  );
}
