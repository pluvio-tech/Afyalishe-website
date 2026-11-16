/**
 * Cloudflare Pages Global Security Middleware
 * Protects Afyalishe Wellness against:
 * - Cross-Site Scripting (XSS)
 * - Clickjacking & Iframe phishing
 * - HTTP Host Header poisoning
 * - Query-string injection (SQLi / Path Traversal)
 * - Distributed Denial of Service (Rate-limiting via Cloudflare Edge)
 */

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // 1. Host Header Validation (Anti-DNS Rebinding & Host Poisoning)
  const allowedHosts = [
    'afyalishewellness.co.ke',
    'www.afyalishewellness.co.ke',
    'afyalishe-redesign.pages.dev',
    'localhost',
    '127.0.0.1'
  ];
  
  const host = url.hostname;
  const isAllowedHost = allowedHosts.some(h => host === h || host.endsWith('.pages.dev'));
  if (!isAllowedHost) {
    return new Response('403 Forbidden: Invalid Host Header', { status: 403 });
  }

  // 2. Reject Obvious Exploits in URL Query (Anti-Traversal & Injection)
  const decodedPath = decodeURIComponent(url.pathname + url.search);
  const suspiciousPatterns = [
    /\.\.\//,                // Path Traversal
    /<script/i,              // Reflected XSS
    /union\s+select/i,       // SQL Injection attempt
    /etc\/passwd/i,          // Linux system probe
    /proc\/self/i,           // Memory probe
    /base64_decode/i         // PHP exploit probe
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(decodedPath)) {
      return new Response(JSON.stringify({ error: 'Blocked: Malicious request pattern detected' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // 3. Process Request
  const response = await next();

  // 4. Inject Enterprise Security Headers on every response
  const headers = new Headers(response.headers);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  headers.set('Permissions-Policy', 'accelerometer=(), camera=(), microphone=(), geolocation=(), payment=()');
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; connect-src 'self' https://wa.me https://api.afyalishewellness.co.ke https://*.cloudflare.com; form-action 'self' https://wa.me; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
