export type VedaArtist = {
  name: string;
  slug: string;
  country: string;
  category: string;
  image?: string;
  shortBio: string;
  biography: string;
  trajectory: string[];
  albums: string[];
  notableSongs: string[];
  impact: string;
};

export const vedaArtists: VedaArtist[] = [
  {
    name: 'Daddy Yankee',
    slug: 'daddy-yankee',
    country: 'Puerto Rico',
    category: 'Reggaetón Pioneer',
    shortBio: 'Figura esencial del reggaetón moderno con visión global y enfoque de legado.',
    biography:
      'Daddy Yankee es reconocido como una de las voces que ayudó a consolidar el reggaetón como movimiento internacional, combinando energía de club con disciplina artística.',
    trajectory: [
      'Desarrolló su identidad en la escena urbana de Puerto Rico durante los noventa.',
      'Se convirtió en un referente comercial y cultural de la música latina urbana.',
      'Impulsó una etapa de transición hacia proyectos de legado y dirección empresarial.',
    ],
    albums: ['Barrio Fino', 'El Cartel: The Big Boss', 'Legendaddy'],
    notableSongs: ['Gasolina', 'Rompe', 'Con Calma'],
    impact:
      'Su propuesta abrió puertas para nuevas generaciones y posicionó el sonido urbano en mercados internacionales con mayor alcance.',
  },
  {
    name: 'Don Omar',
    slug: 'don-omar',
    country: 'Puerto Rico',
    category: 'Reggaetón / Fusión Urbana',
    shortBio: 'Artista de gran presencia escénica, conocido por dramatismo vocal y narrativa callejera.',
    biography:
      'Don Omar construyó un catálogo que mezcla fuerza interpretativa con producción de alto impacto, manteniéndose como una figura influyente del reggaetón clásico y contemporáneo.',
    trajectory: [
      'Saltó al plano masivo con propuestas de gran intensidad melódica.',
      'Amplió su sonido con colaboraciones y cruces hacia ritmos electrónicos.',
      'Sostuvo vigencia con giras y lanzamientos orientados a su base histórica.',
    ],
    albums: ['The Last Don', 'King of Kings', 'Meet the Orphans'],
    notableSongs: ['Dale Don Dale', 'Danza Kuduro', 'Pobre Diabla'],
    impact:
      'Aportó una estética épica al género y elevó el estándar de espectáculo en vivo para artistas urbanos.',
  },
  {
    name: 'Tego Calderón',
    slug: 'tego-calderon',
    country: 'Puerto Rico',
    category: 'Urbano / Hip-Hop Latino',
    shortBio: 'Voz auténtica con sello lírico propio y enfoque social dentro de la música urbana.',
    biography:
      'Tego Calderón es respetado por su escritura directa y su capacidad de unir raíz afrocaribeña, rap y reggaetón en una propuesta con identidad fuerte.',
    trajectory: [
      'Ganó reconocimiento por su estilo lírico distintivo y lenguaje de barrio.',
      'Se consolidó como referente de autenticidad en la escena urbana latina.',
      'Mantiene relevancia como inspiración para intérpretes de línea más consciente.',
    ],
    albums: ['El Abayarde', 'The Underdog / El Subestimado', 'El Que Sabe, Sabe'],
    notableSongs: ['Pa’ Que Retozen', 'Métele Sazón', 'Los Maté'],
    impact:
      'Su legado destaca por defender una voz propia y ampliar el espacio para discursos culturales en el género.',
  },
  {
    name: 'Ivy Queen',
    slug: 'ivy-queen',
    country: 'Puerto Rico',
    category: 'Reggaetón / Pionera Femenina',
    shortBio: 'Pionera que abrió camino para mujeres en la industria urbana con carácter y consistencia.',
    biography:
      'Ivy Queen desarrolló una carrera sólida marcada por letras de empoderamiento y presencia escénica, convirtiéndose en referencia obligada dentro del reggaetón.',
    trajectory: [
      'Emergió en una etapa temprana del movimiento urbano boricua.',
      'Defendió una narrativa femenina propia con gran recepción del público.',
      'Sostuvo su carrera con visión independiente y permanencia intergeneracional.',
    ],
    albums: ['Diva', 'Sentimiento', 'Drama Queen'],
    notableSongs: ['Quiero Bailar', 'Yo Quiero Saber', 'La Vida es Así'],
    impact:
      'Su trabajo fortaleció la representación femenina y legitimó nuevas voces dentro de la música urbana.',
  },
  {
    name: 'Wisin & Yandel',
    slug: 'wisin-y-yandel',
    country: 'Puerto Rico',
    category: 'Dúo Urbano',
    shortBio: 'Dúo histórico que combinó reggaetón de pista con visión pop internacional.',
    biography:
      'Wisin & Yandel marcaron una era con himnos de club y colaboraciones estratégicas, logrando conectar el sonido urbano latino con audiencias masivas.',
    trajectory: [
      'Construyeron una identidad dual entre energía callejera y formato radial.',
      'Consolidaron una etapa de expansión con proyectos globales y giras.',
      'Alternaron trabajos individuales con regresos del dúo de alto impacto.',
    ],
    albums: ['Pa’l Mundo', 'Los Vaqueros', 'La Última Misión'],
    notableSongs: ['Rakata', 'Algo Me Gusta de Ti', 'Abusadora'],
    impact:
      'Su modelo creativo mostró cómo un dúo urbano puede evolucionar sin perder su esencia de barrio.',
  },
  {
    name: 'Arcángel',
    slug: 'arcangel',
    country: 'Puerto Rico / EE. UU.',
    category: 'Trap Latino / Reggaetón',
    shortBio: 'Artista de estilo melódico y personalidad frontal con fuerte presencia en la era digital.',
    biography:
      'Arcángel se ha mantenido vigente por su versatilidad entre reggaetón y trap latino, con una narrativa personal que conecta con distintas generaciones.',
    trajectory: [
      'Se proyectó en la nueva ola urbana con enfoque melódico distintivo.',
      'Expandió su propuesta hacia el trap sin abandonar su base reggaetonera.',
      'Consolidó una etapa madura centrada en repertorio y colaboraciones clave.',
    ],
    albums: ['El Fenómeno', 'Sentimiento, Elegancia & Maldad', 'Sr. Santos'],
    notableSongs: ['Pa’ Que la Pases Bien', 'Me Prefieres a Mí', 'La Jumpa'],
    impact:
      'Su permanencia ha ayudado a enlazar la escuela clásica del reggaetón con la sensibilidad del trap moderno.',
  },
  {
    name: 'Zion & Lennox',
    slug: 'zion-y-lennox',
    country: 'Puerto Rico',
    category: 'Dúo Urbano Melódico',
    shortBio: 'Dupla emblemática por su enfoque melódico y capacidad de adaptación sonora.',
    biography:
      'Zion & Lennox son reconocidos por un estilo suave y pegajoso que ha acompañado varias etapas del reggaetón, desde los primeros mixtapes hasta colaboraciones globales.',
    trajectory: [
      'Formaron una identidad melódica distintiva en la primera ola del género.',
      'Regresaron con fuerza en ciclos de colaboración junto a nuevos talentos.',
      'Mantienen una firma vocal reconocible dentro del circuito urbano latino.',
    ],
    albums: ['Motivando a la Yal', 'Los Verdaderos', 'Motivan2'],
    notableSongs: ['Doncella', 'Otra Vez', 'Embriágame'],
    impact:
      'Aportaron equilibrio entre romanticismo urbano y energía bailable, ampliando el rango emocional del reggaetón.',
  },
  {
    name: 'Ñengo Flow',
    slug: 'nengo-flow',
    country: 'Puerto Rico',
    category: 'Urbano / Calle',
    shortBio: 'Exponente de lírica cruda y narrativa directa con fuerte identidad de calle.',
    biography:
      'Ñengo Flow ha construido una trayectoria constante en el circuito urbano, destacando por su voz grave y una propuesta enfocada en realismo barrial.',
    trajectory: [
      'Se posicionó en espacios independientes con mixtapes de alto alcance.',
      'Fortaleció su nombre mediante colaboraciones en la escena urbana latina.',
      'Conserva una audiencia fiel que valora su coherencia artística.',
    ],
    albums: ['Real G 4 Life', 'Flow Callejero', 'Los Reyes del Rap'],
    notableSongs: ['Hoy', 'En las Noches Frías', 'Gato de Noche'],
    impact:
      'Su perfil representa la continuidad del sonido callejero y la importancia de la voz independiente en la cultura urbana.',
  },
  {
    name: 'Bad Bunny',
    slug: 'bad-bunny',
    country: 'Puerto Rico',
    category: 'Urbano Global',
    shortBio: 'Figura contemporánea que redefinió la escala internacional de la música urbana latina.',
    biography:
      'Bad Bunny se consolidó como uno de los artistas latinos más influyentes de su generación, combinando innovación visual, riesgo creativo y conexión cultural masiva.',
    trajectory: [
      'Surgió desde plataformas digitales con una propuesta fresca y disruptiva.',
      'Escaló a escenarios globales con álbumes conceptuales de gran alcance.',
      'Amplió su influencia con proyectos multidisciplinarios y visión autoral.',
    ],
    albums: ['X 100PRE', 'YHLQMDLG', 'Un Verano Sin Ti'],
    notableSongs: ['Tití Me Preguntó', 'Yonaguni', 'Moscow Mule'],
    impact:
      'Su éxito impulsó nuevas conversaciones sobre identidad, estética y libertad creativa dentro de la industria latina.',
  },
  {
    name: 'Karol G',
    slug: 'karol-g',
    country: 'Colombia',
    category: 'Reggaetón / Pop Urbano',
    shortBio: 'Artista líder del pop urbano con narrativa personal, presencia global y enfoque de evolución constante.',
    biography:
      'Karol G ha construido una carrera ascendente con himnos de gran alcance, equilibrando sensibilidad pop y energía urbana con una voz reconocible.',
    trajectory: [
      'Desarrolló su propuesta en la escena colombiana antes de su expansión internacional.',
      'Afirmó su posición en el mercado latino con giras y lanzamientos exitosos.',
      'Fortaleció su marca artística con una identidad visual coherente y cercana.',
    ],
    albums: ['Unstoppable', 'KG0516', 'Mañana Será Bonito'],
    notableSongs: ['TQG', 'Provenza', 'BICHOTA'],
    impact:
      'Su recorrido inspira nuevas voces femeninas y confirma el protagonismo global del talento latino urbano.',
  },
];
