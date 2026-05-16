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
    category: 'Reggaetón / Urbano',
    image: '/assets/artists/daddy-yankee.png',
    shortBio:
      'Figura clave en la expansión global del reggaetón y una de las voces más influyentes de la música urbana latina.',
    biography:
      'Daddy Yankee es uno de los artistas fundamentales en la historia del reggaetón. Desde sus inicios en la escena underground de Puerto Rico, desarrolló una identidad sonora directa, energética y comercialmente poderosa. Su impacto se consolidó con proyectos que llevaron el sonido urbano boricua a mercados internacionales, convirtiéndolo en referencia para generaciones de artistas. Con una carrera marcada por disciplina, visión empresarial y dominio del formato radial, Daddy Yankee ayudó a transformar el reggaetón de movimiento local a fenómeno global.',
    trajectory: [
      'Comenzó en la escena urbana puertorriqueña, participando en la evolución temprana del rap y reggaetón underground.',
      'Consolidó su nombre con un estilo agresivo, bailable y de alto impacto comercial.',
      'Barrio Fino marcó un punto de expansión internacional para el reggaetón.',
      'Su trabajo abrió puertas para que el género entrara con fuerza en radio, televisión, giras y mercados globales.',
      'Además de artista, desarrolló una presencia empresarial dentro del entretenimiento urbano.',
    ],
    albums: ['El Cangri.com', 'Barrio Fino', 'El Cartel: The Big Boss', 'Mundial', 'Prestige', 'Legendaddy'],
    notableSongs: ['Gasolina', 'Lo Que Pasó, Pasó', 'Rompe', 'Ella Me Levantó', 'Limbo', 'Con Calma'],
    impact:
      'Su legado está conectado directamente con la internacionalización del reggaetón. Daddy Yankee representa la transición del sonido de barrio a industria global, manteniendo una identidad urbana reconocible y comercialmente dominante.',
  },
  {
    name: 'Don Omar',
    slug: 'don-omar',
    country: 'Puerto Rico',
    category: 'Reggaetón / Urbano / Latin Pop',
    image: '/assets/artists/don-omar.png',
    shortBio:
      'Conocido como una de las voces más imponentes del género, Don Omar combinó reggaetón, melodía, drama y visión conceptual.',
    biography:
      'Don Omar es una figura esencial del reggaetón por su capacidad de unir fuerza callejera, interpretación vocal y narrativa musical. Su debut The Last Don lo posicionó como una voz dominante dentro del movimiento urbano, con una propuesta que mezclaba lírica, melodía, espiritualidad, calle y espectáculo. A lo largo de su carrera, Don Omar construyó un catálogo amplio que cruza reggaetón, dancehall, música tropical, pop latino y colaboraciones de alto alcance. Su presencia escénica y su tono dramático lo convirtieron en uno de los artistas más reconocibles de la música urbana latina.',
    trajectory: [
      'Se estableció como una de las figuras principales del reggaetón de los 2000.',
      'The Last Don marcó su entrada como solista con impacto internacional.',
      'Expandió su sonido con fusiones de reggaetón, pop latino, electrónica y música tropical.',
      'Desarrolló una imagen artística marcada por teatralidad, potencia vocal y narrativa.',
      'Su música conectó con públicos de Puerto Rico, Latinoamérica, Estados Unidos y Europa.',
    ],
    albums: ['The Last Don', 'King of Kings', 'iDon', 'Meet the Orphans', 'MTO²: New Generation', 'The Last Don II'],
    notableSongs: ['Dale Don Dale', 'Dile', 'Pobre Diabla', 'Salió El Sol', 'Virtual Diva', 'Danza Kuduro'],
    impact:
      'Don Omar aportó dimensión vocal y cinematográfica al reggaetón. Su carrera ayudó a demostrar que el género podía sostener álbumes conceptuales, giras masivas y éxitos internacionales sin perder su identidad urbana.',
  },
  {
    name: 'Tego Calderón',
    slug: 'tego-calderon',
    country: 'Puerto Rico',
    category: 'Rap / Reggaetón / Afrocaribeño',
    image: '/assets/artists/tego-calderon.png',
    shortBio:
      'Una voz distinta del movimiento urbano, reconocida por su lírica social, identidad afrocaribeña y fusión musical.',
    biography:
      'Tego Calderón es una de las figuras más respetadas de la música urbana latina. Su propuesta se distinguió desde el inicio por mezclar rap, reggaetón, bomba, plena, salsa, reggae y comentario social. Con El Abayarde, Tego presentó una visión distinta del género: menos enfocada en la fórmula comercial y más conectada con identidad, calle, raza, cultura y conciencia. Su estilo vocal, su presencia y su forma de escribir lo convirtieron en una figura de culto dentro y fuera de Puerto Rico.',
    trajectory: [
      'Surgió con una propuesta distinta dentro del reggaetón puertorriqueño.',
      'El Abayarde se convirtió en un disco clave para entender la expansión del género.',
      'Integró sonidos afrocaribeños y letras con conciencia social.',
      'Su figura abrió espacio para una visión más cultural y crítica dentro del urbano.',
      'Ha sido influencia para artistas que buscan autenticidad, raíz y discurso propio.',
    ],
    albums: ['El Abayarde', 'El Enemy de los Guasíbiri', 'The Underdog / El Subestimado', 'El Abayarde Contraataca', 'El Que Sabe, Sabe'],
    notableSongs: ['Pa\' Que Retozen', 'Guasa Guasa', 'Métele Sazón', 'Al Natural', 'Los Maté', 'Pegaito a la Pared'],
    impact:
      'Tego representa la conciencia cultural del reggaetón. Su obra conecta el movimiento urbano con las raíces afrocaribeñas, la crítica social y una visión musical más amplia que la pista de baile.',
  },
  {
    name: 'Ivy Queen',
    slug: 'ivy-queen',
    country: 'Puerto Rico',
    category: 'Reggaetón / Rap / Urbano',
    image: '/assets/artists/ivy-queen.png',
    shortBio:
      'Pionera y referente femenina del reggaetón, reconocida por su voz, carácter y defensa de la mujer dentro del género.',
    biography:
      'Ivy Queen es una pionera fundamental del reggaetón y una de las artistas que abrió camino para la presencia femenina dentro de un espacio históricamente dominado por hombres. Desde sus primeras etapas en la escena urbana, desarrolló una voz fuerte, frontal y reconocible. Con discos como Diva, consolidó una identidad que combinaba perreo, lírica directa, independencia y afirmación femenina. Su trayectoria no solo se mide por canciones, sino por el espacio que ayudó a construir para otras mujeres dentro de la música urbana.',
    trajectory: [
      'Fue parte de la etapa temprana del movimiento urbano puertorriqueño.',
      'Construyó una imagen artística fuerte en una industria dominada por voces masculinas.',
      'Diva fortaleció su posición como una de las figuras más importantes del género.',
      'Sus letras tocaron temas de deseo, independencia, respeto y poder femenino.',
      'Se convirtió en influencia directa para nuevas generaciones de artistas urbanas.',
    ],
    albums: ['En Mi Imperio', 'The Original Rude Girl', 'Diva', 'Real', 'Flashback', 'Sentimiento', 'Musa', 'Vendetta'],
    notableSongs: ['Quiero Bailar', 'Yo Quiero Saber', 'Papi Te Quiero', 'Te He Querido, Te He Llorado', 'La Vida Es Así'],
    impact:
      'Ivy Queen es una figura indispensable para entender la evolución social del reggaetón. Su legado está en la música y también en la representación, abriendo puertas para mujeres con voz propia dentro del género.',
  },
  {
    name: 'Wisin & Yandel',
    slug: 'wisin-y-yandel',
    country: 'Puerto Rico',
    category: 'Reggaetón / Dúo Urbano',
    image: '/assets/artists/wisin-y-yandel.png',
    shortBio:
      'Uno de los dúos más importantes del reggaetón, reconocidos por su energía, química musical y alcance internacional.',
    biography:
      'Wisin & Yandel son conocidos como una de las duplas más influyentes de la música urbana latina. Su fórmula combinó energía, melodía, agresividad, coros pegajosos y una visión de espectáculo que los llevó a escenarios internacionales. Con álbumes como Los Extraterrestres y La Revolución, el dúo ayudó a definir una etapa comercial del reggaetón en la que el género se volvió más global, más producido y más colaborativo. Su impacto se siente tanto en el sonido de club como en la estructura moderna del hit urbano.',
    trajectory: [
      'Se consolidaron como dúo durante el crecimiento internacional del reggaetón.',
      'Desarrollaron una dinámica vocal basada en contraste, energía y melodía.',
      'Los Extraterrestres marcó una etapa de expansión global para el dúo.',
      'Trabajaron con figuras del género y artistas de mercados internacionales.',
      'Su propuesta ayudó a convertir el reggaetón en espectáculo de giras y grandes escenarios.',
    ],
    albums: ['De Nuevos a Viejos', 'Mi Vida... My Life', "Pa'l Mundo", 'Los Vaqueros', 'Wisin vs. Yandel: Los Extraterrestres', 'La Revolución', 'Líderes'],
    notableSongs: ['Rakata', 'Pam Pam', 'Noche de Sexo', 'Sexy Movimiento', 'Me Estás Tentando', 'Algo Me Gusta de Ti'],
    impact:
      'Wisin & Yandel llevaron el formato de dúo urbano a nivel internacional. Su legado combina hits, giras, colaboraciones y una influencia directa en la manera de construir canciones comerciales dentro del reggaetón.',
  },
  {
    name: 'Arcángel',
    slug: 'arcangel',
    country: 'Puerto Rico / República Dominicana',
    category: 'Reggaetón / Trap Latino / Urbano',
    image: '/assets/artists/arcangel.png',
    shortBio:
      'Una de las voces más influyentes del urbano moderno, puente entre el reggaetón melódico, el trap latino y la calle.',
    biography:
      'Arcángel construyó una carrera basada en versatilidad, melodía y presencia callejera. Desde sus primeros años en el género, se destacó por un tono vocal diferente, una forma de frasear reconocible y una capacidad para moverse entre reggaetón, trap, R&B y colaboraciones de alto impacto. Su disco El Fenómeno ayudó a consolidar su etapa como solista, mientras que su influencia posterior lo posicionó como referente para artistas de la nueva escuela. Arcángel representa una conexión importante entre la era clásica del reggaetón y el trap latino moderno.',
    trajectory: [
      'Ganó reconocimiento temprano por su estilo melódico y su presencia en colaboraciones urbanas.',
      'El Fenómeno marcó una etapa importante en su carrera como solista.',
      'Se convirtió en una figura influyente para el trap latino y la nueva escuela.',
      'Ha mantenido relevancia gracias a su capacidad de adaptarse sin perder identidad.',
      'Su catálogo conecta reggaetón clásico, calle, melodía y barras.',
    ],
    albums: ['El Fenómeno', 'Sentimiento, Elegancia & Maldad', 'Ares', 'Historias de un Capricornio', 'Sr. Santos', 'Sr. Santos II: Sueños de Grandeza'],
    notableSongs: ['Chica Virtual', 'Por Amar a Ciegas', 'Me Prefieres a Mí', 'Hace Mucho Tiempo', 'La Jumpa', 'JS4E'],
    impact:
      'Arcángel es una figura de transición y permanencia. Su influencia se nota en la forma en que artistas posteriores mezclan melodía, trap, reggaetón y actitud callejera con identidad propia.',
  },
  {
    name: 'Zion & Lennox',
    slug: 'zion-y-lennox',
    country: 'Puerto Rico',
    category: 'Reggaetón / Dúo Melódico',
    image: '/assets/artists/zion-y-lennox.png',
    shortBio:
      'Dúo clave del reggaetón melódico, reconocido por canciones románticas, club records y coros memorables.',
    biography:
      'Zion & Lennox ocuparon un lugar especial dentro del reggaetón al combinar calle, melodía y romanticismo. Desde Motivando a la Yal, el dúo desarrolló un sonido enfocado en hooks pegajosos, voces contrastantes y canciones que podían funcionar tanto en la discoteca como en la radio. Su estilo ayudó a suavizar ciertas estructuras del género sin perder el pulso urbano. Con el paso de los años, se mantuvieron como referencia para el reggaetón romántico y colaborativo.',
    trajectory: [
      'Formaron parte de la generación que llevó el reggaetón a un público más amplio.',
      'Motivando a la Yal definió una etapa importante de su sonido.',
      'Desarrollaron una identidad basada en melodía, perreo y romanticismo urbano.',
      'Motivan2 confirmó su vigencia en una etapa más moderna del género.',
      'Su catálogo es referencia para dúos y artistas que trabajan el reggaetón melódico.',
    ],
    albums: ['Motivando a la Yal', 'Los Verdaderos', 'Motivan2', 'El Sistema'],
    notableSongs: ['Doncella', 'Yo Voy', 'Bandida', 'Otra Vez', 'La Player', 'Embriágame'],
    impact:
      'Zion & Lennox aportaron suavidad, melodía y accesibilidad al reggaetón. Su trabajo ayudó a expandir el género hacia audiencias que conectaban con letras románticas sin abandonar el ritmo urbano.',
  },
  {
    name: 'Ñengo Flow',
    slug: 'nengo-flow',
    country: 'Puerto Rico',
    category: 'Reggaetón / Calle / Trap',
    image: '/assets/artists/nengo-flow.png',
    shortBio:
      'Representante de la línea más callejera del reggaetón y una figura respetada dentro del sonido underground.',
    biography:
      'Ñengo Flow es una voz asociada con la crudeza, la calle y la lealtad al movimiento underground. Su serie Real G4 Life fortaleció una identidad marcada por barras directas, códigos de barrio y colaboraciones con figuras clave del reggaetón y trap latino. A diferencia de propuestas más comerciales, Ñengo ha mantenido una estética de calle que conecta con fanáticos del sonido duro y del maleanteo. Su influencia se siente especialmente en artistas que valoran autenticidad, resistencia y raíz urbana.',
    trajectory: [
      'Se desarrolló dentro de la escena underground puertorriqueña.',
      'Real G4 Life consolidó su identidad como artista de calle.',
      'Ha colaborado con figuras importantes del reggaetón y trap latino.',
      'Su música mantiene un lenguaje directo y fiel a la estética underground.',
      'Es referencia para artistas que buscan un sonido crudo, oscuro y callejero.',
    ],
    albums: ['Flow Callejero', 'Real G4 Life', 'Real G4 Life 2', 'Real G4 Life 2.5', 'Real G4 Life 3'],
    notableSongs: ['En Las Noches Frías', 'Real G4 Life', 'Sigue Viajando', 'Hoy', 'Llegamos a la Disco', 'Safaera'],
    impact:
      'Ñengo Flow representa la permanencia del sonido underground dentro del urbano. Su catálogo conecta con la calle, el trap y una audiencia que valora la autenticidad por encima de la fórmula comercial.',
  },
  {
    name: 'Bad Bunny',
    slug: 'bad-bunny',
    country: 'Puerto Rico',
    category: 'Urbano / Trap Latino / Reggaetón / Alternativo',
    image: '/assets/artists/bad-bunny.png',
    shortBio:
      'Una de las figuras más influyentes de la música latina contemporánea, reconocido por romper formatos y amplificar la identidad puertorriqueña.',
    biography:
      'Bad Bunny transformó la música urbana latina con una propuesta que combina trap, reggaetón, pop alternativo, sensibilidad emocional y discurso cultural. Su ascenso demostró que un artista latino podía dominar plataformas globales sin abandonar el español ni su identidad puertorriqueña. A través de proyectos como X 100PRE, YHLQMDLG, Un Verano Sin Ti y Debí Tirar Más Fotos, ha expandido los límites del género, integrando sonidos caribeños, estética visual, comentario social y experimentación. Su carrera representa una nueva etapa del artista urbano: global, conceptual, local y culturalmente consciente.',
    trajectory: [
      'Emergió desde la escena digital y el trap latino con una voz distinta.',
      'X 100PRE consolidó su identidad como artista de álbum, no solo de sencillos.',
      'YHLQMDLG reconectó con el reggaetón de raíz y la nostalgia urbana.',
      'Un Verano Sin Ti amplió el alcance global de la música latina en español.',
      'Debí Tirar Más Fotos reforzó su vínculo con Puerto Rico, su historia y sus sonidos tradicionales.',
    ],
    albums: ['X 100PRE', 'YHLQMDLG', 'El Último Tour del Mundo', 'Un Verano Sin Ti', 'Nadie Sabe Lo Que Va a Pasar Mañana', 'Debí Tirar Más Fotos'],
    notableSongs: ['Soy Peor', 'Callaíta', 'Safaera', 'Yo Perreo Sola', 'Tití Me Preguntó', 'Me Porto Bonito', 'DTMF'],
    impact:
      'Bad Bunny cambió la escala del urbano latino. Su impacto combina música, moda, identidad cultural, visuales y conversación social, posicionándolo como una figura central de la cultura pop global desde Puerto Rico.',
  },
  {
    name: 'Karol G',
    slug: 'karol-g',
    country: 'Colombia',
    category: 'Urbano / Reggaetón / Latin Pop',
    image: '/assets/artists/karol-g.png',
    shortBio:
      'Una de las artistas latinas más importantes de su generación, reconocida por su conexión emocional, liderazgo femenino y alcance global.',
    biography:
      'Karol G es una figura central en la expansión global de la música latina contemporánea. Desde Colombia, construyó una carrera marcada por constancia, evolución sonora y una conexión fuerte con su audiencia. Su propuesta cruza reggaetón, pop latino, música urbana y letras de empoderamiento, amor, desamor y superación. Con proyectos como KG0516 y Mañana Será Bonito, consolidó una identidad artística propia y abrió nuevas rutas para mujeres dentro del género urbano. Su impacto reciente la posiciona como una artista capaz de llenar estadios, liderar conversaciones culturales y representar el crecimiento internacional de la música en español.',
    trajectory: [
      'Comenzó construyendo una base sólida dentro del mercado urbano colombiano y latino.',
      'Desarrolló una identidad cercana, emocional y poderosa dentro del reggaetón.',
      'KG0516 marcó una etapa de consolidación internacional.',
      'Mañana Será Bonito amplió su alcance global y fortaleció su narrativa personal.',
      'Su carrera ha sido clave en la visibilidad de mujeres dentro del urbano global.',
    ],
    albums: ['Unstoppable', 'Ocean', 'KG0516', 'Mañana Será Bonito', 'Mañana Será Bonito (Bichota Season)', 'Tropicoqueta'],
    notableSongs: ['Tusa', 'Bichota', 'Provenza', 'MAMIII', 'Mientras Me Curo del Cora', 'Si Antes Te Hubiera Conocido'],
    impact:
      'Karol G representa una nueva etapa de liderazgo femenino dentro de la música latina. Su éxito conecta identidad, emoción, espectáculo y una comunidad global que la reconoce como voz principal del urbano contemporáneo.',
  },
];
