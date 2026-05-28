// IP Allowlist Gate — staging environment only
// Both IPv4 and IPv6 addresses added for the same connection

const ALLOWED_IPS: string[] = [
  "90.219.148.78",                          // James Campbell — IPv4
  "2a00:23ee:1728:3112:48:b90d:ae98:6b2b",  // James Campbell — IPv6
]

export default async function gate(request: Request) {
  const url = new URL(request.url)

  // /my-ip — always accessible, shows current IP
  if (url.pathname === '/my-ip') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown'
    return new Response(
      `<!DOCTYPE html><html><head><title>Your IP</title>
       <style>body{font-family:sans-serif;padding:40px;background:#0d1117;color:#e6edf3;}
       .ip{font-size:28px;font-weight:700;color:#3fb950;margin:20px 0;word-break:break-all;}</style></head>
       <body><p>Your current IP address is:</p>
       <div class="ip">${ip}</div>
       <p style="color:#8b949e;font-size:14px;">Send this to your administrator to get access.</p>
       </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Get visitor IP
  const visitorIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? ''

  if (!ALLOWED_IPS.includes(visitorIp)) {
    return new Response(
      '<!DOCTYPE html><html><head><title> </title></head><body style="background:#000;"></body></html>',
      { status: 403, headers: { 'Content-Type': 'text/html' } }
    )
  }

  return
}

export const config = { path: "/*" }
