import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutShell from '@/components/layout/ClientLayoutShell';

export const metadata: Metadata = {
  title: 'CarbonOS AI - Sustainable Intelligence Platform',
  description: 'Track, simulate, and optimize your carbon footprint using AI Carbon Twins, context-aware coaching, and receipt scanner insights.',
  keywords: ['sustainability', 'carbon footprint', 'AI carbon twin', 'climate action', 'carbon rewards'],
  authors: [{ name: 'CarbonOS team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased">
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </body>
    </html>
  );
}
