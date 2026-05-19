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
  conversationMode?: VedaConversationMode;
};

export type VedaConversationMode = 'neutral' | 'artist_lead' | 'business_lead';

const QUICK = {
  explore: ['Buscar artista', 'Buscar canción', 'Ver videos', 'Ver entrevista'],
  fan: ['Ver videos', 'Ver noticias', 'Buscar canción', 'Playlist VEDA'],
  lead: ['Contacto'],
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
const LEAD_CONTACT = /(soy cantante|soy artista|soy productor|tengo musica|tengo música|quiero promocionar|quiero pautar|tengo un negocio|tengo negocio|quiero anunciar|quiero promocionarme)/i;
const ARTIST_LEAD = /(soy cantante|soy artista|soy productor|manager|quiero sonar|tengo musica|tengo música|meter mi cancion|meter mi canción|enviar musica|enviar música|quiero salir)/i;
const BUSINESS_LEAD = /(negocio|barberia|barbería|restaurante|tienda|discoteca|marca)/i;
const EVENT_LEAD = /(evento|promotor|party|concierto)/i;
const CLEAR_MUSIC_SEARCH = /(videos?\s+de\s+|canciones?\s+de\s+|noticias?\s+de\s+|entrevista\s+de\s+|biografia\s+de\s+|biografía\s+de\s+)/i;
const LEAD_FOLLOW_UP = new Set(['musica', 'música', 'cancion', 'canción', 'video', 'mi tema', 'aqui', 'aquí', 'eso', 'quiero subirla', 'como funciona', 'cómo funciona']);
const AMBIGUOUS_SINGLE = new Set(['musica','música','reggaeton','trap','cancion','canción','video','artista','amor','perreo','remix','entrevista','noticias','negocio','promo']);
const WHAT_CAN_I_DO = /(que puedes hacer por mi|qué puedes hacer por mí|que puedes hacer|qué puedes hacer|que haces|qué haces)/i;
const VEDA_GUIDE = /(que puedes hacer|qué puedes hacer|que haces|qué haces|ayuda|que hay aqui|qué hay aquí|veda|web|sitio|seccion|sección)/i;
const VEDA_RECOMMEND = /(que me recomiendas|qué me recomiendas|recomiendame|recomiéndame)/i;
const PHOTO_QUERY = /(fotos?|imagenes?|im[aá]genes?)/i;

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function analyzeVedaSearchIntent(input: string, currentMode: VedaConversationMode = 'neutral'): VedaSearchIntentAnalysis {
  const normalizedQuery = (input ?? '').replace(/\s+/g, ' ').trim();
  const q = normalize(input ?? '');

  if (!normalizedQuery) {
    return {
      shouldCallApi: false,
      intent: 'ambiguous',
      confidence: 'low',
      normalizedQuery,
      userFacingReply: 'Te guío rápido. Dime artista, canción, video o si quieres mover algo en VEDA.',
      quickActions: [...QUICK.explore, 'Contacto'],
      reason: 'empty_query',
      conversationMode: currentMode,
    };
  }

  const isLeadFollowUp = LEAD_FOLLOW_UP.has(q) || q.startsWith('mi ') || q.includes('mi cancion') || q.includes('mi canción') || q.includes('mi video') || q.includes('mi musica') || q.includes('mi música');
  if ((currentMode === 'artist_lead' || currentMode === 'business_lead') && !CLEAR_MUSIC_SEARCH.test(q) && isLeadFollowUp) {
    const isArtist = currentMode === 'artist_lead';
    return {
      shouldCallApi: false,
      intent: isArtist ? 'artist_submission' : 'business_lead',
      confidence: 'high',
      normalizedQuery,
      userFacingReply: isArtist
        ? (q === 'como funciona' || q === 'cómo funciona'
          ? 'Revisamos tu material y evaluamos exposición dentro de VEDA. Déjanos la información en Contacto.'
          : 'Envíanos nombre artístico, canción y link en Contacto.')
        : 'Perfecto. Hay espacios de visibilidad para negocios y auspicios. Escríbenos en Contacto.',
      reason: 'lead_context_follow_up',
      conversationMode: currentMode,
    };
  }

  if (GREETINGS.test(q)) {
    return { shouldCallApi: false, intent: 'greeting', confidence: 'high', normalizedQuery, userFacingReply: 'Perfecto. ¿Buscas música o quieres promoción en VEDA?', quickActions: [...QUICK.explore.slice(0,2), ...QUICK.lead], reason: 'greeting', conversationMode: currentMode };
  }
  if (TEST.test(q)) {
    return { shouldCallApi: false, intent: 'ambiguous', confidence: 'high', normalizedQuery, userFacingReply: 'Entendido. Puedes buscar artista, canción o video.', quickActions: QUICK.explore, reason: 'test', conversationMode: currentMode };
  }

  if (LEAD_CONTACT.test(q)) {
    const isArtistLead = /artista|cantante|productor|musica|música/.test(q);
    return {
      shouldCallApi: false,
      intent: 'promotion_lead',
      confidence: 'high',
      normalizedQuery,
      userFacingReply: isArtistLead
        ? 'Perfecto. Envíanos nombre artístico, canción y link en Contacto.'
        : 'Perfecto. Hay espacios de visibilidad para negocios y auspicios. Escríbenos en Contacto.',
      quickActions: QUICK.lead,
      reason: 'lead_contact_rule',
      conversationMode: isArtistLead ? 'artist_lead' : 'business_lead',
    };
  }

  if (VEDA_RECOMMEND.test(q)) {
    return { shouldCallApi: false, intent: 'generic_music', confidence: 'high', normalizedQuery, userFacingReply: 'Puedes empezar por la radio, últimos videos o entrevistas destacadas.', quickActions: ['VEDA Radio', 'Últimos videos', 'Entrevistas'], reason: 'veda_recommend', conversationMode: currentMode };
  }

  if (q === 'musica' || q === 'música') {
    return { shouldCallApi: false, intent: 'generic_music', confidence: 'high', normalizedQuery, userFacingReply: 'Puedes escuchar VEDA Radio o buscar un artista, canción o playlist.', quickActions: ['VEDA Radio', 'Buscar artista', 'Buscar canción'], reason: 'music_entrypoint', conversationMode: currentMode };
  }

  if (WHAT_CAN_I_DO.test(q)) {
    return { shouldCallApi: false, intent: 'ambiguous', confidence: 'high', normalizedQuery, userFacingReply: 'Puedo guiarte por la página: música, videos, entrevistas, noticias, radio y Contacto.', quickActions: ['VEDA Radio', 'Videos', 'Entrevistas', 'Noticias', 'Contacto'], reason: 'what_can_i_do', conversationMode: currentMode };
  }

  if (VEDA_GUIDE.test(q)) {
    return { shouldCallApi: false, intent: 'ambiguous', confidence: 'high', normalizedQuery, userFacingReply: 'Encontrarás música, videos, entrevistas, noticias urbanas y artistas destacados.', quickActions: ['VEDA Radio', 'Videos', 'Entrevistas', 'Noticias', 'Contacto'], reason: 'veda_guide', conversationMode: currentMode };
  }

  if (PHOTO_QUERY.test(q)) {
    const artistMatch = normalizedQuery.match(/de\s+(.+)$/i);
    const artistName = artistMatch?.[1]?.trim() || 'ese artista';
    return { shouldCallApi: false, intent: 'ambiguous', confidence: 'high', normalizedQuery, userFacingReply: `Puedo ayudarte con videos, entrevistas, noticias o música de ${artistName}.`, quickActions: ['Ver videos', 'Ver entrevistas', 'Ver noticias'], reason: 'photo_not_allowed', conversationMode: currentMode };
  }

  if (PLAYLIST.test(q)) {
    return { shouldCallApi: true, intent: 'playlist_lookup', confidence: 'high', normalizedQuery: 'playlist oficial veda music', reason: 'playlist' };
  }

  if (ARTIST_LEAD.test(q)) {
    return { shouldCallApi: false, intent: 'artist_submission', confidence: 'high', normalizedQuery, userFacingReply: 'Perfecto. Podemos evaluar exposición para tu música. Déjanos nombre artístico, canción y link en Contacto.', quickActions: [], reason: 'artist_lead', conversationMode: 'artist_lead' };
  }
  if (EVENT_LEAD.test(q)) {
    return { shouldCallApi: false, intent: 'event_lead', confidence: 'high', normalizedQuery, userFacingReply: 'Perfecto. VEDA puede evaluar exposición para tu evento. Escríbenos en Contacto.', quickActions: [], reason: 'event_lead', conversationMode: 'business_lead' };
  }
  if (PROMO.test(q)) {
    const sponsor = /(pautar|auspiciar|auspicio)/i.test(q);
    return { shouldCallApi: false, intent: sponsor ? 'sponsor_lead' : 'promotion_lead', confidence: 'high', normalizedQuery, userFacingReply: 'Claro. Hay espacios de visibilidad comercial y auspicios. Puedes enviarlo en Contacto.', quickActions: [], reason: 'promotion_lead', conversationMode: /artista|cantante|productor|mi\s+(musica|música|cancion|canción|video)/i.test(q) ? 'artist_lead' : 'business_lead' };
  }
  if (BUSINESS_LEAD.test(q)) {
    return { shouldCallApi: false, intent: 'business_lead', confidence: 'high', normalizedQuery, userFacingReply: 'Perfecto. Hay espacios de visibilidad para negocios y auspicios. Escríbenos en Contacto.', quickActions: [], reason: 'business_lead', conversationMode: 'business_lead' };
  }

  const tokens = q.split(' ').filter(Boolean);
  if (tokens.length === 1 && AMBIGUOUS_SINGLE.has(tokens[0])) {
    return { shouldCallApi: false, intent: 'generic_music', confidence: 'medium', normalizedQuery, userFacingReply: tokens[0] === 'amor' ? 'Claro. ¿Buscas una canción llamada “Amor”, artista o video?' : 'Claro. ¿Buscas artistas, videos, canciones o playlist?', quickActions: QUICK.fan, reason: 'ambiguous_single', conversationMode: currentMode };
  }

  const hasDe = q.includes(' de ') || q.includes(' del ') || q.includes(' por ');
  if (NEWS.test(q)) return { shouldCallApi: true, intent: 'news_lookup', confidence: 'high', normalizedQuery, reason: 'news' };
  if (INTERVIEW.test(q)) return { shouldCallApi: true, intent: 'interview_lookup', confidence: 'high', normalizedQuery, reason: 'interview' };
  if (BIO.test(q)) return { shouldCallApi: true, intent: 'bio_lookup', confidence: 'high', normalizedQuery, reason: 'bio' };
  if (VIDEO.test(q)) return { shouldCallApi: true, intent: 'video_lookup', confidence: 'high', normalizedQuery, reason: 'video' };
  if (SONG_HINT.test(q) || hasDe) return { shouldCallApi: true, intent: 'song_lookup', confidence: 'medium', normalizedQuery, reason: 'song' };

  if (tokens.length <= 3) {
    return { shouldCallApi: false, intent: 'artist_lookup', confidence: 'medium', normalizedQuery, userFacingReply: `¿Qué quieres ver de ${normalizedQuery}: videos, canciones o noticias?`, quickActions: QUICK.fan, reason: 'artist_name_only', conversationMode: currentMode };
  }

  return { shouldCallApi: false, intent: 'ambiguous', confidence: 'low', normalizedQuery, userFacingReply: 'Puedo ayudarte con música, videos, entrevistas, noticias o guiarte dentro de VEDA.', quickActions: QUICK.explore, reason: 'fallback_ambiguous', conversationMode: currentMode };
}
