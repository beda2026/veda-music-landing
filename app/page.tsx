import VisitCounter from '@/components/VisitCounter';
import VedaMusicPlayer from '@/components/VedaMusicPlayer';
import CommercialContactForm from '@/components/CommercialContactForm';
import SubscribeForm from '@/components/SubscribeForm';
import ServicesSectionModal from '@/components/ServicesSectionModal';
import Link from 'next/link';
import { interviews, releases, services, topTen } from '@/lib/veda-data';
import { vedaArtists } from '@/lib/veda-artists';
import VedaGsapEffects from '@/components/VedaGsapEffects';
import FeaturedInterviewCard from '@/components/FeaturedInterviewCard';
import LatestVideosSection from '@/components/LatestVideosSection';

const navLinks = ['Inicio', 'Noticias', 'Música', 'Videos', 'Artistas', 'Entrevistas', 'Nosotros', 'Contacto'];
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
const brandPartners: ReadonlyArray<{
  name: string;
  subtext?: string;
  image: string;
  href: string;
  logoClassName: string;
}> = [
  {
    name: 'José Barber Shop & Tattoo',
    image: '/assets/auspicios/jose-barber-shop-tattoo.png',
    href: 'https://www.instagram.com/jose_barbershopandtattoo?igsh=MTYyMHh2bDZ0d2tqdg%3D%3D&utm_source=qr',
    logoClassName: 'scale-[1.45] object-cover object-center',
  },
  {
    name: 'Guerrero Promotions Ent',
    image: '/assets/auspicios/guerrero-promotions-ent.png',
    href: 'https://www.instagram.com/guerreropromotions.ent?igsh=MXMyOGx6M3g4dmgzcg%3D%3D&utm_source=qr',
    logoClassName: 'scale-[1.35] object-cover object-center',
  },
  {
    name: 'Yenco PR',
    image: '/assets/auspicios/yenco-pr.png',
    href: 'https://www.instagram.com/yenco_pr?igsh=dHI3NXl6MWNwdGQ3&utm_source=qr',
    logoClassName: 'scale-[1.25] object-cover object-center',
  },
  {
    name: 'Torneo A.T',
    image: '/assets/auspicios/torneo-at.png',
    href: 'https://www.instagram.com/torneo_a.t?igsh=MTA1cjZoMWxyejg0aw%3D%3D&utm_source=qr',
    logoClassName: 'scale-[1.45] object-cover object-center',
  },
  {
    name: 'Perreo Mania PR',
    subtext: 'Indio Pancho',
    image: '/assets/sponsors/perreo-mania-pr/perreo-mania-pr-logo-800.webp',
    href: 'https://www.instagram.com/perreomaniapr?igsh=MWRyZXF5dHR3bzRscA==',
    logoClassName: 'object-contain object-center',
  },
] as const;

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
      <VedaGsapEffects />
      <header className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-10">
        <section className="ad-box ad-space-labels mb-4 rounded-2xl p-4 sm:p-5 lg:min-h-[132px] lg:px-6">
          <div className="flex items-center justify-center overflow-hidden rounded-xl border border-zinc-600/70 bg-black/45 backdrop-blur-md p-2 sm:p-3">
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
              <a key={link} href={link === 'Inicio' ? '#' : link === 'Contacto' ? '#contacto-comercial' : link === 'Nosotros' ? '#sobre-nosotros' : link === 'Artistas' ? '/artistas' : `#${link.toLowerCase()}`} className="whitespace-nowrap rounded-full border border-zinc-700 px-3 py-1.5 transition hover:border-[#ef1f2d] hover:text-white">
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
          <article className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:col-span-2 lg:p-7">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/55 via-black/25 to-transparent lg:w-2/3" aria-hidden="true" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
              <div className="z-10 py-2 lg:py-4">
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-zinc-300">V.E.D.A. MUSIC · PUERTO RICO</p>
                <h1 className="hero-title text-zinc-50">
                  LA NUEVA PLATAFORMA <span className="urbana-accent">URBANA</span>
                </h1>
                <p className="mt-4 max-w-xl text-zinc-200">Videos, entrevistas, estrenos, fotos y todo lo que mueve la cultura urbana.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#videos" className="btn-red">Ver lo más nuevo</a>
                  <a href="#entrevistas" className="btn-gold">Explorar artistas</a>
                </div>
                <div className="hero-strip mt-6">
                  <div className="px-[1px] text-xs uppercase tracking-[0.22em] text-zinc-300">
                    <span>EDITORIAL URBANO</span>
                  </div>
                </div>
              </div>

              <div className="relative h-[270px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 shadow-[0_14px_45px_rgba(0,0,0,0.35)] sm:h-[320px] lg:h-[410px]">
                <img
                  src="/assets/veda-music-hero-reggaeton-classics.png"
                  alt="Collage editorial de VEDA Music"
                  className="h-full w-full object-cover object-[68%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" aria-hidden="true" />

                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-100 backdrop-blur-md">
                  CULTURA URBANA
                </div>

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {['Música', 'Videos', 'Entrevistas'].map((chip) => (
                    <span key={chip} className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-200 backdrop-blur-md">
                      {chip}
                    </span>
                  ))}
                </div>

                <p className="absolute bottom-4 right-4 text-[11px] uppercase tracking-[0.12em] text-zinc-200/90">
                  Estrenos · entrevistas · artistas · movimiento
                </p>
              </div>
            </div>
          </article>

          <FeaturedInterviewCard />

          <aside className="ad-box ad-space-labels flex min-h-[280px] flex-col items-center justify-center rounded-3xl p-4 text-center lg:h-[300px] lg:min-h-[300px]">
            <div
              className="relative block h-[250px] w-full max-w-[336px] overflow-hidden rounded-2xl border border-zinc-600/80 bg-black/40 backdrop-blur-md"
              aria-label="Dímelo Kombete sponsor banner"
            >
              <img
                src="/assets/dimelo-kombete-ad-336x280.png"
                alt="Dímelo Kombete sponsor banner"
                className="h-full w-full object-cover"
              />
            </div>
          </aside>
        </section>

        <VedaMusicPlayer />

        <LatestVideosSection />

        <section id="artistas-destacados" className="space-y-4">
          <h2 className="section-title">Artistas Destacados</h2>
          <p className="text-sm text-zinc-300">Perfiles editoriales, trayectoria musical y figuras clave del movimiento urbano.</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {vedaArtists.map((artist) => (
              <article key={artist.slug} className="panel hover-card rounded-2xl p-4 media-card">
                <div className="mb-3 h-36 overflow-hidden rounded-xl border border-zinc-700 bg-gradient-to-br from-black/45 via-red-950/15 to-yellow-950/10 backdrop-blur-md">
                  {artist.image ? (
                    <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-end p-3">
                      <span className="rounded-full border border-[#f5b21b]/60 bg-black/40 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#f5b21b]">V.E.D.A. ARTIST</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-zinc-100">{artist.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400">{artist.country} · {artist.category}</p>
                <p className="mt-2 text-sm text-zinc-300">{artist.shortBio}</p>
                <Link href={`/artistas/${artist.slug}`} className="mt-3 inline-block rounded-full border border-[#ef1f2d]/60 px-3.5 py-1.5 text-sm font-semibold text-zinc-100 transition hover:border-[#f5b21b]">Ver perfil</Link>
              </article>
            ))}
          </div>
        </section>

        <section id="entrevistas" className="space-y-4">
          <h2 className="section-title">Entrevistas / Exclusivas</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {interviews.map((item, idx) => (
              <article key={item.title} className="panel hover-card rounded-2xl p-4 interview-card" data-idx={idx}>
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
                <article key={release} className="hover-card rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-3 before:mr-2 before:text-[#f5b21b] before:content-['●']">
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
            <aside className="ad-box ad-space-labels flex min-h-[250px] flex-col items-center justify-center rounded-2xl p-3">
              <div
                className="relative block h-[250px] w-full max-w-[336px] overflow-hidden rounded-2xl border border-zinc-600/80 bg-black/40 backdrop-blur-md"
                aria-label="MGF Enterprises Services LLC sponsor banner"
              >
                <img
                  src="/assets/mgf-vip-ad-336x280.png"
                  alt="MGF Enterprises VIP sponsor banner"
                  className="h-full w-full object-cover"
                />
              </div>
            </aside>
          </div>
        </section>

        <ServicesSectionModal services={services} />

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
                <div key={pack} className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md px-4 py-3 text-sm text-zinc-200">
                  {pack}
                  <span className="mt-1 block text-xs uppercase tracking-wide text-zinc-400">Cotización por solicitud</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SubscribeForm />

        <section className="ad-box rounded-3xl border border-[#f5b21b]/25 bg-gradient-to-br from-black/45 via-red-950/15 to-yellow-950/10 backdrop-blur-lg p-6 md:p-7">
          <div className="text-center">
            <h2 className="section-title">Auspicios &amp; Publicidad</h2>
            <p className="mt-2 text-sm text-zinc-300 md:text-base">
              Marcas, negocios y eventos que conectan con la cultura urbana a través de V.E.D.A. Music.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {brandPartners.map((partner) => (
              <article
                key={partner.name}
                className="group rounded-2xl border border-zinc-700/80 bg-black/40 p-4 shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#f5b21b]/55 hover:shadow-[0_12px_30px_rgba(245,178,27,0.12)]"
              >
                <div className="relative h-[190px] overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <img
                    src={partner.image}
                    alt={`${partner.name} logo`}
                    className={`h-full w-full ${partner.logoClassName}`}
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 text-base font-semibold text-zinc-100">{partner.name}</h3>
                {partner.subtext ? <p className="mt-1 text-sm text-zinc-400">{partner.subtext}</p> : null}
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-full border border-[#f5b21b]/45 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#f5b21b] transition hover:border-[#f5b21b] hover:bg-[#f5b21b14]"
                >
                  Ver Instagram
                </a>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#f5b21b]/35 bg-black/40 p-5 text-center shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <p className="text-lg font-semibold text-zinc-100">¿Quieres promocionar tu marca aquí?</p>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-300">Solicita un espacio publicitario para tu negocio, evento, lanzamiento o proyecto.</p>
            <a href="#contacto-comercial?tipo=espacio-publicitario" className="btn-gold mt-4 inline-flex">Solicitar publicidad</a>
          </div>
        </section>
      </main>
      <footer className="border-t border-zinc-800 bg-black/45 backdrop-blur-sm">
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
