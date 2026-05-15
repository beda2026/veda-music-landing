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
  label: string;
  status: 'live' | 'coming-soon';
  embedUrl: string;
  externalUrl: string;
};

export const vedaPlatformSources: VedaPlatformSource[] = [
  {
    id: 'en-vivo',
    label: 'En Vivo',
    status: 'live',
    embedUrl: '',
    externalUrl: '',
  },
  {
    id: 'spotify',
    label: 'Spotify',
    status: 'coming-soon',
    embedUrl: '',
    externalUrl: '',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    status: 'coming-soon',
    embedUrl: '',
    externalUrl: '',
  },
  {
    id: 'soundcloud',
    label: 'SoundCloud',
    status: 'coming-soon',
    embedUrl: '',
    externalUrl: '',
  },
];
