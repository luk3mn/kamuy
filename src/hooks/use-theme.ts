import { Colors } from '@/theme/tokens';
import { useTheme as useThemeSwitch } from '@/shared/ui/organisms/theme-switch/hooks';
import { ThemeMode } from '@/shared/ui/organisms/theme-switch/types';

export function useTheme() {
  const { theme } = useThemeSwitch();
  const scheme = theme === ThemeMode.Dark ? 'dark' : 'light';
  return Colors[scheme];
}
