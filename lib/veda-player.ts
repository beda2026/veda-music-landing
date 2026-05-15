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
    name: 'VEDA Live',
    tagline: 'Música, estrenos y movimiento urbano en vivo.',
    genre: 'Urbano / Reggaetón / Trap Latino',
    streamUrl: '',
    artwork: '/assets/veda/player/veda-live.jpg',
    status: 'coming-soon',
  },
  {
    id: 'urbano-selecta',
    name: 'Urbano Selecta',
    tagline: 'Reggaetón, trap y sonidos latinos seleccionados.',
    genre: 'Latin Urban',
    streamUrl: '',
    artwork: '/assets/veda/player/urbano-selecta.jpg',
    status: 'coming-soon',
  },
  {
    id: 'clasicos-del-perreo',
    name: 'Clásicos del Perreo',
    tagline: 'Old school, nostalgia y calle.',
    genre: 'Old School Reggaetón',
    streamUrl: '',
    artwork: '/assets/veda/player/clasicos-del-perreo.jpg',
    status: 'coming-soon',
  },
  {
    id: 'new-heat',
    name: 'New Heat',
    tagline: 'Estrenos, artistas nuevos y temas recomendados.',
    genre: 'Estrenos Urbanos',
    streamUrl: '',
    artwork: '/assets/veda/player/new-heat.jpg',
    status: 'coming-soon',
  },
  {
    id: 'entrevistas-drops',
    name: 'Entrevistas & Drops',
    tagline: 'Cápsulas, entrevistas, saludos y contenido exclusivo.',
    genre: 'Contenido VEDA',
    streamUrl: '',
    artwork: '/assets/veda/player/entrevistas-drops.jpg',
    status: 'coming-soon',
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
