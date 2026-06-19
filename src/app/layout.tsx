import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutShell from '@/components/layout/ClientLayoutShell';
import { cookies } from 'next/headers';

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
  // maximumScale intentionally omitted to allow browser pinch-to-zoom (WCAG 2.2 AA)
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has('carbonos_user_session');

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const ENCRYPTION_KEY = 'carbonos_secure_key_2026';
                function encrypt(text) {
                  if (!text) return '';
                  const encoder = new TextEncoder();
                  const bytes = encoder.encode(text);
                  const keyBytes = encoder.encode(ENCRYPTION_KEY);
                  const resultBytes = new Uint8Array(bytes.length);
                  for (let i = 0; i < bytes.length; i++) {
                    resultBytes[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
                  }
                  let binaryString = '';
                  for (let i = 0; i < resultBytes.length; i++) {
                    binaryString += String.fromCharCode(resultBytes[i]);
                  }
                  return btoa(binaryString);
                }
                function decrypt(cipherText) {
                  if (!cipherText) return '';
                  try {
                    const binaryString = atob(cipherText);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                      bytes[i] = binaryString.charCodeAt(i);
                    }
                    const encoder = new TextEncoder();
                    const keyBytes = encoder.encode(ENCRYPTION_KEY);
                    const resultBytes = new Uint8Array(bytes.length);
                    for (let i = 0; i < bytes.length; i++) {
                      resultBytes[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
                    }
                    const decoder = new TextDecoder();
                    return decoder.decode(resultBytes);
                  } catch (e) {
                    return '';
                  }
                }

                if (typeof window !== 'undefined' && !window.__carbonosStorageOverridden) {
                  window.__carbonosStorageOverridden = true;
                  const originalGetItem = Storage.prototype.getItem;
                  const originalSetItem = Storage.prototype.setItem;

                  Storage.prototype.getItem = function (key) {
                    const value = originalGetItem.call(this, key);
                    if (!value) return null;
                    if (key.startsWith('carbonos_')) {
                      const trimmed = value.trim();
                      if (
                        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                        (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
                        (trimmed.startsWith('"') && trimmed.endsWith('"'))
                      ) {
                        return value;
                      }
                      try {
                        const decrypted = decrypt(value);
                        return decrypted || value;
                      } catch {
                        return value;
                      }
                    }
                    return value;
                  };

                  Storage.prototype.setItem = function (key, value) {
                    if (key.startsWith('carbonos_')) {
                      const trimmed = value.trim();
                      const isPlaintext = (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                                          (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
                                          (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
                                          (!trimmed.includes('"') && trimmed.length < 20);
                      if (isPlaintext) {
                        const encrypted = encrypt(value);
                        originalSetItem.call(this, key, encrypted);
                        return;
                      }
                    }
                    originalSetItem.call(this, key, value);
                  };
                }
              })();
            `
          }}
        />
      </head>
      <body className="antialiased">
        <ClientLayoutShell isAuthenticated={hasSession}>{children}</ClientLayoutShell>
      </body>
    </html>
  );
}
