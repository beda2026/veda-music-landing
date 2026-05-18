# V.E.D.A. MUSIC Landing

Landing estática estilo portal editorial urbano para V.E.D.A. MUSIC, construida con Next.js App Router, TypeScript y Tailwind CSS.

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Contador de visitas (producción en Vercel)

La ruta `POST /api/visits` incrementa el contador y `GET /api/visits` devuelve el total actual.

### Opción recomendada: Supabase

Configura estas variables en Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Crea la tabla y función SQL en Supabase:

```sql
create table if not exists public.page_visits (
  id bigserial primary key,
  page text not null unique,
  count bigint not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.increment_page_visit(p_page text)
returns table (count bigint)
language plpgsql
security definer
as $$
begin
  insert into public.page_visits (page, count, updated_at)
  values (p_page, 1, now())
  on conflict (page)
  do update set
    count = public.page_visits.count + 1,
    updated_at = now();

  return query
    select pv.count
    from public.page_visits pv
    where pv.page = p_page
    limit 1;
end;
$$;
```

> Para VEDA Music, la página usada es `page = 'home'`.

### Fallback: Vercel KV / Upstash

Si no usas Supabase, configura:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

La API usará `INCR visits:home` para mantener el total persistente en Redis.


## Email / Formularios

Configura estas variables en Vercel:

- `RESEND_API_KEY`
- `VEDA_CONTACT_TO_EMAIL=vedamusicpr@gmail.com`
- `VEDA_CONTACT_FROM_EMAIL=V.E.D.A. Music <onboarding@resend.dev>`

Nota: para producción final, se recomienda verificar un dominio propio en Resend y cambiar `VEDA_CONTACT_FROM_EMAIL` a un correo del dominio oficial.

## Security Baseline

Esta landing aplica una base de seguridad para producción en Vercel/Next.js:

- **Security headers globales** (incluye CSP):
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
  - `X-DNS-Prefetch-Control: on`
  - `Content-Security-Policy` compatible con embeds de YouTube / youtube-nocookie.
- **Secrets solo server-side**:
  - `RESEND_API_KEY` se usa únicamente en rutas backend (`/api/contact`, `/api/subscribe`).
  - No usar `NEXT_PUBLIC_RESEND_API_KEY`.
- **Rate limit básico anti-spam** en memoria por IP:
  - `/api/contact`: máximo 5 requests cada 10 minutos.
  - `/api/subscribe`: máximo 5 requests cada 10 minutos.
- **Honeypot anti-bots**:
  - Campo oculto `company` en formularios de suscripción y contacto comercial.
  - Si llega con valor, la API responde de forma silenciosa sin enviar correo.

### Recomendaciones futuras

- Verificar dominio propio en Resend.
- Cambiar `VEDA_CONTACT_FROM_EMAIL` a un correo oficial del dominio.
- Agregar storage/DB si deseas guardar leads además de enviar correo.
- Implementar rate limit persistente (por ejemplo Upstash Redis) si aumenta el tráfico.
