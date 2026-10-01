export type AuraLevel = 'low' | 'mid' | 'high';

export interface AudioFeature {
  valence: number;
  energy: number;
}

export interface AuraResult {
  name: string;
  dominantSentiment: string;
  buffActive: string;
  statBoost: Partial<Record<'strength' | 'vitality' | 'focus' | 'spirit', number>>;
}

const LOW_THRESHOLD = 0.4;
const HIGH_THRESHOLD = 0.6;

function classify(value: number): AuraLevel {
  if (value < LOW_THRESHOLD) return 'low';
  if (value > HIGH_THRESHOLD) return 'high';
  return 'mid';
}

const AURA_TABLE: Record<string, AuraResult> = {
  'low-low': {
    name: 'Aura Sombria',
    dominantSentiment: 'introspective_deep',
    buffActive: 'journaling_sombra',
    statBoost: { spirit: 5 },
  },
  'low-mid': {
    name: 'Aura Sombria Leve',
    dominantSentiment: 'introspective_light',
    buffActive: 'reflexao_guiada',
    statBoost: { spirit: 3 },
  },
  'low-high': {
    name: 'Aura Guerreira',
    dominantSentiment: 'intense_focus',
    buffActive: 'treino_furia',
    statBoost: { strength: 5 },
  },
  'mid-low': {
    name: 'Aura Serena',
    dominantSentiment: 'calm_balanced',
    buffActive: 'meditacao_suave',
    statBoost: { spirit: 2, vitality: 2 },
  },
  'mid-mid': {
    name: 'Aura do Viajante',
    dominantSentiment: 'balanced',
    buffActive: 'none',
    statBoost: {},
  },
  'mid-high': {
    name: 'Aura do Bravo',
    dominantSentiment: 'driven',
    buffActive: 'foco_treino',
    statBoost: { strength: 3, focus: 2 },
  },
  'high-low': {
    name: 'Aura de Harmonia',
    dominantSentiment: 'positive_acoustic',
    buffActive: 'spirit_boost_10',
    statBoost: { spirit: 5 },
  },
  'high-mid': {
    name: 'Aura de Harmonia Leve',
    dominantSentiment: 'positive_light',
    buffActive: 'gratidao_ativa',
    statBoost: { spirit: 3 },
  },
  'high-high': {
    name: 'Aura Entusiasta',
    dominantSentiment: 'joy_flow',
    buffActive: 'fluxo_alegria',
    statBoost: { focus: 3, vitality: 2 },
  },
};

export function calculateAura(features: AudioFeature[]): AuraResult {
  if (features.length === 0) {
    return AURA_TABLE['mid-mid'];
  }

  const avgValence = features.reduce((sum, feature) => sum + feature.valence, 0) / features.length;
  const avgEnergy = features.reduce((sum, feature) => sum + feature.energy, 0) / features.length;

  const key = `${classify(avgValence)}-${classify(avgEnergy)}`;

  return AURA_TABLE[key] ?? AURA_TABLE['mid-mid'];
}
