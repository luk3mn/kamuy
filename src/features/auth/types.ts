export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
  expiresAt: number;
}

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyUser {
  id: string;
  display_name: string | null;
  email: string;
  images: SpotifyImage[];
  country: string;
  product: string;
  uri: string;
}

export interface SpotifyCursorPaginatedResponse<T> {
  items: T[];
  next: string | null;
  cursors: { before: string; after: string };
  limit: number;
  total?: number;
}
