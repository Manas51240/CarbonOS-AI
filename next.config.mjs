/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable X-Powered-By header to prevent framework fingerprinting
  poweredByHeader: false,

  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://*.run.app https://*.googleapis.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      style-src-attr 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://*.run.app https://*.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://*.run.app https://*.googleapis.com https://*.firebaseio.com;
      frame-src 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        // Security headers on all routes
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
      {
        // Prevent CDN caching of authenticated/dynamic dashboard routes
        source: '/(|twin|coach|receipts|travel|digital|community|marketplace|alerts)',
        headers: [
          { key: 'Cache-Control', value: 'private, no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
