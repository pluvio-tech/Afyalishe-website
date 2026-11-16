/**
 * Health & Security Status Endpoint
 * GET /api/health
 */

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Afyalishe Wellness Edge API',
    security: {
      cspEnforced: true,
      hstsEnforced: true,
      antiClickjacking: true,
      antiPhishing: true,
      edgeIsolation: 'Cloudflare V8 Sandbox'
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
