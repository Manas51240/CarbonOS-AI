import { NextRequest } from 'next/server';

/**
 * Validates that the incoming request is authorized by verifying that
 * the request origin/referrer matches our host or a list of trusted origins.
 * Development origins (localhost) are restricted in production mode.
 */
export function isAuthorizedRequest(req: NextRequest): boolean {
  const origin = req.headers.get('origin') || '';
  const host = req.headers.get('host') || '';
  const referer = req.headers.get('referer') || '';
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || (host ? `${proto}://${host}` : '');
  
  // Fallback: If origin is omitted, use referer origin
  const resolvedOrigin = origin || (referer ? new URL(referer).origin : '');
  if (!resolvedOrigin) {
    return false;
  }
  
  // Check if resolved origin matches host target
  const isMatchHost = host && (resolvedOrigin === `http://${host}` || resolvedOrigin === `https://${host}`);
  
  // Whitelist target origins. Exclude local dev sandboxes in production.
  const allowed = [appOrigin];
  if (process.env.NODE_ENV !== 'production') {
    allowed.push('http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002');
  }
  
  const isAllowed = allowed.some((o) => o && resolvedOrigin.startsWith(o));
  
  return isMatchHost || isAllowed;
}
