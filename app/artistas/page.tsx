import Link from 'next/link';
import { getArtistImageOrFallback, vedaArtists } from '@/lib/veda-artists';

export default function ArtistasPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
      <section className="space-y-4">
        <h1 className="section-title">Artistas Destacados</h1>
        <p className="max-w-3xl text-sm text-zinc-300">
          Explora biografías, trayectorias, álbumes y el impacto cultural de artistas que han marcado la música urbana.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vedaArtists.map((artist) => {
            const artistImage = getArtistImageOrFallback(artist.image);

            return <article key={artist.slug} className="panel hover-card rounded-2xl p-4">
              <div className="mb-4 h-44 overflow-hidden rounded-xl border border-zinc-700 bg-gradient-to-br from-[#2a0d10] via-[#171717] to-[#1b1508]">
                {artistImage ? (
                  <img src={artistImage} alt={artist.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-end p-3">
                    <span className="rounded-full border border-[#f5b21b]/60 bg-black/40 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#f5b21b]">V.E.D.A. PREMIUM</span>
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold text-zinc-100">{artist.name}</h2>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400">{artist.country} · {artist.category}</p>
              <p className="mt-2 text-sm text-zinc-300">{artist.shortBio}</p>
              <Link href={`/artistas/${artist.slug}`} className="mt-4 inline-block rounded-full border border-[#ef1f2d]/60 px-3.5 py-1.5 text-sm font-semibold text-zinc-100 transition hover:border-[#f5b21b]">Ver perfil</Link>
            </article>;
          })}
        </div>
      </section>
    </main>
  );
}
