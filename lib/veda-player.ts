export type VedaStation = {
  id: string;
  name: string;
  tagline: string;
  genre: string;
  streamUrl: string;
  embedUrl: string;
  externalUrl: string;
  artwork?: string;
  status?: 'live' | 'coming-soon';
};

export const vedaStations: VedaStation[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    tagline: 'Contenedor oficial en preparación. Próximamente enlaces verificados por VEDA Music.',
    genre: 'Plataforma oficial futura',
    streamUrl: '',
    embedUrl: '',
    externalUrl: '',
    status: 'coming-soon',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    tagline: 'Contenedor oficial en preparación. Próximamente enlaces verificados por VEDA Music.',
    genre: 'Plataforma oficial futura',
    streamUrl: '',
    embedUrl: '',
    externalUrl: '',
    status: 'coming-soon',
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    tagline: 'Contenedor oficial en preparación. Próximamente enlaces verificados por VEDA Music.',
    genre: 'Plataforma oficial futura',
    streamUrl: '',
    embedUrl: '',
    externalUrl: '',
    status: 'coming-soon',
  },
];
