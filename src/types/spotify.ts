export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
  expiresAt: number; // Date.now() + expiresIn * 1000
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string; height: number; width: number }[];
  followers: { total: number };
  country: string;
  product: 'premium' | 'free';
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  preview_url: string | null;
  external_urls: { spotify: string };
  album: {
    id: string;
    name: string;
    images: { url: string; height: number; width: number }[];
    release_date: string;
  };
  artists: { id: string; name: string }[];
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: { total: number };
  images: { url: string; height: number; width: number }[];
  external_urls: { spotify: string };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  public: boolean;
  tracks: { total: number };
  images: { url: string }[];
  external_urls: { spotify: string };
  owner: { display_name: string };
}

export interface SpotifyPaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';