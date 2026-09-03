export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com';
export const RECCOBEATS_API_URL = 'https://api.reccobeats.com/v1';

if (__DEV__) {
  console.log('[CONFIG] Development mode:', __DEV__);
  console.log('[CONFIG] SPOTIFY_API_URL:', SPOTIFY_API_URL);
}
