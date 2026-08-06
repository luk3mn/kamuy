import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, Image, StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

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
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged, User } from '@react-native-firebase/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Drawer } from 'expo-router/drawer';
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { label: 'Hoje', route: 'index', icon: 'calendar' },
  { label: 'Explorar', route: 'explore', icon: 'activity' },
] as const;

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
  const { top, bottom } = useSafeAreaInsets();
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
            <View className='flex-1' style={{ marginTop: top, marginBottom: bottom }}>

              <View className='px-6 py-5 flex-row items-center gap-3 mb-2'>
                {(profile?.images?.[0]?.url || firebaseUser.photoURL) ? (
                  <Image
                    source={{ uri: profile?.images?.[0]?.url ?? firebaseUser.photoURL! }}
                    className='w-12 h-12 rounded-full'
                  />
                ) : (
                  <View
                    className='w-12 h-12 rounded-full items-center justify-center'
                    style={{ backgroundColor: primary }}
                  >
                    <Feather name='user' size={22} color='#fff' />
                  </View>
                )}
                <View className='flex-1'>
                  <Text
                    style={{ color: text }}
                    className='font-bold text-base'
                    numberOfLines={1}
                  >
                    {profile?.display_name ?? firebaseUser.displayName ?? 'Kamuy Hero'}
                  </Text>
                  <Text
                    style={{ color: text, opacity: 0.5 }}
                    className='text-xs'
                    numberOfLines={1}
                  >
                    {profile?.email ?? firebaseUser.email ?? ''}
                  </Text>
                </View>
              </View>

              <View className='px-4 mb-4'>
                <TouchableOpacity
                  onPress={login}
                  disabled={!isReady || isSpotifyConnected}
                  activeOpacity={0.7}
                  className='h-12 px-4 flex-row items-center justify-center gap-2 rounded-full'
                  style={{
                    backgroundColor: isSpotifyConnected ? background : '#1DB954',
                    borderColor: isSpotifyConnected ? '#1DB954' : 'transparent',
                    borderWidth: 1,
                    opacity: !isReady && !isSpotifyConnected ? 0.5 : 1,
                  }}
                >
                  <Entypo name='spotify' size={18} color={isSpotifyConnected ? '#1DB954' : '#fff'} />
                  <Text
                    style={{ color: isSpotifyConnected ? '#1DB954' : '#fff' }}
                    className='font-semibold'
                  >
                    {isSpotifyConnected ? 'Spotify conectado' : 'Conectar Spotify'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className='flex-1'>
                {NAV_ITEMS.map(({ label, route, icon }) => {
                  const isActive = activeRoute === route;
                  return (
                    <TouchableOpacity
                      key={route}
                      onPress={() => router.push(`/${route === 'index' ? '' : route}`)}
                      style={[isActive && { backgroundColor: primary }]}
                      className='mx-4 p-4 flex-row items-center gap-4 rounded-full'
                      activeOpacity={0.7}
                    >
                      <Feather name={icon} size={20} color={isActive ? '#fff' : text} />
                      <Text
                        style={{ color: isActive ? '#fff' : text }}
                        className='text-lg font-semibold'
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View className='px-4 pb-4 flex-row items-center justify-between'>
                <TouchableOpacity
                  onPress={(event) =>
                    toggleTheme({
                      animationType: isDark ? AnimationType.CircularInverted : AnimationType.Circular,
                      touchX: event.nativeEvent.pageX,
                      touchY: event.nativeEvent.pageY,
                    })
                  }
                  activeOpacity={0.7}
                  className='h-12 w-12 items-center justify-center rounded-full'
                  style={{ backgroundColor: background, borderColor: primary, borderWidth: 1 }}
                >
                  <Feather name={isDark ? 'sun' : 'moon'} color={primary} size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  activeOpacity={0.7}
                  className='h-12 w-12 items-center justify-center rounded-full'
                  style={{ backgroundColor: background, borderColor: '#f44', borderWidth: 1 }}
                >
                  <Feather name='log-out' size={20} color='#f44' />
                </TouchableOpacity>
              </View>

            </View>
          )}
          screenOptions={{
            headerTitle: () => null,
            headerBackground: () => null,
            headerBackgroundContainerStyle: { backgroundColor: background },
            drawerType: 'front',
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
