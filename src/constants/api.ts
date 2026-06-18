export const ENDPOINT_URL = "https://api.spotify.com"

if (__DEV__) {
  console.log("[CONFIG] Development mode:", __DEV__);
  console.log("[CONFIG] API_URL:", ENDPOINT_URL);
}