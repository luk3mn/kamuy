import { useNavigation } from 'expo-router';
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  Dumbbell,
  Droplet,
  Menu,
  Plus,
  Salad,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Quest = {
  icon: ComponentType<{ color: string; size: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  tag: string;
  xp: string;
  color: string;
  progress: string;
  completed?: boolean;
};

const QUESTS: Quest[] = [
  {
    icon: Dumbbell,
    title: 'Treino de força',
    subtitle: 'Academia • 45 min',
    tag: 'STR',
    xp: '+100 XP',
    color: '#ff5257',
    progress: '0 / 1',
  },
  {
    icon: BookOpen,
    title: 'Ler 20 páginas',
    subtitle: 'Livro ou material de estudo',
    tag: 'INT',
    xp: '+80 XP',
    color: '#4b9dff',
    progress: '10 / 20',
  },
  {
    icon: Salad,
    title: 'Alimentação limpa',
    subtitle: 'Refeições saudáveis',
    tag: 'VIT',
    xp: '+60 XP',
    color: '#49e07a',
    progress: 'Concluída',
    completed: true,
  },
  {
    icon: Sparkles,
    title: 'Meditação',
    subtitle: '10 minutos de foco',
    tag: 'SPR',
    xp: '+40 XP',
    color: '#a45cff',
    progress: '0 / 1',
  },
  {
    icon: Droplet,
    title: 'Beber 2L de água',
    subtitle: 'Hidratação diária',
    tag: 'VIT',
    xp: '+30 XP',
    color: '#ffb42c',
    progress: '0 / 2L',
  },
];

export function QuestLogScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
            paddingBottom: insets.bottom + 42,
          },
        ]}>
        <View style={styles.header}>
          <Pressable onPress={openDrawer} style={styles.headerButton} hitSlop={8}>
            <Menu color="#d9dce5" size={33} strokeWidth={1.8} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerButton} hitSlop={8}>
              <SlidersHorizontal color="#ffffff" size={27} strokeWidth={2} />
            </Pressable>
            <Pressable style={styles.addButton} hitSlop={8}>
              <Plus color="#ffffff" size={30} strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text selectable style={styles.title}>
            Quest Log
          </Text>
          <Text selectable style={styles.subtitle}>
            Complete missões. Evolua sua lenda.
          </Text>
        </View>

        <View style={styles.tabs}>
          <Tab active icon={Target} label="Hoje" />
          <Tab icon={Calendar} label="Weekly Boss" />
          <Tab icon={CheckCircle2} label="Concluídas" />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Target color="#8c64ff" size={38} strokeWidth={2.2} />
          </View>
          <View style={styles.summaryColumn}>
            <Text selectable style={styles.summaryLabel}>
              Progresso do dia
            </Text>
            <Text selectable style={styles.summaryBig}>
              3 <Text style={styles.summaryAccent}>/ 7</Text>
            </Text>
            <Text selectable style={styles.summarySmall}>
              missões
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryWide}>
            <Text selectable style={styles.summaryLabel}>
              XP ganho
            </Text>
            <Text selectable style={styles.xpTotal}>
              220 XP
            </Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>
          <View style={styles.summaryGoal}>
            <Text selectable style={styles.summaryLabel}>
              Meta diária
            </Text>
            <Text selectable style={styles.goalValue}>
              500 XP
            </Text>
            <Trophy color="#8c64ff" size={44} strokeWidth={1.8} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text selectable style={styles.sectionTitle}>
            Missões de Hoje
          </Text>
          <Pressable style={styles.sortButton}>
            <Text style={styles.sortText}>Ordenar: Prioridade</Text>
            <ChevronDown color="#c7cad4" size={20} />
          </Pressable>
        </View>

        <View style={styles.questList}>
          {QUESTS.map((quest) => (
            <QuestRow key={quest.title} quest={quest} />
          ))}
        </View>

        <View style={styles.mentorCard}>
          <View style={styles.mentorIcon}>
            <Compass color="#9868ff" size={48} strokeWidth={1.7} />
          </View>
          <View style={styles.mentorText}>
            <Text selectable style={styles.mentorLabel}>
              Dica do Mentor
            </Text>
            <Text selectable style={styles.quote}>
              “Disciplina é escolher entre o que você quer agora e o que você mais quer.”
            </Text>
            <Text selectable style={styles.signature}>
              - Kamuy
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Tab({
  active,
  icon: Icon,
  label,
}: {
  active?: boolean;
  icon: ComponentType<{ color: string; size: number; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]}>
      <Icon color={active ? '#8c64ff' : '#a6acb8'} size={23} strokeWidth={1.9} />
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function QuestRow({ quest }: { quest: Quest }) {
  const Icon = quest.icon;

  return (
    <Pressable style={({ pressed }) => [styles.questRow, pressed && styles.pressed]}>
      <View style={[styles.timelineDot, { backgroundColor: quest.color, boxShadow: `0 0 12px ${quest.color}` }]} />
      <View style={[styles.questIcon, { borderColor: `${quest.color}66`, backgroundColor: `${quest.color}14` }]}>
        <Icon color={quest.color} size={36} strokeWidth={1.9} />
      </View>
      <View style={styles.questBody}>
        <Text selectable style={styles.questTitle} numberOfLines={1}>
          {quest.title}
        </Text>
        <Text selectable style={styles.questSubtitle} numberOfLines={1}>
          {quest.subtitle}
        </Text>
        <Text selectable style={[styles.questTag, { color: quest.color, backgroundColor: `${quest.color}22` }]}>
          {quest.tag}
        </Text>
      </View>
      <View style={styles.questAside}>
        <Text selectable style={[styles.questXp, { color: quest.color }]}>
          {quest.xp}
        </Text>
        <ProgressCircle color={quest.color} completed={quest.completed} />
        <Text selectable style={styles.questProgress}>
          {quest.progress}
        </Text>
      </View>
    </Pressable>
  );
}

function ProgressCircle({ color, completed }: { color: string; completed?: boolean }) {
  return (
    <View style={styles.progressCircleWrap}>
      {completed ? (
        <View style={[styles.completeCircle, { borderColor: color }]}>
          <Check color={color} size={19} strokeWidth={2.8} />
        </View>
      ) : (
        <Svg width="38" height="38" viewBox="0 0 38 38">
          <Circle cx="19" cy="19" r="14" stroke="rgba(255,255,255,0.12)" strokeWidth="4" fill="none" />
          <Circle cx="19" cy="19" r="14" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#05070b',
  },
  content: {
    gap: 24,
    paddingHorizontal: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
  },
  headerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    height: 58,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.055)',
  },
  titleBlock: {
    gap: 6,
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 54,
  },
  subtitle: {
    color: '#c5c7d0',
    fontSize: 22,
    lineHeight: 28,
  },
  tabs: {
    flexDirection: 'row',
    height: 78,
    overflow: 'hidden',
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#8c64ff',
  },
  tabText: {
    color: '#b7bbc6',
    fontSize: 16,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#8c64ff',
  },
  summaryCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 150,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(140,100,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.045)',
  },
  summaryIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(140,100,255,0.22)',
  },
  summaryColumn: {
    gap: 6,
    minWidth: 70,
  },
  summaryLabel: {
    color: '#c5c8d2',
    fontSize: 13,
  },
  summaryBig: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  summaryAccent: {
    color: '#8c64ff',
  },
  summarySmall: {
    color: '#c5c8d2',
    fontSize: 15,
  },
  summaryDivider: {
    width: 1,
    height: 92,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  summaryWide: {
    flex: 1,
    gap: 12,
    minWidth: 96,
  },
  xpTotal: {
    color: '#8c64ff',
    fontSize: 26,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 12,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  progressFill: {
    width: '54%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#7f66ff',
    boxShadow: '0 0 16px rgba(127,102,255,0.75)',
  },
  summaryGoal: {
    alignItems: 'flex-end',
    gap: 8,
    minWidth: 78,
  },
  goalValue: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  sortButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  sortText: {
    color: '#c5c8d2',
    fontSize: 15,
  },
  questList: {
    gap: 10,
  },
  questRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    minHeight: 118,
    paddingLeft: 28,
    paddingRight: 18,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  timelineDot: {
    position: 'absolute',
    left: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  questIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
  },
  questBody: {
    flex: 1,
    gap: 8,
  },
  questTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  questSubtitle: {
    color: '#c5c8d2',
    fontSize: 14,
  },
  questTag: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: '900',
  },
  questAside: {
    alignItems: 'flex-end',
    gap: 8,
    minWidth: 70,
  },
  questXp: {
    fontSize: 16,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  progressCircleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
  },
  completeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
  },
  questProgress: {
    color: '#d7d9e1',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  mentorCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    minHeight: 190,
    paddingHorizontal: 24,
    paddingVertical: 26,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  mentorIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 78,
    height: 78,
  },
  mentorText: {
    flex: 1,
    gap: 12,
  },
  mentorLabel: {
    color: '#9a7bff',
    fontSize: 18,
  },
  quote: {
    color: '#c9ccd6',
    fontSize: 19,
    fontStyle: 'italic',
    lineHeight: 30,
  },
  signature: {
    color: '#9a7bff',
    fontSize: 20,
  },
  pressed: {
    opacity: 0.72,
  },
});
