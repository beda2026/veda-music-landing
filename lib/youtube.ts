export function extractYoutubeVideoId(value: string): string | null {
  if (!value) return null;
  if (!value.includes('http')) return value;

  try {
    const parsedUrl = new URL(value);
    if (parsedUrl.hostname.includes('youtu.be')) return parsedUrl.pathname.replace('/', '') || null;
    if (parsedUrl.hostname.includes('youtube.com')) {
      const queryVideoId = parsedUrl.searchParams.get('v');
      if (queryVideoId) return queryVideoId;
      const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
      return pathSegments[pathSegments.length - 1] || null;
    }
  } catch {
    return null;
  }

  return null;
}
