import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArtistImageOrFallback, vedaArtists } from '@/lib/veda-artists';

type ArtistPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return vedaArtists.map((artist) => ({ slug: artist.slug }));
}

export default async function ArtistProfilePage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = vedaArtists.find((item) => item.slug === slug);

  if (!artist) notFound();

  const artistImage = getArtistImageOrFallback(artist.image);

  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 py-10 sm:px-6 lg:px-10">
      <article className="panel rounded-3xl p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap gap-3">
          <Link href="/artistas" className="inline-block rounded-full border border-[#f5b21b]/60 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-[#ef1f2d]">
            ← Todos los artistas
          </Link>
          <Link href="/#artistas-destacados" className="inline-block rounded-full border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-[#f5b21b]">
            Volver al inicio V.E.D.A.
          </Link>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Perfil editorial</p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-100 sm:text-4xl">{artist.name}</h1>
        <p className="mt-2 text-sm uppercase tracking-wide text-zinc-400">{artist.country} · {artist.category}</p>

        <div className="mt-6 h-64 overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-[#2a0d10] via-[#171717] to-[#1b1508] sm:h-80">
          {artistImage ? (
            <img src={artistImage} alt={artist.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-end p-4">
              <span className="rounded-full border border-[#f5b21b]/60 bg-black/40 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#f5b21b]">V.E.D.A. PREMIUM</span>
            </div>
          )}
        </div>

        <p className="mt-6 text-zinc-200">{artist.biography}</p>

        <section className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-700/80 bg-[#121212] p-4">
            <h2 className="mb-3 text-lg font-semibold text-zinc-100">Trayectoria</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
              {artist.trajectory.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-700/80 bg-[#121212] p-4">
            <h2 className="mb-3 text-lg font-semibold text-zinc-100">Álbumes</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
              {artist.albums.map((album) => <li key={album}>{album}</li>)}
            </ul>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-zinc-700/80 bg-[#121212] p-4">
          <h2 className="mb-3 text-lg font-semibold text-zinc-100">Canciones destacadas</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
            {artist.notableSongs.map((song) => <li key={song}>{song}</li>)}
          </ul>
        </section>

        <section className="mt-5 rounded-2xl border border-zinc-700/80 bg-[#121212] p-4">
          <h2 className="mb-3 text-lg font-semibold text-zinc-100">Impacto</h2>
          <p className="text-sm text-zinc-300">{artist.impact}</p>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/artistas" className="inline-block rounded-full border border-[#f5b21b]/60 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-[#ef1f2d]">
            ← Todos los artistas
          </Link>
          <Link href="/#artistas-destacados" className="inline-block rounded-full border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-[#f5b21b]">
            Volver al inicio V.E.D.A.
          </Link>
        </div>
      </article>
    </main>
  );
}
