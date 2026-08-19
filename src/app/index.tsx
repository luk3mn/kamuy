import { useMe } from '@/hooks/api/use-auth';
import { useRecentlyPlayedTracks } from '@/hooks/api/use-player';
import { getAuth } from '@react-native-firebase/auth';
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
import { Image, Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

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

function AuraCard() {
  const { data: songs, error: errorSongs, refetch: refreshSongs } = useRecentlyPlayedTracks();

  return (
    <TouchableOpacity
      onPress={() => console.log("ABRIR MODAL COM DETALHES DE AURA")}
      className="items-center min-h-19 overflow-hidden flex-row gap-3.5 px-4.5 border border-[rgba(255,255,255,0.11)] bg-[#252078]"
      style={{ borderCurve: 'continuous', borderRadius: 10 }}>
      <Image
        source={require('@/assets/images/spotify.png')}
        className="w-12 h-12"
      />
      <View className="flex-1 z-10">
        <Text selectable className="text-[#d5d3ff]" style={{ fontSize: 13 }}>
          Aura do dia
        </Text>
        <Text selectable className="text-white font-black" style={{ fontSize: 15 }}>
          Aura de Foco & Harmonia
        </Text>
        <Text selectable className="text-white" style={{ fontSize: 13 }}>
          +10% em Espírito (SPR)
        </Text>
      </View>
      <Waveform />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { data: profile } = useMe();
  const firebaseUser = getAuth().currentUser;
  const avatarUrl = profile?.images?.[0]?.url ?? firebaseUser?.photoURL;
  const displayName = profile?.display_name ?? firebaseUser?.displayName ?? 'Luke';
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
    <View className="flex-1 bg-[#05070b]">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        className="px-5"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top + 18, 38),
          paddingBottom: insets.bottom + 96,
          gap: 10,
        }}
      >
        <View className="items-center flex-row justify-between">
          <Pressable onPress={openDrawer} className="items-center justify-center w-9.5 h-9.5" hitSlop={8}>
            <Menu color="#d9dce5" size={25} />
          </Pressable>
          <Pressable className="items-center justify-center w-9.5 h-9.5" hitSlop={8}>
            <Bell color="#d9dce5" size={23} />
            <View
              className="absolute rounded-full bg-[#7657ff]"
              style={{ right: 7, top: 7, width: 9, height: 9 }}
            />
          </Pressable>
        </View>

        <View className="gap-0.5 pb-2">
          <Text selectable className="text-white font-black" style={{ fontSize: isCompact ? 23 : 25 }}>
            Bom dia, <Text className="text-[#755cff]">{firstName}</Text>
          </Text>
          <Text selectable className="text-[#c5c7d0]" style={{ fontSize: 15 }}>
            Continue sua evolução.
          </Text>
        </View>

        <View
          className="min-h-36.5 overflow-hidden flex-row gap-4.5 items-center p-5 border border-[rgba(255,255,255,0.12)] bg-[#151821]"
          style={{ borderCurve: 'continuous', borderRadius: 14 }}>
          <View className="absolute right-11 -bottom-3">
            <Mountain color="rgba(255,255,255,0.08)" size={120} strokeWidth={1} />
          </View>
          <View className="absolute right-4.5 top-6">
            <Shield color="rgba(255,255,255,0.12)" size={86} strokeWidth={1.2} />
          </View>
          <View
            className="p-0.5 bg-[#4b8dff]"
            style={{ borderRadius: 54, boxShadow: '0 0 24px rgba(82, 127, 255, 0.42)' }}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="w-23.5 h-23.5 border-2 border-[#1b2034]"
                style={{ borderRadius: 47 }}
              />
            ) : (
              <View
                className="w-23.5 h-23.5 border-2 border-[#1b2034] items-center justify-center bg-[#272d45]"
                style={{ borderRadius: 47 }}>
                <Text className="text-white font-black" style={{ fontSize: 34 }}>
                  {firstName.slice(0, 1)}
                </Text>
              </View>
            )}
            <Text
              className="absolute right-0.5 -top-3 text-[#ffd45b]"
              style={{ fontSize: 27, transform: [{ rotate: '16deg' }] }}>
              ♛
            </Text>
          </View>
          <View className="flex-1 gap-2">
            <View className="items-center flex-row flex-wrap gap-2">
              <Text selectable className="text-white text-xl font-black">
                Guerreiro
              </Text>
              <Text
                selectable
                className="overflow-hidden px-2 py-0.5 rounded-lg text-[#b8adff] bg-[rgba(116,92,255,0.25)] text-xs font-extrabold">
                Nível 6
              </Text>
            </View>
            <Text selectable className="text-white text-sm font-bold">
              420 / 600 XP
            </Text>
            <View className="h-2 overflow-hidden bg-[rgba(0,0,0,0.42)]" style={{ borderRadius: 5 }}>
              <View
                className="w-[70%] h-full bg-[#7657ff]"
                style={{ borderRadius: 5, boxShadow: '0 0 13px rgba(117, 92, 255, 0.84)' }}
              />
            </View>
            <Text selectable className="text-[#c7c9d2]" style={{ fontSize: 13 }}>
              Próximo nível: 180 XP
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <Metric icon={<Flame color="#ff663d" size={27} fill="#ff663d" />} value="8" label="Streak" />
          <Metric
            icon={
              <Text className="text-[#ffd15a] font-black" style={{ fontSize: 28 }}>
                ⊙
              </Text>
            }
            value="580"
            label="Gold"
          />
        </View>

        <AuraCard />

        <View
          className="gap-2 min-h-56 p-4 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)]"
          style={{ borderCurve: 'continuous', borderRadius: 10 }}>
          <View className="items-center flex-row justify-between">
            <Text selectable className="text-white text-base font-extrabold">
              Atributos
            </Text>
            <Pressable className="items-center flex-row gap-0.5">
              <Text className="text-[#aeb3bf]" style={{ fontSize: 13 }}>
                Detalhes
              </Text>
              <ChevronRight color="#aeb3bf" size={17} />
            </Pressable>
          </View>
          <AttributeRadar />
        </View>

        <View className="items-center flex-row justify-between pt-2">
          <Text selectable className="text-white text-base font-extrabold">
            Missões prioritárias
          </Text>
          <Pressable className="items-center flex-row gap-0.5">
            <Text className="text-[#aeb3bf]" style={{ fontSize: 13 }}>
              Ver todas
            </Text>
            <ChevronRight color="#aeb3bf" size={17} />
          </Pressable>
        </View>

        <View className="gap-1">
          {MISSIONS.map((mission) => (
            <MissionRow key={mission.title} {...mission} />
          ))}
        </View>
      </ScrollView>

      <Pressable
        className="absolute right-5 items-center justify-center w-16 h-16 rounded-full bg-[#684cff]"
        style={{ bottom: insets.bottom + 18, boxShadow: '0 8px 28px rgba(104, 76, 255, 0.62)' }}
        hitSlop={8}>
        <Plus color="#ffffff" size={33} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

function Metric({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <View
      className="items-center flex-1 flex-row gap-3.5 min-h-15.5 px-4.5 border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.07)]"
      style={{ borderCurve: 'continuous', borderRadius: 10 }}>
      <View className="items-center justify-center w-8.5 h-8.5 rounded-full bg-[rgba(0,0,0,0.34)]">
        {icon}
      </View>
      <View>
        <Text selectable className="text-white text-xl font-black" style={{ fontVariant: ['tabular-nums'] }}>
          {value}
        </Text>
        <Text selectable className="text-[#c0c3cd] text-xs">
          {label}
        </Text>
      </View>
    </View>
  );
}

function Waveform() {
  const heights = [8, 16, 22, 30, 20, 42, 34, 54, 26, 60, 38, 70, 24, 64, 45, 76, 30, 56, 70, 82, 42, 66, 78];

  return (
    <View className="absolute right-2.5 bottom-0 top-0 items-center flex-row gap-1.5">
      {heights.map((height, index) => (
        <View
          key={`${height}-${index}`}
          className="w-1 bg-[#69b8ff]"
          style={{
            height: height * 0.56,
            opacity: 0.22 + index / heights.length,
            borderRadius: 3,
            boxShadow: '0 0 12px rgba(91, 144, 255, 0.78)',
          }}
        />
      ))}
    </View>
  );
}

function AttributeRadar() {
  return (
    <View className="items-center self-center justify-center min-h-42 w-full max-w-82.5">
      <View className="absolute top-0 items-center">
        <Text selectable className="text-[#cbd0dc] text-xs font-extrabold">
          SPR
        </Text>
        <Text selectable className="text-xl font-black" style={{ color: '#a855ff', lineHeight: 22, fontVariant: ['tabular-nums'] }}>
          72
        </Text>
      </View>
      <View className="absolute right-1.5 top-18.5 items-center">
        <Text selectable className="text-[#cbd0dc] text-xs font-extrabold">
          STR
        </Text>
        <Text selectable className="text-xl font-black" style={{ color: '#ff5f62', lineHeight: 22, fontVariant: ['tabular-nums'] }}>
          75
        </Text>
      </View>
      <View className="absolute items-center" style={{ bottom: -3 }}>
        <Text selectable className="text-[#cbd0dc] text-xs font-extrabold">
          VIT
        </Text>
        <Text selectable className="text-xl font-black" style={{ color: '#5def91', lineHeight: 22, fontVariant: ['tabular-nums'] }}>
          80
        </Text>
      </View>
      <View className="absolute left-2 top-18.5 items-center">
        <Text selectable className="text-[#cbd0dc] text-xs font-extrabold">
          INT
        </Text>
        <Text selectable className="text-xl font-black" style={{ color: '#58b6ff', lineHeight: 22, fontVariant: ['tabular-nums'] }}>
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
    <Pressable
      className="items-center flex-row gap-3 min-h-14.5 px-4 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.065)] active:opacity-70"
      style={{ borderCurve: 'continuous', borderRadius: 10 }}>
      <View
        className="items-center justify-center w-9.5 h-9.5 rounded-full border bg-[rgba(0,0,0,0.24)]"
        style={{ borderColor: `${color}66` }}>
        <Icon color={color} size={21} strokeWidth={1.9} />
      </View>
      <View className="flex-1">
        <Text selectable className="text-white font-black" style={{ fontSize: 15 }} numberOfLines={1}>
          {title}
        </Text>
        <Text selectable className="text-[#c3c6d0] text-xs" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Text selectable className="font-black" style={{ fontSize: 13, color }}>
        {xp}
      </Text>
      <View className="w-5.5 h-5.5 rounded-full border-2" style={{ borderColor: color }} />
    </Pressable>
  );
}