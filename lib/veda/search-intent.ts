export type VedaSearchIntent =
  | 'greeting'
  | 'ambiguous'
  | 'generic_music'
  | 'artist_lookup'
  | 'song_lookup'
  | 'video_lookup'
  | 'interview_lookup'
  | 'bio_lookup'
  | 'news_lookup'
  | 'playlist_lookup'
  | 'artist_submission'
  | 'business_lead'
  | 'sponsor_lead'
  | 'promotion_lead'
  | 'event_lead';

export type VedaSearchIntentAnalysis = {
  shouldCallApi: boolean;
  intent: VedaSearchIntent;
  confidence: 'low' | 'medium' | 'high';
  normalizedQuery: string;
  userFacingReply?: string;
  quickActions?: string[];
  reason?: string;
};

const QUICK = {
  explore: ['Buscar artista', 'Buscar canción', 'Ver videos'],
  fan: ['Videos', 'Canciones', 'Noticias'],
  lead: ['Ir a Contacto'],
};

const GREETINGS = /^(hola|hello|hey|saludos?|buenas|que tal|qué tal|hi)$/i;
const TEST = /^(test|prueba|probando)$/i;
const PLAYLIST = /(playlist.*veda|veda.*playlist|spotify.*veda|youtube music.*veda)/i;
const NEWS = /(noticia|noticias|ultima noticia|última noticia|reciente)/i;
const VIDEO = /(videos?|video oficial|ultimo video|último video|estreno)/i;
const INTERVIEW = /(entrevista)/i;
const BIO = /(biografia|biografía|quien es|quién es)/i;
const SONG_HINT = /(cancion|canción|tema|track|single|remix)/i;
const PROMO = /(promocionar|promo|anunciarme|publicidad|pautar|auspiciar|auspicio)/i;
const ARTIST_LEAD = /(soy cantante|soy artista|soy productor|manager|quiero sonar|tengo musica|tengo música|meter mi cancion|meter mi canción|enviar musica|enviar música|quiero salir)/i;
const BUSINESS_LEAD = /(negocio|barberia|barbería|restaurante|tienda|discoteca|marca)/i;
const EVENT_LEAD = /(evento|promotor|party|concierto)/i;
const AMBIGUOUS_SINGLE = new Set(['musica','música','reggaeton','trap','cancion','canción','video','artista','amor','perreo','remix','entrevista','noticias','negocio','promo']);

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function analyzeVedaSearchIntent(input: string): VedaSearchIntentAnalysis {
  const normalizedQuery = (input ?? '').replace(/\s+/g, ' ').trim();
  const q = normalize(input ?? '');

  if (!normalizedQuery) {
    return {
      shouldCallApi: false,
      intent: 'ambiguous',
      confidence: 'low',
      normalizedQuery,
      userFacingReply: 'Hola, bienvenido. ¿Cómo puedo ayudarte?',
      quickActions: [],
      reason: 'empty_query',
    };
  }

  if (GREETINGS.test(q)) {
    return { shouldCallApi: false, intent: 'greeting', confidence: 'high', normalizedQuery, userFacingReply: 'Hola, bienvenido. ¿Cómo puedo ayudarte?', quickActions: [], reason: 'greeting' };
  }
  if (TEST.test(q)) {
    return { shouldCallApi: false, intent: 'ambiguous', confidence: 'high', normalizedQuery, userFacingReply: 'Listo. ¿Qué artista o canción buscas?', quickActions: [], reason: 'test' };
  }

  if (PLAYLIST.test(q)) {
    return { shouldCallApi: true, intent: 'playlist_lookup', confidence: 'high', normalizedQuery: 'playlist oficial veda music', reason: 'playlist' };
  }

  if (ARTIST_LEAD.test(q)) {
    return { shouldCallApi: false, intent: 'artist_submission', confidence: 'high', normalizedQuery, userFacingReply: 'Perfecto. VEDA puede darte exposición. Envíanos tu música en la sección de Contacto.', quickActions: ['Ir a Contacto'], reason: 'artist_lead' };
  }
  if (EVENT_LEAD.test(q)) {
    return { shouldCallApi: false, intent: 'event_lead', confidence: 'high', normalizedQuery, userFacingReply: 'Perfecto. VEDA puede ayudar a darle visibilidad. Envíanos la información en Contacto.', quickActions: ['Ir a Contacto'], reason: 'event_lead' };
  }
  if (PROMO.test(q)) {
    const sponsor = /(pautar|auspiciar|auspicio)/i.test(q);
    return { shouldCallApi: false, intent: sponsor ? 'sponsor_lead' : 'promotion_lead', confidence: 'high', normalizedQuery, userFacingReply: sponsor ? 'Para pautas y auspicios, déjanos tus datos en Contacto.' : 'Claro. Si es música, negocio o evento, puedes enviar tu propuesta en Contacto.', quickActions: ['Ir a Contacto'], reason: 'promotion_lead' };
  }
  if (BUSINESS_LEAD.test(q)) {
    return { shouldCallApi: false, intent: 'business_lead', confidence: 'high', normalizedQuery, userFacingReply: 'Perfecto. VEDA ofrece espacio para auspicios y visibilidad. Escríbenos en Contacto.', quickActions: ['Ir a Contacto'], reason: 'business_lead' };
  }

  const tokens = q.split(' ').filter(Boolean);
  if (tokens.length === 1 && AMBIGUOUS_SINGLE.has(tokens[0])) {
    return { shouldCallApi: false, intent: 'generic_music', confidence: 'medium', normalizedQuery, userFacingReply: tokens[0] === 'amor' ? 'Entendido. ¿Buscas la canción “Amor” o un artista?' : 'Perfecto. ¿Nombre del artista o canción?', quickActions: [], reason: 'ambiguous_single' };
  }

  const hasDe = q.includes(' de ') || q.includes(' del ') || q.includes(' por ');
  if (NEWS.test(q)) return { shouldCallApi: true, intent: 'news_lookup', confidence: 'high', normalizedQuery, reason: 'news' };
  if (INTERVIEW.test(q)) return { shouldCallApi: true, intent: 'interview_lookup', confidence: 'high', normalizedQuery, reason: 'interview' };
  if (BIO.test(q)) return { shouldCallApi: true, intent: 'bio_lookup', confidence: 'high', normalizedQuery, reason: 'bio' };
  if (VIDEO.test(q)) return { shouldCallApi: true, intent: 'video_lookup', confidence: 'high', normalizedQuery, reason: 'video' };
  if (SONG_HINT.test(q) || hasDe) return { shouldCallApi: true, intent: 'song_lookup', confidence: 'medium', normalizedQuery, reason: 'song' };

  if (tokens.length <= 3) {
    return { shouldCallApi: false, intent: 'artist_lookup', confidence: 'medium', normalizedQuery, userFacingReply: `¿Qué quieres ver de ${normalizedQuery}: videos, canciones o noticias?`, quickActions: ['Videos', 'Canciones', 'Noticias'], reason: 'artist_name_only' };
  }

  return { shouldCallApi: false, intent: 'ambiguous', confidence: 'low', normalizedQuery, userFacingReply: 'Entendido. ¿Nombre del artista o canción?', quickActions: [], reason: 'fallback_ambiguous' };
}
