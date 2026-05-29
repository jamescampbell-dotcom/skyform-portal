// IP Allowlist Gate — staging environment only

const ALLOWED_IPS: string[] = [
  "90.219.148.78",                          // Administrator — IPv4
  "2a00:23ee:1728:3112:48:b90d:ae98:6b2b",  // Administrator — IPv6 (original)
  "2a06:5902:4822:7100:c0fe:8007:8f4f:8e38", // Administrator — IPv6 (updated 29 May 2026)
]

export default async function gate(request: Request) {
  const url = new URL(request.url)

  if (url.pathname === '/my-ip') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown'
    return new Response(
      `<!DOCTYPE html><html><head><title>Your IP — Skyform Portal</title>
       <style>body{font-family:"Segoe UI",Arial,sans-serif;padding:40px 24px;background:#0d1117;color:#e6edf3;max-width:500px;margin:0 auto;}
       h1{font-size:18px;color:#58a6ff;margin-bottom:4px;}
       .ip{font-size:32px;font-weight:700;color:#3fb950;margin:16px 0;padding:16px;background:#161b22;border:1px solid #30363d;border-radius:8px;word-break:break-all;}
       p{font-size:13px;color:#8b949e;line-height:1.5;margin-top:16px;}
       .note{background:#1f2d1f;border:1px solid rgba(63,185,80,.3);border-radius:8px;padding:12px;margin-top:16px;font-size:12px;color:#3fb950;}</style></head>
       <body><h1>Skyform Wind — Staging Portal</h1><p>Your current IP address is:</p>
       <div class="ip">${ip}</div>
       <p>Send this number to your portal administrator to be added to the access list.</p>
       <div class="note">✓ This page is always accessible regardless of your IP address.</div>
       </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  const visitorIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? ''

  if (!ALLOWED_IPS.includes(visitorIp)) {
    return new Response(
      `<!DOCTYPE html><html><head><title>Access Restricted — Skyform Portal</title>
       <style>body{font-family:"Segoe UI",Arial,sans-serif;padding:40px 24px;background:#0d1117;color:#e6edf3;max-width:500px;margin:0 auto;text-align:center;}
       h1{font-size:20px;color:#f85149;margin-bottom:8px;}p{font-size:13px;color:#8b949e;line-height:1.6;}
       .ip-box{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:14px;margin:20px 0;}
       .ip-val{font-size:20px;font-weight:700;color:#d29922;word-break:break-all;}
       a{color:#58a6ff;}a:hover{text-decoration:underline;}
       .note{background:#2d1f1f;border:1px solid rgba(248,81,73,.3);border-radius:8px;padding:12px;margin-top:16px;font-size:12px;color:#f85149;}</style></head>
       <body><h1>⚠ Access Restricted</h1>
       <p>This staging environment is restricted to authorised IP addresses only.</p>
       <p>Your current IP address is not on the access list:</p>
       <div class="ip-box"><div class="ip-val">${visitorIp || 'Unknown'}</div></div>
       <p>To request access, send the IP address shown above to <strong>Administrator</strong>.</p>
       <div class="note">If your IP has recently changed, visit <a href="/my-ip">/my-ip</a> to confirm your current address and send it to your administrator.</div>
       </body></html>`,
      { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  return
}

export const config = { path: "/*" }
