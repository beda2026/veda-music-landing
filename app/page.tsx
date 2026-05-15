import VisitCounter from '@/components/VisitCounter';
import { interviews, photos, releases, services, topTen, videos } from '@/lib/veda-data';

const navLinks = ['Inicio', 'Noticias', 'Música', 'Videos', 'Fotos', 'Entrevistas', 'Contacto'];
const socialLinks = ['F', 'X', 'IG', 'YT', 'TT', 'SP'];

export default function HomePage() {
  return (
    <>
      <header className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-10">
        <div className="ad-box mb-4 text-center">AD · TOP BANNER 728x90 · LEADERBOARD</div>

        <div className="panel mb-4 flex flex-col gap-3 rounded-2xl p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-[#ef1f2d] px-3 py-1 font-semibold text-white">TRENDING</span>
            <p className="text-zinc-300">Eladio Carrión llevó CORSA al Coliseo de Puerto Rico · LIT Killah ft. Paulo Londra, Khea y Ramma – Si Te Vas 2.0 · Kris R – Lindos Recuerdos</p>
          </div>
          <p className="social-clean text-xs text-zinc-300">SÍGUENOS: {socialLinks.join(' · ')}</p>
        </div>

        <div className="panel flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-3xl font-black leading-none text-zinc-50">V.E.D.A.</p>
            <p className="text-xl font-bold tracking-[0.3em] text-[#f5b21b]">MUSIC</p>
            <p className="mt-1 text-xs uppercase text-zinc-400">Videos · Entrevistas · Descubrimiento · Artistas</p>
          </div>
          <nav className="hide-scrollbar -mx-2 flex gap-3 overflow-x-auto px-2 text-sm font-medium text-zinc-200 lg:flex-wrap lg:overflow-visible">
            {navLinks.map((link) => (
              <a key={link} href={link === 'Inicio' ? '#' : `#${link.toLowerCase()}`} className="whitespace-nowrap rounded-full border border-zinc-700 px-3 py-1.5 transition hover:border-[#ef1f2d] hover:text-white">
                {link}
              </a>
            ))}
          </nav>
          <button type="button" className="self-start rounded-full border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:border-[#f5b21b]">
            ⌕
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_300px]">
          <article className="hero-panel rounded-3xl p-6 lg:p-8">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-zinc-300">V.E.D.A. MUSIC · PUERTO RICO</p>
            <h1 className="hero-title text-zinc-50">
              LA NUEVA PLATAFORMA <span className="urbana-accent">URBANA</span>
            </h1>
            <p className="mt-4 max-w-xl text-zinc-200">Videos, entrevistas, estrenos, fotos y todo lo que mueve la cultura latina con mirada editorial premium.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#videos" className="btn-red">Ver lo más nuevo</a>
              <a href="#entrevistas" className="btn-gold">Explorar artistas</a>
            </div>
            <div className="hero-strip mt-8 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-zinc-300">
                <span>EDITORIAL URBANO</span>
                <span>VEDA SELECTION</span>
              </div>
            </div>
          </article>

          <article className="panel hover-card rounded-3xl p-5 featured-card">
            <span className="inline-block rounded-full border border-[#f5b21b] bg-[#f5b21b1a] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#f5b21b]">ENTREVISTA / ESTRENO</span>
            <div className="featured-visual my-4 flex h-44 items-center justify-center rounded-2xl border border-zinc-700">
              <span className="text-7xl font-black text-zinc-100">V</span>
              <span className="featured-play">▶</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">LIT Killah, Paulo Londra, Khea y Ramma – Si Te Vas 2.0</h2>
            <p className="mt-2 text-zinc-300">Uno de los lanzamientos más comentados del movimiento.</p>
            <button type="button" className="mt-4 rounded-full border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-[#ef1f2d]">Leer más</button>
          </article>

          <aside className="ad-box flex min-h-[250px] flex-col items-center justify-center rounded-3xl text-center">
            <p className="text-xl font-semibold">AD</p>
            <p>RECTANGLE</p>
            <p>300x250</p>
          </aside>
        </section>

        <section id="videos" className="space-y-4">
          <h2 className="section-title">Últimos Videos</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {videos.map((video, idx) => (
              <article key={video.title} className="panel hover-card rounded-2xl p-4 media-card">
                <div className="video-thumb mb-3 flex h-40 rounded-xl border border-zinc-700 p-4" data-idx={idx}>
                  <span className="media-initial">{video.title.charAt(0)}</span>
                  <span className="video-play">▶</span>
                  <span className="media-badge">VIDEO</span>
                </div>
                <h3 className="font-semibold text-zinc-100">{video.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{video.category}</p>
                <p className="mt-1 text-sm text-zinc-300">{video.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="section-title">Fotos Recientes</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {photos.map((photo, idx) => (
              <article key={photo.title} className="panel hover-card rounded-2xl p-4 media-card">
                <div className="photo-thumb mb-3 h-36 rounded-xl border border-zinc-700 p-3" data-idx={idx}>
                  <span className="media-badge">GALERÍA</span>
                </div>
                <h3 className="font-semibold text-zinc-100">{photo.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{photo.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="entrevistas" className="space-y-4">
          <h2 className="section-title">Entrevistas / Exclusivas</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {interviews.map((item, idx) => (
              <article key={item.title} className="panel hover-card rounded-2xl p-4 interview-card" data-idx={idx}>
                <span className="media-badge mb-3 inline-block">EXCLUSIVA</span>
                <h3 className="font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{item.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ad-box flex flex-col items-center justify-between gap-3 rounded-2xl p-5 text-center md:flex-row md:text-left">
          <div>
            <p className="font-semibold">SPONSORED BANNER · 970x90</p>
            <p className="text-zinc-300">Tu marca aquí con la cultura urbana</p>
          </div>
          <a href="#contacto" className="btn-gold">Más información</a>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="panel rounded-2xl p-5">
            <h2 className="section-title mb-4">Estrenos / Música Nueva</h2>
            <div className="space-y-3">
              {releases.map((release) => (
                <article key={release} className="hover-card rounded-xl border border-zinc-700 bg-[#121212] p-3 before:mr-2 before:text-[#f5b21b] before:content-['●']">
                  {release}
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <aside className="panel rounded-2xl p-5">
              <h2 className="section-title mb-3">Top 10</h2>
              <ol className="space-y-2 text-sm text-zinc-200">
                {topTen.map((item, idx) => (
                  <li key={item} className="flex gap-2 border-b border-zinc-800 pb-2">
                    <span className="text-[#f5b21b]">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </aside>
            <aside className="ad-box flex min-h-[250px] flex-col items-center justify-center rounded-2xl text-center">
              <p>SPONSORED CARD</p>
              <p>300x250</p>
              <p>Tu promo aquí</p>
            </aside>
          </div>
        </section>

        <section id="contacto" className="space-y-4">
          <h2 className="section-title">Nuestros Servicios</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="panel hover-card rounded-2xl p-4 service-card">
                <h3 className="font-semibold text-zinc-100">{service.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{service.description}</p>
              </article>
            ))}
          </div>
          <div className="panel rounded-2xl p-5 text-center">
            <p className="mb-4 text-lg font-semibold text-zinc-100">¿Listo para llevar tu carrera al siguiente nivel?</p>
            <a href="mailto:vedamusicpr@gmail.com" className="btn-red">Contáctanos</a>
          </div>
        </section>

        <section className="ad-box rounded-2xl p-5 text-center">
          <p className="mb-4 font-semibold">BRAND PARTNERS · PATROCINADORES OFICIALES</p>
          <div className="grid gap-3 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={`slot-${idx}`} className="rounded-xl border border-zinc-700 bg-[#151515] p-4 text-sm text-zinc-300">Tu logo aquí</div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 bg-[#0c0c0c]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-10">
          <div>
            <h2 className="text-2xl font-black text-zinc-100">V.E.D.A. MUSIC</h2>
            <p className="mt-3 text-sm text-zinc-300">Plataforma urbana independiente dedicada a la música, videos, entrevistas, fotos y artistas que están moviendo la cultura.</p>
          </div>
          <div className="text-sm text-zinc-300">
            <p>vedamusicpr@gmail.com</p>
            <p>Puerto Rico</p>
            <p>Disponibles para colaboraciones</p>
            <div className="mt-3"><VisitCounter /></div>
          </div>
          <form className="flex items-center gap-2" aria-label="newsletter">
            <input type="email" placeholder="Tu correo electrónico" className="w-full rounded-xl border border-zinc-700 bg-[#101010] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500" />
            <button type="submit" className="btn-gold">→</button>
          </form>
        </div>
        <p className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">© 2026 V.E.D.A. MUSIC. Hecho con corazón en Puerto Rico.</p>
      </footer>
    </>
  );
}
