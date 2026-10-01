export const BATCH_SIZE = 15;

export function extractSpotifyId(href: string): string {
  return href.split('/track/')[1] ?? href;
}

export function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}