export type VedaStation = {
  id: string;
  name: string;
  tagline: string;
  genre: string;
  streamUrl: string;
  externalUrl?: string;
  artwork?: string;
  status?: 'live' | 'coming-soon' | 'external';
};

export const vedaStations: VedaStation[] = [
  {
    id: 'la-nueva-94',
    name: 'La Nueva 94',
    tagline: 'Reggaetón, urbano y programación de Puerto Rico.',
    genre: 'Radio Oficial',
    streamUrl: '',
    externalUrl: 'https://www.lamusica.com/stations/woda',
    artwork: '/assets/veda/player/veda-live.jpg',
    status: 'external',
  },
  {
    id: 'mega-106-9',
    name: 'Mega 106.9',
    tagline: 'Música y entretenimiento urbano / Top 40 latino.',
    genre: 'Radio Oficial',
    streamUrl: '',
    externalUrl: 'https://www.lamusica.com/en/stations/wmeg',
    artwork: '/assets/veda/player/urbano-selecta.jpg',
    status: 'external',
  },
  {
    id: 'mix-107-7',
    name: 'Mix 107.7',
    tagline: 'Donde vive tu música urbana.',
    genre: 'Radio Oficial',
    streamUrl: '',
    externalUrl: 'https://mix107pr.com/',
    artwork: '/assets/veda/player/clasicos-del-perreo.jpg',
    status: 'external',
  },
];


export type VedaPlatformSource = {
  id: string;
  title: string;
  tagline: string;
  ctaLabel?: string;
  isExternal?: boolean;
  status: 'live' | 'coming-soon';
  embedUrl: string;
  externalUrl: string;
};

export type VedaSpotifyPlaylist = {
  id: string;
  title: string;
  tagline: string;
  ctaLabel?: string;
  status: 'active' | 'coming-soon';
  embedUrl: string;
  externalUrl: string;
};

export const vedaPlatformSources: VedaPlatformSource[] = [
  {
    id: 'en-vivo',
    title: 'En Vivo',
    tagline: 'Transmisión oficial en vivo de VEDA Music Player.',
    status: 'live',
    embedUrl: '',
    externalUrl: '',
  },
  {
    id: 'spotify',
    title: 'Spotify',
    tagline: 'Playlists oficiales de Spotify seleccionadas para ti.',
    status: 'live',
    embedUrl: '',
    externalUrl: '',
  },
  {
    id: 'youtube',
    title: 'YouTube',
    tagline: 'Canal de video oficial disponible próximamente.',
    status: 'coming-soon',
    embedUrl: '',
    externalUrl: '',
  },
  {
    id: 'soundcloud',
    title: 'SoundCloud',
    tagline: 'Perfil de SoundCloud en preparación.',
    status: 'coming-soon',
    embedUrl: '',
    externalUrl: '',
  },
];

export const vedaSpotifyPlaylists: VedaSpotifyPlaylist[] = [
  {
    id: 'baila-reggaeton',
    title: 'Baila Reggaeton',
    tagline: 'Playlist oficial de Spotify con reggaetón, urbano y perreo.',
    ctaLabel: 'Escuchar en Spotify',
    status: 'active',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWY7IeIP1cdjF?utm_source=generator',
    externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWY7IeIP1cdjF',
  },
  {
    id: 'old-school-reggaeton',
    title: 'Old School Reggaeton',
    tagline: 'Clásicos del reggaetón y perreo de antes.',
    ctaLabel: 'Escuchar en Spotify',
    status: 'active',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8SfyqmSFDwe?utm_source=generator',
    externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX8SfyqmSFDwe',
  },
];
