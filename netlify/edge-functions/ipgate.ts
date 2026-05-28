// IP Allowlist Gate — blocks all access except listed IPs
// Update ALLOWED_IPS to add/remove access

const ALLOWED_IPS: string[] = [
  // Add IPs here — one per line
  // "86.123.45.67",  // James - home
  // "82.xxx.xxx.xxx", // James - office
  "PLACEHOLDER"  // will be replaced
]

export default async function gate(request: Request) {
  const url = new URL(request.url)

  // /my-ip — always allowed, shows your current IP (useful for adding new locations)
  if (url.pathname === '/my-ip') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown'
    return new Response(
      `<!DOCTYPE html><html><head><title>Your IP</title>
       <style>body{font-family:sans-serif;padding:40px;background:#0d1117;color:#e6edf3;}
       .ip{font-size:32px;font-weight:700;color:#3fb950;margin:20px 0;}</style></head>
       <body><p>Your current IP address is:</p>
       <div class="ip">${ip}</div>
       <p style="color:#8b949e;font-size:14px;">Send this to your administrator to get access to the staging site.</p>
       </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Get visitor IP
  const visitorIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? ''

  // Check allowlist
  const allowed = ALLOWED_IPS.some(ip => ip !== 'PLACEHOLDER' && visitorIp.startsWith(ip))

  if (!allowed) {
    return new Response(
      '<!DOCTYPE html><html><head><title>Access Restricted</title></head><body style="background:#0d1117;"></body></html>',
      { status: 403, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Allowed — continue to site
  return
}

export const config = { path: "/*" }
