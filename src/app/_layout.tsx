import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider, useRouter, useSegments } from 'expo-router';
import { Image, StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import "@/global.css";
import { useMe } from '@/hooks/api/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import {
  ThemeMode,
  ThemeProvider as ThemeSwitchProvider,
} from '@/shared/ui/organisms/theme-switch/context';
import { useTheme as useThemeSwitch } from '@/shared/ui/organisms/theme-switch/hooks';
import { AnimationType } from '@/shared/ui/organisms/theme-switch/types';
import { useAuthStore } from '@/stores/auth.store';
import { Entypo, Feather } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Drawer } from 'expo-router/drawer';
import { useCallback, useEffect } from 'react';
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
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: profile } = useMe();

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

  const handleLogout = useCallback(() => {
    logout();
    router.replace('/(auth)');
  }, [logout, router]);

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {isAuthenticated ? (
        <Drawer
          drawerContent={() => (
            <View className='flex-1' style={{ marginTop: top, marginBottom: bottom }}>

              <View className='px-6 py-5 flex-row items-center gap-3 mb-2'>
                {profile?.images?.[0]?.url ? (
                  <Image
                    source={{ uri: profile.images[0].url }}
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
                    {profile?.display_name ?? '—'}
                  </Text>
                  <Text
                    style={{ color: text, opacity: 0.5 }}
                    className='text-xs'
                    numberOfLines={1}
                  >
                    {profile?.email ?? ''}
                  </Text>
                </View>
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
        <ThemedView className="flex-1">
          <View className="flex-1" />
          <TouchableOpacity
            onPress={login}
            disabled={!isReady}
            className="flex-row gap-2 bg-accent mb-14 rounded-2xl w-2/3 h-16 items-center justify-center self-center"
          >
            <Entypo name='spotify' size={20} color={'#fff'} />
            <ThemedText>Login com Spotify</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </NavigationThemeProvider>
  );
}