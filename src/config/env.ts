import Constants from 'expo-constants';

export const APP_ENV = (Constants.expoConfig?.extra?.appEnv as string) ?? 'development';
export const API_URL = (Constants.expoConfig?.extra?.apiUrl as string) ?? 'http://localhost:8080';
