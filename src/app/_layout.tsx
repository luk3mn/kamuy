import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider, useRouter, useSegments } from 'expo-router';
import { StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { Colors } from '@/constants/theme';
import "@/global.css";
import { useTheme } from '@/hooks/use-theme';
import {
  ThemeMode,
  ThemeProvider as ThemeSwitchProvider,
} from '@/shared/ui/organisms/theme-switch/context';
import { useTheme as useThemeSwitch } from '@/shared/ui/organisms/theme-switch/hooks';
import { AnimationType } from '@/shared/ui/organisms/theme-switch/types';
import { Feather } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { label: 'Today', route: 'index', icon: 'calendar' },
  // { label: 'Journal History', route: 'journal', icon: 'clock' },
  { label: 'Mood Analytics', route: 'explore', icon: 'activity' },
  // { label: 'Settings', route: 'settings', icon: 'settings' },
] as const;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const defaultTheme = colorScheme === 'dark' ? ThemeMode.Dark : ThemeMode.Light;

  return (
    <ThemeSwitchProvider
      defaultTheme={defaultTheme}
      customLightColors={Colors.light}
      customDarkColors={Colors.dark}
    >
      <DrawerLayout />
    </ThemeSwitchProvider>
  );
}

function DrawerLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { background, backgroundElement, primary, text } = useTheme();
  const { isDark, toggleTheme } = useThemeSwitch();

  const { top, bottom } = useSafeAreaInsets();
  const activeRoute = segments[segments.length - 1] ?? 'index';

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Drawer
        drawerContent={() => (
          <View className='flex-1' style={{ marginTop: top, marginBottom: bottom }}>
            <View className='flex-1'>
              {NAV_ITEMS.map(({ label, route, icon }) => {
                const isActive = activeRoute === route;
                return (
                  <TouchableOpacity
                    key={route}
                    onPress={() => router.push(`/${route === 'index' ? '' : route}`)}
                    style={[
                      // styles.item,
                      isActive && { backgroundColor: primary },
                    ]}
                    className='mx-4 p-4 flex-row items-center gap-4 rounded-full'
                    activeOpacity={0.7}
                  >
                    <Feather
                          name={icon}
                          size={20}
                          color={isActive ? '#fff' : text}
                        />
                    <Text style={[
                      { color: isActive ? '#fff' : text },
                      isActive && { color: '#fff' },
                    ]} className='text-lg font-semibold'>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className='px-4 pb-4'>
              <TouchableOpacity
                onPress={(event) =>
                  toggleTheme({
                    animationType: isDark
                      ? AnimationType.CircularInverted
                      : AnimationType.Circular,
                    touchX: event.nativeEvent.pageX,
                    touchY: event.nativeEvent.pageY,
                  })
                }
                activeOpacity={0.7}
                className='h-12 w-12 items-center justify-center rounded-full'
                style={{
                  backgroundColor: background,
                  borderColor: primary,
                  borderWidth: 1,
                }}
              >
                <Feather
                  name={isDark ? "sun" : "moon"}
                  color={primary}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        screenOptions={{
          headerTitle: () => null,
          headerBackground: () => null,
          headerBackgroundContainerStyle: {
            backgroundColor: background,
          },
          drawerType: 'front',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Home',
            drawerStyle: {
              backgroundColor: backgroundElement,
            },
            drawerActiveTintColor: primary,
            drawerInactiveTintColor: text
          }}
        />
        <Drawer.Screen
          name="explore"
          options={{
            title: 'Insights',
            drawerStyle: {
              backgroundColor: backgroundElement,
            },
            drawerActiveTintColor: primary,
            drawerInactiveTintColor: text
          }}
        />
      </Drawer>
    </NavigationThemeProvider>
  );
}
