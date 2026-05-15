import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'V.E.D.A. MUSIC',
  description: 'Videos · Entrevistas · Descubrimiento · Artistas',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
