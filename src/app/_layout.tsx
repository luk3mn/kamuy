import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import "@/global.css";
import { Drawer } from 'expo-router/drawer';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer
          screenOptions={{
            headerTitle: () => null,
            headerBackground: () => null,
          }}
        >
          <Drawer.Screen name="index" options={{ title: 'Home' }} />
          <Drawer.Screen name="explore" options={{ title: 'Insights' }} />
        </Drawer>
    </ThemeProvider>
  );
}
