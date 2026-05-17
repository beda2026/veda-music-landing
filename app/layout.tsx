import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'V.E.D.A. MUSIC',
  description: 'Videos · Entrevistas · Descubrimiento · Artistas',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <div className="site-bg" aria-hidden="true">
          <div className="site-bg__overlay site-bg__overlay--base" />
          <div className="site-bg__overlay site-bg__overlay--tint" />
          <div className="site-bg__overlay site-bg__overlay--glow" />
        </div>
        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}
