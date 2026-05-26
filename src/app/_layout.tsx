import { DarkTheme, DefaultTheme, ThemeProvider, useRouter, useSegments } from 'expo-router';
import { StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import "@/global.css";
import { useTheme } from '@/hooks/use-theme';
import { Drawer } from 'expo-router/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { label: 'Today', route: 'index', icon: 'calendar' },
  // { label: 'Journal History', route: 'journal', icon: 'clock' },
  { label: 'Mood Analytics', route: 'explore', icon: 'activity' },
  // { label: 'Settings', route: 'settings', icon: 'settings' },
] as const;

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();

  const colorScheme = useColorScheme();
  const { background, backgroundElement, primary, text } = useTheme();

  const { top, bottom } = useSafeAreaInsets();
  const activeRoute = segments[segments.length - 1] ?? 'index';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
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
                    className='mx-4 p-4 flex-row items-center justify-between rounded-full'
                    activeOpacity={0.7}
                  >
                    {/* <Feather
                          name={icon}
                          size={20}
                          color={isActive ? '#fff' : textSecondary}
                          style={styles.icon}
                        /> */}
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
            <View>
              <Text className='text-primary-text'>Drawer</Text>
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
    </ThemeProvider>
  );
}
