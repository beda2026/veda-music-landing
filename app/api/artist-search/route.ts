import { NextRequest, NextResponse } from 'next/server';

type SearchResult = {
  title: string;
  type: 'artist' | 'video' | 'article' | 'social' | 'other';
  source: string;
  snippet: string;
  url: string;
  image?: string;
};

const SEARCH_PROMPT = 'Busca información pública reciente sobre el artista o tema consultado para una plataforma editorial de entretenimiento urbano. Devuelve resultados breves, seguros y útiles: título, tipo, fuente, resumen, url e imagen si está disponible. No inventes datos. Si no hay resultados confiables, devuelve lista vacía.';
const allowedTypes = new Set(['artist', 'video', 'article', 'social', 'other']);

function normalizeQuery(value: string | null): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function sanitizeResults(results: unknown): SearchResult[] {
  if (!Array.isArray(results)) return [];

  return results
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const candidate = item as Record<string, unknown>;
      const title = typeof candidate.title === 'string' ? candidate.title.trim() : '';
      const source = typeof candidate.source === 'string' ? candidate.source.trim() : 'Web';
      const snippet = typeof candidate.snippet === 'string' ? candidate.snippet.trim() : '';
      const url = typeof candidate.url === 'string' ? candidate.url.trim() : '';
      const typeValue = typeof candidate.type === 'string' ? candidate.type : 'other';
      const type = allowedTypes.has(typeValue) ? typeValue : 'other';
      const image = typeof candidate.image === 'string' && candidate.image.trim() ? candidate.image.trim() : undefined;

      if (!title || !snippet) return null;

      return { title, source, snippet, url, type, image } as SearchResult;
    })
    .filter((item): item is SearchResult => Boolean(item));
}

export async function GET(request: NextRequest) {
  const query = normalizeQuery(request.nextUrl.searchParams.get('q'));

  if (!query) {
    return NextResponse.json({ ok: false, error: 'Debes escribir algo para buscar.' }, { status: 400 });
  }

  if (query.length < 2 || query.length > 80) {
    return NextResponse.json({ ok: false, error: 'La búsqueda debe tener entre 2 y 80 caracteres.' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ ok: false, error: 'Search provider not configured.' }, { status: 503 });
  }

  const model = process.env.OPENAI_MODEL ?? 'gpt-5-mini';

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        tools: [{ type: 'web_search_preview' }],
        input: [
          {
            role: 'system',
            content: SEARCH_PROMPT,
          },
          {
            role: 'user',
            content: `Consulta: ${query}. Devuelve únicamente JSON con {"results": [...]}.`,
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'artist_search_results',
            schema: {
              type: 'object',
              properties: {
                results: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      type: { type: 'string' },
                      source: { type: 'string' },
                      snippet: { type: 'string' },
                      url: { type: 'string' },
                      image: { type: 'string' },
                    },
                    required: ['title', 'type', 'source', 'snippet', 'url'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['results'],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: 'No se pudo completar la búsqueda ahora mismo.' }, { status: 502 });
    }

    const data = (await response.json()) as { output_text?: string };
    const parsed = data.output_text ? (JSON.parse(data.output_text) as { results?: unknown }) : { results: [] };
    const results = sanitizeResults(parsed.results);

    return NextResponse.json({ ok: true, query, results });
  } catch {
    return NextResponse.json({ ok: false, error: 'No se pudo completar la búsqueda ahora mismo.' }, { status: 500 });
  }
}
