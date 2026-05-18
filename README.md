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
