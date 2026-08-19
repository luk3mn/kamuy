import { useRouter } from 'expo-router';
import {
  Check,
  ChevronRight,
  Flame,
  Gem,
  Home,
  LogOut,
  Moon,
  Music2,
  Pencil,
  Shield,
  Sun
} from 'lucide-react-native';
import type { ComponentType, ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type DrawerItem = {
  icon: ComponentType<{ color: string; size: number; strokeWidth?: number }>;
  label: string;
  route?: 'index' | 'explore';
};

type HeroDrawerContentProps = {
  activeRoute: string;
  avatarUrl?: string | null;
  displayName?: string | null;
  isGoogleConnected: boolean;
  isSpotifyConnected: boolean;
  isDark: boolean;
  onLogout: () => void;
  onSpotifyPress: () => void;
  onThemePress: (event: { nativeEvent: { pageX: number; pageY: number } }) => void;
};

const MENU_ITEMS: DrawerItem[] = [
  { icon: Home, label: "Hero's Hub", route: 'index' },
  // { icon: NotebookText, label: 'Quest Log', route: 'explore' },
  // { icon: Gem, label: 'Manifestação' },
  // { icon: BriefcaseBusiness, label: 'Inventário & Loja' },
  // { icon: CircleGauge, label: 'Ficha de Atributos' },
  // { icon: Settings, label: 'Configurações' },
];

export function HeroDrawerContent({
  activeRoute,
  avatarUrl,
  displayName,
  isGoogleConnected,
  isSpotifyConnected,
  isDark,
  onLogout,
  onSpotifyPress,
  onThemePress,
}: HeroDrawerContentProps) {
  const router = useRouter();

  const handleNavigate = (route?: string) => {
    if (!route) return;
    router.push(route === 'index' ? '/' : '/explore');
  };

  return (
    <View style={styles.shell}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrap}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>{(displayName ?? 'Luke').slice(0, 1)}</Text>
            </View>
          )}
        </View>

        <View style={styles.profileText}>
          <Text selectable style={styles.name} numberOfLines={1}>
            {displayName ?? 'Luke'}
          </Text>
          <Text selectable style={styles.rank} numberOfLines={1}>
            Guerreiro • Nível 6
          </Text>
        </View>

        <Pressable style={styles.editButton} hitSlop={8}>
          <Pencil color="#ffffff" size={16} />
        </Pressable>
      </View>

      <View style={styles.xpArea}>
        <View style={styles.xpHeader}>
          <Text selectable style={styles.xpText}>
            <Text style={styles.xpStrong}>420</Text> / 600 XP
          </Text>
          <Shield color="#6d5bff" size={58} strokeWidth={1.6} />
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <Text selectable style={styles.nextLevel}>
          Próximo nível: <Text style={styles.nextLevelAccent}>180 XP</Text>
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <Metric icon={<Flame color="#ff663d" size={26} fill="#ff663d" />} value="8 dias" label="Streak" />
        <Metric icon={<Gem color="#ffd15a" size={25} />} value="580" label="Gold" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MENU</Text>
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => {
            const isActive = activeRoute === item.route;
            const Icon = item.icon;

            return (
              <Pressable
                key={item.label}
                onPress={() => handleNavigate(item.route)}
                style={({ pressed }) => [
                  styles.menuItem,
                  isActive && styles.menuItemActive,
                  pressed && styles.pressed,
                ]}>
                <Icon color={isActive ? '#7f7cff' : '#a5abb8'} size={24} strokeWidth={1.8} />
                <Text style={styles.menuText}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CONEXÕES</Text>
        <ConnectionRow icon="spotify" label="Spotify" connected={isSpotifyConnected} onPress={onSpotifyPress} />
        <ConnectionRow icon="google" label="Google" connected={isGoogleConnected} />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>GERAL</Text>
        <Pressable style={styles.generalRow} onPress={onThemePress}>
          {isDark ? <Sun color="#a5abb8" size={24} /> : <Moon color="#a5abb8" size={24} />}
          <Text style={styles.generalText}>Tema</Text>
          <ChevronRight color="#5f6470" size={18} />
        </Pressable>
        <Pressable style={styles.generalRow} onPress={onLogout}>
          <LogOut color="#ff5a5f" size={24} />
          <Text style={styles.generalText}>Sair da conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Metric({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}>{icon}</View>
      <View>
        <Text selectable style={styles.metricValue}>
          {value}
        </Text>
        <Text selectable style={styles.metricLabel}>
          {label}
        </Text>
      </View>
    </View>
  );
}

function ConnectionRow({
  icon,
  label,
  connected,
  onPress,
}: {
  icon: 'spotify' | 'google';
  label: string;
  connected: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.connectionRow, pressed && styles.pressed]}>
      <View style={[styles.connectionIcon, icon === 'spotify' ? styles.spotifyIcon : styles.googleIcon]}>
        {icon === 'spotify' ? (
          <Music2 color="#04110a" size={16} strokeWidth={3} />
        ) : (
          <Text style={styles.googleLetter}>G</Text>
        )}
      </View>
      <Text style={styles.connectionLabel}>{label}</Text>
      <Text style={styles.connectionStatus}>{connected ? 'Conectado' : 'Conectar'}</Text>
      {connected ? (
        <View style={styles.connectionCheck}>
          <Check color="#4fe372" size={13} strokeWidth={3} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    gap: 22,
    paddingHorizontal: 24,
    paddingTop: 32,
    backgroundColor: '#070a0f',
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  avatarWrap: {
    borderRadius: 46,
    padding: 2,
    backgroundColor: '#6d5bff',
    boxShadow: '0 0 24px rgba(109, 91, 255, 0.7)',
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: '#18213a',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22283a',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  profileText: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  rank: {
    color: '#8d86ff',
    fontSize: 15,
    fontWeight: '600',
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  xpArea: {
    gap: 8,
  },
  xpHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpText: {
    color: '#75a7ff',
    fontSize: 16,
    fontWeight: '700',
  },
  xpStrong: {
    color: '#ffffff',
  },
  progressTrack: {
    height: 12,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#101421',
    borderWidth: 1,
    borderColor: '#20263a',
  },
  progressFill: {
    width: '70%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#725cff',
    boxShadow: '0 0 14px rgba(99, 102, 241, 0.8)',
  },
  nextLevel: {
    color: '#b9bdc8',
    fontSize: 13,
  },
  nextLevelAccent: {
    color: '#7da2ff',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 66,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.065)',
    borderCurve: 'continuous',
  },
  metricIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    color: '#b7bac5',
    fontSize: 12,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    color: '#8e94a3',
    fontSize: 12,
    letterSpacing: 0,
  },
  menuList: {
    gap: 4,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderCurve: 'continuous',
  },
  menuItemActive: {
    backgroundColor: '#2d2f72',
  },
  menuText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  connectionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 38,
  },
  connectionIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  spotifyIcon: {
    backgroundColor: '#1ed760',
  },
  googleIcon: {
    backgroundColor: '#ffffff',
  },
  googleLetter: {
    color: '#4285f4',
    fontSize: 16,
    fontWeight: '900',
  },
  connectionLabel: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  connectionStatus: {
    color: '#b7bac5',
    fontSize: 13,
  },
  connectionCheck: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#36ce58',
  },
  generalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    minHeight: 42,
  },
  generalText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.72,
  },
});
