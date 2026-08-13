import { useNavigation } from 'expo-router';
import {
  Bell,
  BookOpen,
  ChevronRight,
  Dumbbell,
  Flame,
  Menu,
  Mountain,
  Plus,
  Shield,
  Sparkles,
} from 'lucide-react-native';
import type { ComponentType, ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HomeDashboardProps = {
  avatarUrl?: string | null;
  displayName?: string | null;
};

const MISSIONS = [
  {
    icon: Dumbbell,
    title: 'Academia',
    subtitle: 'Treino de força • 45 min',
    xp: '+100 XP',
    color: '#ffd15a',
  },
  {
    icon: BookOpen,
    title: 'Ler 20 páginas',
    subtitle: 'Livro ou material de estudo',
    xp: '+80 XP',
    color: '#4aa3ff',
  },
  {
    icon: Sparkles,
    title: 'Meditação',
    subtitle: '10 minutos de foco',
    xp: '+40 XP',
    color: '#9b5cff',
  },
];

export function HomeDashboard({ avatarUrl, displayName }: HomeDashboardProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const firstName = (displayName?.split(' ')[0] || 'Luke').trim();
  const isCompact = width < 380;

  const openDrawer = () => {
    const drawerNavigation = navigation as unknown as { openDrawer?: () => void };
    drawerNavigation.openDrawer?.();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + 18, 38),
            paddingBottom: insets.bottom + 96,
          },
        ]}>
        <View style={styles.header}>
          <Pressable onPress={openDrawer} style={styles.iconButton} hitSlop={8}>
            <Menu color="#d9dce5" size={25} />
          </Pressable>
          <Pressable style={styles.iconButton} hitSlop={8}>
            <Bell color="#d9dce5" size={23} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <View style={styles.greeting}>
          <Text selectable style={[styles.greetingTitle, isCompact && styles.greetingTitleCompact]}>
            Bom dia, <Text style={styles.greetingName}>{firstName}</Text>
          </Text>
          <Text selectable style={styles.greetingSubtitle}>
            Continue sua evolução.
          </Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroBackdrop}>
            <Mountain color="rgba(255,255,255,0.08)" size={120} strokeWidth={1} />
          </View>
          <View style={styles.heroSilhouette}>
            <Shield color="rgba(255,255,255,0.12)" size={86} strokeWidth={1.2} />
          </View>
          <View style={styles.avatarWrap}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>{firstName.slice(0, 1)}</Text>
              </View>
            )}
            <Text style={styles.crown}>♛</Text>
          </View>
          <View style={styles.heroInfo}>
            <View style={styles.rankRow}>
              <Text selectable style={styles.rankTitle}>
                Guerreiro
              </Text>
              <Text selectable style={styles.rankBadge}>
                Nível 6
              </Text>
            </View>
            <Text selectable style={styles.xpLabel}>
              420 / 600 XP
            </Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Text selectable style={styles.nextLevel}>
              Próximo nível: 180 XP
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <Metric icon={<Flame color="#ff663d" size={27} fill="#ff663d" />} value="8" label="Streak" />
          <Metric icon={<Text style={styles.coin}>⊙</Text>} value="580" label="Gold" />
        </View>

        <View style={styles.auraCard}>
          <View style={styles.spotifyMark}>
            <Text style={styles.spotifyGlyph}>≋</Text>
          </View>
          <View style={styles.auraText}>
            <Text selectable style={styles.auraSmall}>
              Aura do dia
            </Text>
            <Text selectable style={styles.auraTitle}>
              Aura de Foco & Harmonia
            </Text>
            <Text selectable style={styles.auraBoost}>
              +10% em Espírito (SPR)
            </Text>
          </View>
          <Waveform />
        </View>

        <View style={styles.attributesCard}>
          <View style={styles.cardHeader}>
            <Text selectable style={styles.sectionTitle}>
              Atributos
            </Text>
            <Pressable style={styles.detailsButton}>
              <Text style={styles.detailsText}>Detalhes</Text>
              <ChevronRight color="#aeb3bf" size={17} />
            </Pressable>
          </View>
          <AttributeRadar />
        </View>

        <View style={styles.missionsHeader}>
          <Text selectable style={styles.sectionTitle}>
            Missões prioritárias
          </Text>
          <Pressable style={styles.detailsButton}>
            <Text style={styles.detailsText}>Ver todas</Text>
            <ChevronRight color="#aeb3bf" size={17} />
          </Pressable>
        </View>

        <View style={styles.missionList}>
          {MISSIONS.map((mission) => (
            <MissionRow key={mission.title} {...mission} />
          ))}
        </View>
      </ScrollView>

      <Pressable style={[styles.floatingAction, { bottom: insets.bottom + 18 }]} hitSlop={8}>
        <Plus color="#ffffff" size={33} strokeWidth={2.2} />
      </Pressable>
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

function Waveform() {
  const heights = [8, 16, 22, 30, 20, 42, 34, 54, 26, 60, 38, 70, 24, 64, 45, 76, 30, 56, 70, 82, 42, 66, 78];

  return (
    <View style={styles.waveform}>
      {heights.map((height, index) => (
        <View
          key={`${height}-${index}`}
          style={[
            styles.waveBar,
            {
              height: height * 0.56,
              opacity: 0.22 + index / heights.length,
            },
          ]}
        />
      ))}
    </View>
  );
}

function AttributeRadar() {
  return (
    <View style={styles.radarWrap}>
      <View style={styles.statTop}>
        <Text selectable style={styles.statLabel}>
          SPR
        </Text>
        <Text selectable style={[styles.statValue, { color: '#a855ff' }]}>
          72
        </Text>
      </View>
      <View style={styles.statRight}>
        <Text selectable style={styles.statLabel}>
          STR
        </Text>
        <Text selectable style={[styles.statValue, { color: '#ff5f62' }]}>
          75
        </Text>
      </View>
      <View style={styles.statBottom}>
        <Text selectable style={styles.statLabel}>
          VIT
        </Text>
        <Text selectable style={[styles.statValue, { color: '#5def91' }]}>
          80
        </Text>
      </View>
      <View style={styles.statLeft}>
        <Text selectable style={styles.statLabel}>
          INT
        </Text>
        <Text selectable style={[styles.statValue, { color: '#58b6ff' }]}>
          68
        </Text>
      </View>

      <Svg width="260" height="168" viewBox="0 0 260 168">
        <Polygon points="130,14 230,84 130,154 30,84" fill="none" stroke="rgba(255,255,255,0.17)" />
        <Polygon points="130,39 194,84 130,129 66,84" fill="none" stroke="rgba(255,255,255,0.12)" />
        <Polygon points="130,63 160,84 130,105 100,84" fill="none" stroke="rgba(255,255,255,0.08)" />
        <Line x1="130" y1="14" x2="130" y2="154" stroke="rgba(255,255,255,0.1)" />
        <Line x1="30" y1="84" x2="230" y2="84" stroke="rgba(255,255,255,0.1)" />
        <Polygon points="130,36 210,84 130,135 64,84" fill="rgba(112,92,255,0.26)" stroke="#755cff" strokeWidth="2" />
        <Polygon points="130,36 210,84 130,135 64,84" fill="rgba(37,201,134,0.22)" stroke="rgba(85, 239, 145, 0.5)" />
        <Circle cx="130" cy="36" r="4" fill="#a855ff" />
        <Circle cx="210" cy="84" r="4" fill="#ff6a62" />
        <Circle cx="130" cy="135" r="4" fill="#5def91" />
        <Circle cx="64" cy="84" r="4" fill="#58b6ff" />
      </Svg>
    </View>
  );
}

function MissionRow({
  icon: Icon,
  title,
  subtitle,
  xp,
  color,
}: {
  icon: ComponentType<{ color: string; size: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  xp: string;
  color: string;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.missionRow, pressed && styles.pressed]}>
      <View style={[styles.missionIcon, { borderColor: `${color}66` }]}>
        <Icon color={color} size={21} strokeWidth={1.9} />
      </View>
      <View style={styles.missionText}>
        <Text selectable style={styles.missionTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text selectable style={styles.missionSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Text selectable style={[styles.missionXp, { color }]}>
        {xp}
      </Text>
      <View style={[styles.missionRing, { borderColor: color }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#05070b',
  },
  content: {
    gap: 10,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
  },
  notificationDot: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#7657ff',
  },
  greeting: {
    gap: 2,
    paddingBottom: 8,
  },
  greetingTitle: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 0,
  },
  greetingTitleCompact: {
    fontSize: 23,
  },
  greetingName: {
    color: '#755cff',
  },
  greetingSubtitle: {
    color: '#c5c7d0',
    fontSize: 15,
  },
  heroCard: {
    minHeight: 146,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: '#151821',
  },
  heroBackdrop: {
    position: 'absolute',
    right: 44,
    bottom: -12,
  },
  heroSilhouette: {
    position: 'absolute',
    right: 18,
    top: 24,
  },
  avatarWrap: {
    borderRadius: 54,
    padding: 2,
    backgroundColor: '#4b8dff',
    boxShadow: '0 0 24px rgba(82, 127, 255, 0.42)',
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 2,
    borderColor: '#1b2034',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#272d45',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
  },
  crown: {
    position: 'absolute',
    right: 2,
    top: -12,
    color: '#ffd45b',
    fontSize: 27,
    transform: [{ rotate: '16deg' }],
  },
  heroInfo: {
    flex: 1,
    gap: 8,
  },
  rankRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rankTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  rankBadge: {
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    color: '#b8adff',
    backgroundColor: 'rgba(116, 92, 255, 0.25)',
    fontSize: 12,
    fontWeight: '800',
  },
  xpLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  progressFill: {
    width: '70%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#7657ff',
    boxShadow: '0 0 13px rgba(117, 92, 255, 0.84)',
  },
  nextLevel: {
    color: '#c7c9d2',
    fontSize: 13,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 14,
    minHeight: 62,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  metricIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    color: '#c0c3cd',
    fontSize: 12,
  },
  coin: {
    color: '#ffd15a',
    fontSize: 28,
    fontWeight: '900',
  },
  auraCard: {
    alignItems: 'center',
    minHeight: 76,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: '#252078',
  },
  spotifyMark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1ed760',
  },
  spotifyGlyph: {
    color: '#062312',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 27,
    transform: [{ rotate: '180deg' }],
  },
  auraText: {
    flex: 1,
    zIndex: 1,
  },
  auraSmall: {
    color: '#d5d3ff',
    fontSize: 13,
  },
  auraTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  auraBoost: {
    color: '#ffffff',
    fontSize: 13,
  },
  waveform: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  waveBar: {
    width: 4,
    borderRadius: 3,
    backgroundColor: '#69b8ff',
    boxShadow: '0 0 12px rgba(91, 144, 255, 0.78)',
  },
  attributesCard: {
    gap: 8,
    minHeight: 224,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  detailsButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  detailsText: {
    color: '#aeb3bf',
    fontSize: 13,
  },
  radarWrap: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    minHeight: 168,
    width: '100%',
    maxWidth: 330,
  },
  statTop: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  statRight: {
    position: 'absolute',
    right: 6,
    top: 74,
    alignItems: 'center',
  },
  statBottom: {
    position: 'absolute',
    bottom: -3,
    alignItems: 'center',
  },
  statLeft: {
    position: 'absolute',
    left: 8,
    top: 74,
    alignItems: 'center',
  },
  statLabel: {
    color: '#cbd0dc',
    fontSize: 12,
    fontWeight: '800',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
    fontVariant: ['tabular-nums'],
  },
  missionsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  missionList: {
    gap: 4,
  },
  missionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255,255,255,0.065)',
  },
  missionIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  missionText: {
    flex: 1,
  },
  missionTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  missionSubtitle: {
    color: '#c3c6d0',
    fontSize: 12,
  },
  missionXp: {
    fontSize: 13,
    fontWeight: '900',
  },
  missionRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  floatingAction: {
    position: 'absolute',
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#684cff',
    boxShadow: '0 8px 28px rgba(104, 76, 255, 0.62)',
  },
  pressed: {
    opacity: 0.72,
  },
});
