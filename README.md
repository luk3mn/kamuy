# 🛡️ Specification Document: Life RPG & Manifestation App

> **Versão:** 1.0.0
> **Arquitetura:** Offline-First (Mobile)
> **Stack Principal:** React Native, Firebase (Firestore & Auth), Spotify API
> **Estilo de Design:** Minimalista, Dark/Light Mode, Gamificado (RPG de Vida Real)

---

## 📋 1. Visão Geral do Produto

O aplicativo é um **RPG de Vida Real (Life RPG)** e **Tracker de Manifestação/Mindset** minimalista. Ele transforma tarefas cotidianas, exercícios físicos, hábitos de estudo, práticas espirituais e preferências de escuta musical em um sistema de evolução de personagem mensurável.

### 🧠 Princípios de UX & Design

- **Minimalismo Elegante:** Foco em dados essenciais. Sem poluição visual, pop-ups agressivos ou excesso de cores.
- **Ação Instantânea (0ms Latency):** Resposta tátil (*Haptic Feedback*) em todas as interações.
- **Navigation Pattern:** **Drawer Navigation** como estrutura principal de acesso (menu lateral atua como a *Ficha de Personagem / Menu de Pause*).
- **Navegação em 2 Toques:** Qualquer ação principal pode ser executada em até 2 cliques a partir da home.

---

## 📊 2. Os 4 Pilares de Evolução (Stats)

| Atributo | Código | Significado / Hábitos Atrelados | Cor Light | Cor Dark |
| :--- | :---: | :--- | :---: | :---: |
| **Força** | `STR` | Treinos de academia, calistenia, corrida, esforço físico. | `#EF4444` | `#F87171` |
| **Vitalidade** | `VIT` | Alimentação limpa, hidratação, sono e registros de rotina. | `#10B981` | `#34D399` |
| **Mente** | `INT` | Leitura, estudos de programação/código, foco e aprendizado. | `#3B82F6` | `#60A5FA` |
| **Espírito** | `SPR` | Afirmações, journaling de gratidão, meditação, áudios e aura. | `#8B5CF6` | `#A78BFA` |

---

## 🎨 3. Design System & Paleta de Cores

O aplicativo possui suporte nativo a **Dark Mode** (Tema Padrão / Imersivo) e **Light Mode** (Clareza / Estilo Linho).

### 🌙 Dark Mode (Default)

| Elemento | Cor | Nome |
| :--- | :---: | :--- |
| Background | `#0F1115` | Obsidian Slate |
| Surface / Cards | `#181B22` | Deep Slate |
| Bordas / Divisores | `#262A34` | Muted Graphite |
| Texto Principal | `#F3F4F6` | Pure Off-White |
| Texto Secundário | `#8C94A6` | Steel Grey |
| Cor Primária | `#6366F1` | Indigo Ametista |
| Destaque (Gold/XP) | `#F59E0B` | Champagne Gold |

### ☀️ Light Mode

| Elemento | Cor | Nome |
| :--- | :---: | :--- |
| Background | `#F8F9FA` | Alabaster Cream |
| Surface / Cards | `#FFFFFF` | Pure Paper White |
| Bordas / Divisores | `#E5E7EB` | Soft Border |
| Texto Principal | `#111827` | Charcoal Ink |
| Texto Secundário | `#6B7280` | Slate Grey |
| Cor Primária | `#4F46E5` | Deep Indigo |
| Destaque (Gold/XP) | `#D97706` | Warm Amber Gold |

---

## 🎵 4. Módulo de Análise de Humor & Sentiment via Spotify API

Este módulo define a metodologia para capturar o histórico recente de reprodução do usuário no Spotify, traduzi-lo em estados emocionais ("Auras") e convertê-los em *Buffs* (bônus temporários) ou *Quests* no RPG.

### 🎧 4.1. Endpoints & Métricas Utilizadas

Para realizar a análise sem sobrecarregar a cota da API, o app utiliza dois endpoints oficiais da **Spotify Web API**:

1. **`GET /v1/me/player/recently-played?limit=20`**
   - Obtém as últimas 20 faixas escutadas pelo usuário no dia.
2. **`GET /v1/audio-features?ids={track_ids}`**
   - Retorna os metadados acústicos e emocionais de cada faixa (valores contínuos de `0.0` a `1.0`).

#### Métricas do Audio Features Extraídas

- **`valence` (Valência Emocional):** Mede a "positividade" da música.
  - *Valores altos (0.6 a 1.0):* Músicas eufóricas, alegres, motivadoras.
  - *Valores baixos (0.0 a 0.4):* Músicas melancólicas, tristes, de introspecção.
- **`energy` (Intensidade Energética):** Mede o ritmo, dinamismo e barulho.
  - *Valores altos (0.7 a 1.0):* Rock, Metal, Eletrônica, Treino (alta pulsação).
  - *Valores baixos (0.0 a 0.3):* Acústicos, Ambient, Lofi.
- **`acousticness` (Nível Acústico):** Identifica instrumentos orgânicos vs elétricos/sintéticos.
- **`tempo` (BPM):** Batidas por minuto da faixa.

### 🧮 4.2. Algoritmo de Cálculo do Humor (Aura Engine)

O app calcula a média ponderada de `valence`, `energy` e `acousticness` das últimas músicas ouvidas para mapear o humor em **4 Auras Principais**:

```text
                            [ ENERGY ]
                                │
        Aura Guerreira         │        Aura Entusiasta
        (Foco / Treino)        │        (Alegria / Fluxo)
                                │
─── LOW VALENCE ────────────────┼──────────────── HIGH VALENCE ───
                                │
        Aura Sombria           │        Aura de Harmonia
        (Introspecção)         │        (Manifestação / Paz)
                                │
                          [ LOW ENERGY ]
```

---

## 🏗️ 5. Arquitetura Técnica & Stack Tecnológica

```text
               ┌──────────────────────────────┐
               │     React Native (App UI)    │
               └──────────────┬───────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         ▼                                         ▼
┌─────────────────────────┐               ┌────────────────────────┐
│  Firebase Auth (Google) │               │   Spotify OAuth 2.0    │
│  • Primary Identity     │               │   • Audio Features API │
└────────┬────────────────┘               └────────┬───────────────┘
         │                                         │
         ▼                                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  Firestore Client SDK (Offline-First Cache + Cloud Auto Sync)    │
└──────────────────────────────────────────────────────────────────┘
```

| Camada | Tecnologia | Função |
| :--- | :--- | :--- |
| Core Framework | React Native (Expo / Bare CLI) | Framework mobile multiplataforma. |
| Navegação | React Navigation (Drawer) | Navegação lateral integrada. |
| Auth Primário | `@react-native-google-signin` + Firebase Auth | Login nativo e gerenciamento de conta do usuário. |
| Auth Secundário | `react-native-app-auth` (Spotify OAuth 2.0) | Conexão para puxar estatísticas musicais. |
| Banco / Sync | `@react-native-firebase/firestore` | Persistência local (Offline-First) sincronizada em nuvem. |
| Animações UI | `react-native-reanimated` + `moti` | Barras de XP fluidas, Level-Up popups. |
| Gráficos | `react-native-skia` ou `react-native-svg` | Renderização do Radar Chart de atributos. |
| Sensorial | `expo-haptics` + `expo-av` | Resposta tátil instantânea e áudio retrô. |

---

## 🗺️ 6. Estrutura de Telas (Drawer Navigation)

### Menu Lateral (Drawer)

```text
[ Drawer Navigation ]
 ├── ⚔️ Hero's Hub (Dashboard Inicial)
 ├── 📜 Quest Log (Diárias & Weekly Boss)
 ├── 🔮 Módulo de Manifestação (Afirmações & Diário)
 ├── 🎒 Inventário & Loja (Recompensas Pessoais)
 ├── 📊 Ficha de Atributos (Estatísticas Detalhadas)
 └── ⚙️ Configurações (Google & Spotify Integration)
```

### Detalhamento das Telas

**Hero's Hub**
- Header com saldo de Gold e contador de Streak (Chama de Fogo).
- Avatar Card: Nível Atual, Titulação (ex: Guerreiro), Barra de XP.
- Spotify Aura Banner: Card com gradiente mostrando o sentimento do áudio ouvido no dia (ex: "Aura de Foco & Harmonia — +10% em SPR").
- Radar Chart: Teia visual dos 4 atributos.
- Atalho rápido para as 3 missões pendentes mais prioritárias.

**Quest Log**
- Abas: Hoje | Weekly Boss | Concluídas.
- Cards minimalistas por atributo (`STR`, `INT`, `VIT`, `SPR`).
- Long-press (0.5s) com vibração hápica para dar check na missão.
- Tela de Boss Fight com Barra de HP do Chefão da Semana.

**Módulo de Manifestação**
- Daily Chants: Carrossel de afirmações em voz alta com recompensa de XP em Espírito.
- Journaling: Espaço limpo para escrita de gratidão e intenções do Eu do Futuro.
- Spotify Sentiment Engine: Leitor de `valence`, `energy` e `acousticness` da API do Spotify.

**Inventário & Loja**
- Loja personalizável com recompensas reais cadastradas pelo usuário (Loot).
- Resgate de recompensas usando as moedas (Gold) do app.
- Compra de Escudos de Streak.

---

## 🗄️ 7. Firestore Database Schema

### 1. Documento Raiz do Usuário — `/users/{userId}`

```json
{
  "profile": {
    "displayName": "Lucas",
    "email": "usuario@gmail.com",
    "avatarUrl": "https://...",
    "createdAt": "2026-08-05T12:00:00Z"
  },
  "progression": {
    "level": 6,
    "currentXp": 420,
    "nextLevelXp": 600,
    "totalXpEarned": 3420,
    "rankTitle": "Guerreiro",
    "coins": 580
  },
  "attributes": {
    "strength": 18,
    "vitality": 12,
    "focus": 15,
    "spirit": 14
  },
  "streak": {
    "currentStreak": 8,
    "bestStreak": 15,
    "lastActiveDate": "2026-08-05",
    "streakShields": 1
  },
  "spotifyIntegration": {
    "isConnected": true,
    "spotifyUserId": "lucas_music",
    "refreshToken": "encrypted_refresh_token_string",
    "lastSyncedAt": "2026-08-05T09:00:00Z"
  },
  "currentAura": {
    "auraName": "Aura de Harmonia & Manifestação",
    "dominantSentiment": "positive_acoustic",
    "buffActive": "spirit_boost_10",
    "calculatedAt": "2026-08-05"
  }
}
```

### 2. Subcoleção de Missões — `/users/{userId}/quests/{questId}`

```json
{
  "title": "Treino de Supino + Flexões",
  "category": "strength",
  "type": "daily",
  "status": "pending",
  "rewards": {
    "xp": 100,
    "coins": 25,
    "statPoints": { "strength": 3 }
  },
  "isBoss": false,
  "dueDate": "2026-08-05T23:59:59Z"
}
```

### 3. Subcoleção de Recompensas — `/users/{userId}/inventory/{itemId}`

```json
{
  "title": "Comer Pizza no Fim de Semana",
  "costCoins": 500,
  "type": "real_world_reward",
  "isRedeemed": false,
  "unlockedAt": "2026-08-05T10:00:00Z"
}
```

---

## ⚡ 8. Regra de Negócio Exemplo (React Native)

```javascript
import firestore from '@react-native-firebase/firestore';
import * as Haptics from 'expo-haptics';

export async function completeQuest(userId, quest) {
  // 1. Resposta tátil imediata na UI
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  const batch = firestore().batch();

  const questRef = firestore()
    .collection('users')
    .doc(userId)
    .collection('quests')
    .doc(quest.id);

  const userRef = firestore().collection('users').doc(userId);

  // 2. Atualiza estado da missão
  batch.update(questRef, {
    status: 'completed',
    completedAt: firestore.FieldValue.serverTimestamp(),
  });

  // 3. Atualiza dados do jogador (Atomic Increments)
  batch.update(userRef, {
    'progression.currentXp': firestore.FieldValue.increment(quest.rewards.xp),
    'progression.totalXpEarned': firestore.FieldValue.increment(quest.rewards.xp),
    'progression.coins': firestore.FieldValue.increment(quest.rewards.coins),
    [`attributes.${quest.category}`]: firestore.FieldValue.increment(
      quest.rewards.statPoints?.[quest.category] || 1
    ),
  });

  // Executa localmente (UI reage em 0ms) e enfileira gravação no Firestore
  await batch.commit();
}
```