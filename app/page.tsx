import VisitCounter from '@/components/VisitCounter';
import VedaMusicPlayer from '@/components/VedaMusicPlayer';
import CommercialContactForm from '@/components/CommercialContactForm';
import SubscribeForm from '@/components/SubscribeForm';
import { interviews, photos, releases, services, topTen, videos } from '@/lib/veda-data';

const navLinks = ['Inicio', 'Noticias', 'Música', 'Videos', 'Fotos', 'Entrevistas', 'Nosotros', 'Contacto'];
const socialLinks = [
  { name: 'Spotify', icon: 'spotify' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'SoundCloud', icon: 'soundcloud' },
] as const;
const promoCards = [
  {
    badge: 'ARTISTAS',
    title: 'Anúnciate',
    text: 'Coloca tu marca, evento o negocio en espacios visibles dentro de V.E.D.A. MUSIC.',
    items: ['Top Banner', 'Sponsored Banner', 'Brand Partner'],
    cta: 'Quiero anunciarme',
    href: '#contacto-comercial?tipo=espacio-publicitario',
  },
  {
    badge: 'NEGOCIOS',
    title: 'Envía tu música',
    text: 'Comparte tu canción, video o estreno para evaluación editorial.',
    items: ['Video oficial', 'Estreno musical', 'Artista emergente'],
    cta: 'Enviar música',
    href: '#contacto-comercial?tipo=enviar-musica',
  },
  {
    badge: 'SPONSORS',
    title: 'Reserva entrevista',
    text: 'Coordina entrevistas, cobertura o contenido especial para tu proyecto.',
    items: ['Entrevista', 'Cobertura de evento', 'Studio / contenido'],
    cta: 'Reservar entrevista',
    href: '#contacto-comercial?tipo=entrevista-cobertura',
  },
] as const;
const promoPackages = ['Publicación básica', 'Video destacado', 'Banner semanal', 'Banner mensual', 'Sponsor oficial', 'Entrevista / cobertura'];

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]['icon'] }) {
  if (icon === 'youtube') return <><rect x="5.5" y="7.5" width="13" height="9" rx="2.5" /><path d="m11 10 4 2-4 2v-4Z" fill="currentColor" stroke="none" /></>;
  if (icon === 'soundcloud') return <path d="M8.8 15.7h8.4a2.8 2.8 0 0 0 .3-5.6 4.1 4.1 0 0 0-7.9 1.1 2.3 2.3 0 0 0-.8-.1c-1.3 0-2.4 1-2.4 2.3 0 1.3 1 2.3 2.4 2.3Z" />;
  return <path d="M12 6.3a5.7 5.7 0 1 0 0 11.4 5.7 5.7 0 0 0 0-11.4Zm2.6 8.2a3.6 3.6 0 0 1-4.9 1.2A3.5 3.5 0 0 1 8 10.9a3.6 3.6 0 0 1 6.5-.7h1.7c-.4-2.6-2.6-4.6-5.2-4.6A5.4 5.4 0 0 0 12 16.4c2.6 0 4.8-2 5.2-4.6h-2.6Z" />;
}

function SocialButtons() {
  return (
    <div className="hide-scrollbar social-clean flex items-center gap-2 overflow-x-auto text-zinc-200">
      <span className="shrink-0 text-xs">PLATAFORMAS:</span>
      {socialLinks.map((item) => (
        <span key={item.name} aria-label={item.name} className="social-icon-btn opacity-70" role="img">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <SocialIcon icon={item.icon} />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-10">
        <section className="ad-box mb-4 rounded-2xl p-4 sm:p-5 lg:min-h-[132px] lg:px-6">
          <div className="flex items-center justify-center overflow-hidden rounded-xl border border-zinc-600/70 bg-[#0b0b0b]/90 p-2 sm:p-3">
            <img
              src="/assets/mgf-vip-ad-728x90.png"
              alt="MGF Enterprises VIP sponsor leaderboard banner"
              className="h-auto w-full max-w-[728px] object-contain"
            />
          </div>
        </section>

        <div className="panel mb-4 flex flex-col gap-3 rounded-2xl p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-[#ef1f2d] px-3 py-1 font-semibold text-white">TRENDING</span>
            <p className="text-zinc-300">Eladio Carrión llevó CORSA al Coliseo de Puerto Rico · LIT Killah ft. Paulo Londra, Khea y Ramma – Si Te Vas 2.0 · Kris R – Lindos Recuerdos</p>
          </div>
          <SocialButtons />
        </div>

        <div className="panel flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-3xl font-black leading-none text-zinc-50">V.E.D.A.</p>
            <p className="text-xl font-bold tracking-[0.3em] text-[#f5b21b]">MUSIC</p>
            <p className="mt-1 text-xs uppercase text-zinc-400">Videos · Entrevistas · Descubrimiento · Artistas</p>
          </div>
          <nav className="hide-scrollbar -mx-2 flex gap-3 overflow-x-auto px-2 text-sm font-medium text-zinc-200 lg:flex-wrap lg:overflow-visible">
            {navLinks.map((link) => (
              <a key={link} href={link === 'Inicio' ? '#' : link === 'Contacto' ? '#contacto-comercial' : link === 'Nosotros' ? '#sobre-nosotros' : `#${link.toLowerCase()}`} className="whitespace-nowrap rounded-full border border-zinc-700 px-3 py-1.5 transition hover:border-[#ef1f2d] hover:text-white">
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
        <section className="grid gap-4 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:items-stretch">
          <article className="hero-panel rounded-3xl p-6 lg:col-span-2 lg:p-10">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-zinc-300">V.E.D.A. MUSIC · PUERTO RICO</p>
            <h1 className="hero-title text-zinc-50">
              LA NUEVA PLATAFORMA <span className="urbana-accent">URBANA</span>
            </h1>
            <p className="mt-4 max-w-xl text-zinc-200">Videos, entrevistas, estrenos, fotos y todo lo que mueve la cultura urbana.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#videos" className="btn-red">Ver lo más nuevo</a>
              <a href="#entrevistas" className="btn-gold">Explorar artistas</a>
            </div>
            <div className="hero-strip mt-8">
              <div className="px-[1px] text-xs uppercase tracking-[0.22em] text-zinc-300">
                <span>EDITORIAL URBANO</span>
              </div>
            </div>
          </article>

          <article className="panel hover-card featured-card rounded-3xl p-4 lg:col-span-1 lg:max-h-[300px] lg:p-5">
            <span className="inline-block rounded-full border border-[#f5b21b] bg-[#f5b21b1a] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f5b21b]">ENTREVISTA · ESTRENO</span>
            <div className="featured-visual my-3 relative flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-zinc-700 lg:h-28">
              <img
                src="/assets/dimelo-kombete-ad-336x280.png"
                alt="Dímelo Kombete entrevista con Duran The Coach"
                className="h-full w-full object-cover"
              />
              <span className="featured-play">▶</span>
            </div>
            <h2 className="text-xl font-bold leading-snug text-zinc-100">Duran The Coach en Dímelo Kombete</h2>
            <p className="mt-1.5 text-sm text-zinc-300">La nueva entrevista de Dímelo Kombete con Duran The Coach ya está disponible.</p>
            <a
              href="https://www.youtube.com/watch?v=0BgXZz-TXy4"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-full border border-zinc-600 px-3.5 py-1.5 text-sm font-semibold text-zinc-200 transition hover:border-[#ef1f2d]"
            >
              Ver entrevista
            </a>
          </article>

          <aside className="ad-box flex min-h-[280px] flex-col items-center justify-center rounded-3xl p-4 text-center lg:h-[300px] lg:min-h-[300px]">
            <a
              href="https://www.youtube.com/@DimeloKombete"
              target="_blank"
              rel="noreferrer"
              className="group relative block h-[250px] w-full max-w-[336px] overflow-hidden rounded-2xl border border-zinc-600/80 bg-[#111111]/70"
              aria-label="Dímelo Kombete sponsor banner"
            >
              <img
                src="/assets/dimelo-kombete-ad-336x280.png"
                alt="Dímelo Kombete sponsor banner"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
              />
              <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-zinc-500/70 bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-200">
                SPONSORED
              </span>
            </a>
          </aside>
        </section>

        <VedaMusicPlayer />

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
          <a href="#contacto-comercial" className="btn-gold">Más información</a>
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
            <aside className="ad-box flex min-h-[250px] flex-col items-center justify-center rounded-2xl p-3">
              <a
                href="https://www.instagram.com/mgfesllc_fl/"
                target="_blank"
                rel="noreferrer"
                className="group relative block h-[250px] w-full max-w-[336px] overflow-hidden rounded-2xl border border-zinc-600/80 bg-[#111111]/70"
                aria-label="MGF Enterprises Services LLC sponsor banner"
              >
                <img
                  src="/assets/mgf-vip-ad-336x280.png"
                  alt="MGF Enterprises VIP sponsor banner"
                  className="h-full w-full object-cover"
                />
              </a>
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
            <a href="#contacto-comercial" className="btn-red">Contáctanos</a>
          </div>
        </section>

        <section id="sobre-nosotros" className="space-y-5">
          <div className="panel rounded-2xl p-6">
            <h2 className="section-title">Sobre V.E.D.A. MUSIC</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              <p>V.E.D.A. MUSIC es una plataforma digital enfocada en música, cultura urbana, entrevistas, estrenos y descubrimiento de talento. Nacemos para conectar artistas, creadores, marcas y público en un espacio visual, moderno y directo.</p>
              <p>Nuestro enfoque combina contenido editorial, promoción musical, espacios publicitarios y cobertura urbana para darle visibilidad a proyectos que forman parte del movimiento latino y caribeño.</p>
              <p>Más que una página de música, V.E.D.A. MUSIC funciona como un punto de encuentro para artistas emergentes, marcas locales, eventos, entrevistas y contenido que representa la calle, la cultura y la evolución del sonido urbano.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="panel hover-card rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-zinc-100">Música &amp; Estrenos</h3>
              <p className="mt-2 text-sm text-zinc-300">Espacio para destacar canciones, videos, playlists y nuevos lanzamientos.</p>
            </article>
            <article className="panel hover-card rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-zinc-100">Cultura Urbana</h3>
              <p className="mt-2 text-sm text-zinc-300">Cobertura visual y editorial de movimientos, artistas, eventos y comunidades.</p>
            </article>
            <article className="panel hover-card rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-zinc-100">Publicidad &amp; Alianzas</h3>
              <p className="mt-2 text-sm text-zinc-300">Opciones para marcas, negocios y proyectos que buscan visibilidad dentro del público urbano.</p>
            </article>
          </div>
        </section>

        <section id="contacto-comercial" className="space-y-4">
          <div>
            <h2 className="section-title">Contacto Comercial</h2>
            <p className="mt-2 max-w-3xl text-zinc-300">Cuéntanos qué quieres promocionar, enviar o coordinar. Nuestro equipo revisa cada solicitud y responde por email.</p>
          </div>
          <CommercialContactForm />
        </section>

        <section className="space-y-5 pt-3 md:pt-5">
          <div>
            <h2 className="section-title">Promociona tu movimiento</h2>
            <p className="mt-2 max-w-3xl text-zinc-300">Espacios para artistas, marcas, eventos, estudios y negocios que quieren conectar con la cultura urbana.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {promoCards.map((card) => (
              <article key={card.title} className="promo-card hover-card rounded-2xl p-5">
                <span className="promo-badge">{card.badge}</span>
                <h3 className="mt-4 text-2xl font-bold text-zinc-100">{card.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{card.text}</p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                  {card.items.map((item) => (
                    <li key={item} className="before:mr-2 before:text-[#f5b21b] before:content-['•']">{item}</li>
                  ))}
                </ul>
                <a href={card.href} className="btn-red mt-5 w-full">{card.cta}</a>
              </article>
            ))}
          </div>
          <div className="promo-packages rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-zinc-100">Espacios disponibles</h3>
              <span className="rounded-full border border-zinc-600 px-3 py-1 text-xs uppercase tracking-wide text-zinc-300">Cotización por solicitud</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {promoPackages.map((pack) => (
                <div key={pack} className="rounded-xl border border-zinc-700 bg-[#121212] px-4 py-3 text-sm text-zinc-200">
                  {pack}
                  <span className="mt-1 block text-xs uppercase tracking-wide text-zinc-400">Cotización por solicitud</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SubscribeForm />

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
            <div className="mt-3"><VisitCounter /></div>
          </div>
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
        <p className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">© 2026 V.E.D.A. MUSIC. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
