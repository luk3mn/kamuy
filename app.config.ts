import type { ConfigContext, ExpoConfig } from "expo/config";

const APP_ENV = process.env.APP_ENV ?? "development";

const EAS_PROJECT_ID = "COLOQUE_SEU_PROJECT_ID_AQUI";

const API_URL_DEFAULTS = {
  development: "http://localhost:8080",
  preview: "https://api.kamuy.app",
  production: "https://api.kamuy.app",
} as const;

type AppEnv = keyof typeof API_URL_DEFAULTS;

/**
 * Dev/preview usam identificadores distintos pra poder ficar instalado
 * junto com a produção no mesmo dispositivo. Produção mantém o
 * identificador já existente: com.luk3mn.kamuy
 */
const envConfig = {
  development: {
    name: "kamuy (Dev)",
    bundleId: "com.luk3mn.kamuy.dev",
    scheme: "kamuy-dev",
  },
  preview: {
    name: "kamuy (Preview)",
    bundleId: "com.luk3mn.kamuy.preview",
    scheme: "kamuy-preview",
  },
  production: {
    name: "kamuy",
    bundleId: "com.luk3mn.kamuy",
    scheme: "kamuy",
  },
} as const;

const appEnv: AppEnv =
  APP_ENV in envConfig ? (APP_ENV as AppEnv) : "development";

const current = envConfig[appEnv];

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? API_URL_DEFAULTS[appEnv];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: current.name,
  slug: "kamuy",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: current.scheme,
  userInterfaceStyle: "automatic",
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
  },
  ios: {
    icon: "./assets/expo.icon",
    bundleIdentifier: current.bundleId,
    googleServicesFile: "./GoogleService-Info.plist",
  },
  android: {
    package: current.bundleId,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    googleServicesFile: "./google-services.json",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        android: {
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      },
    ],
    "expo-secure-store",
    "expo-web-browser",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme:
          "com.googleusercontent.apps.14623258181-eb51t67d0q475ij597on8br11tng3ksn",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    appEnv,
    apiUrl,
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
});