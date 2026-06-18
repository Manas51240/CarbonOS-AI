import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutShell from '@/components/layout/ClientLayoutShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://carbonos-ai-160715832584.us-central1.run.app/'),
  title: 'CarbonOS AI - Sustainable Intelligence Platform',
  description: 'Track, simulate, and optimize your carbon footprint using AI Carbon Twins, context-aware coaching, and receipt scanner insights.',
  keywords: ['sustainability', 'carbon footprint', 'AI carbon twin', 'climate action', 'carbon rewards'],
  authors: [{ name: 'CarbonOS team' }],
  openGraph: {
    title: 'CarbonOS AI - Sustainable Intelligence Platform',
    description: 'Track, simulate, and optimize your carbon footprint using AI Carbon Twins, context-aware coaching, and receipt scanner insights.',
    url: 'https://carbonos-ai-160715832584.us-central1.run.app/',
    siteName: 'CarbonOS AI',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CarbonOS AI Sustainable Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarbonOS AI - Sustainable Intelligence Platform',
    description: 'Track, simulate, and optimize your carbon footprint using AI Carbon Twins, context-aware coaching, and receipt scanner insights.',
    creator: '@CarbonOS_AI',
    site: '@CarbonOS_AI',
    images: ['/og-image.png'],
  },
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
