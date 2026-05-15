export type VedaStation = {
  id: string;
  name: string;
  tagline: string;
  genre: string;
  streamUrl: string;
  artwork?: string;
  status?: 'live' | 'coming-soon';
};

export const vedaStations: VedaStation[] = [
  {
    id: 'veda-live',
    name: 'Live Radio',
    tagline: 'Transmisión musical y movimiento urbano en vivo.',
    genre: 'Urbano / Reggaetón / Trap Latino',
    streamUrl: '',
    artwork: '/assets/veda/player/veda-live.jpg',
    status: 'coming-soon',
  },
  {
    id: 'urbano-selecta',
    name: 'Urban Selection',
    tagline: 'Selección curada de reggaetón, trap y sonidos latinos.',
    genre: 'Latin Urban',
    streamUrl: '',
    artwork: '/assets/veda/player/urbano-selecta.jpg',
    status: 'coming-soon',
  },
  {
    id: 'clasicos-del-perreo',
    name: 'Classics',
    tagline: 'Clásicos del perreo, nostalgia y calle.',
    genre: 'Old School Reggaetón',
    streamUrl: '',
    artwork: '/assets/veda/player/clasicos-del-perreo.jpg',
    status: 'coming-soon',
  },
  {
    id: 'new-heat',
    name: 'New Releases',
    tagline: 'Estrenos, artistas nuevos y temas recomendados.',
    genre: 'Estrenos Urbanos',
    streamUrl: '',
    artwork: '/assets/veda/player/new-heat.jpg',
    status: 'coming-soon',
  },
  {
    id: 'entrevistas-drops',
    name: 'Backstage',
    tagline: 'Entrevistas, drops, saludos y contenido exclusivo.',
    genre: 'Contenido VEDA',
    streamUrl: '',
    artwork: '/assets/veda/player/entrevistas-drops.jpg',
    status: 'coming-soon',
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
    title: 'Baila Reggaeton',
    tagline: 'Playlist oficial de Spotify con reggaetón, urbano y perreo.',
    ctaLabel: 'Escuchar en Spotify',
    isExternal: true,
    status: 'live',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWY7IeIP1cdjF?utm_source=generator',
    externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWY7IeIP1cdjF',
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
