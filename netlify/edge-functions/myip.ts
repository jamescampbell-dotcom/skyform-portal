// Minimal edge function — /my-ip only, no blocking
// Returns the visitor's IP address. Exists on both production and staging.

export default async function myip(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  return new Response(
    `<!DOCTYPE html><html><head><title>Your IP — Skyform Portal</title>
     <style>
       body{font-family:"Segoe UI",Arial,sans-serif;padding:40px 24px;background:#0d1117;color:#e6edf3;max-width:500px;margin:0 auto;}
       h1{font-size:18px;color:#58a6ff;margin-bottom:4px;}
       .ip{font-size:32px;font-weight:700;color:#3fb950;margin:16px 0;padding:16px;background:#161b22;border:1px solid #30363d;border-radius:8px;word-break:break-all;}
       p{font-size:13px;color:#8b949e;line-height:1.6;margin-top:12px;}
       .note{background:#1f2d1f;border:1px solid rgba(63,185,80,.3);border-radius:8px;padding:12px;margin-top:16px;font-size:12px;color:#3fb950;}
       a{color:#58a6ff;}
     </style></head>
     <body>
       <h1>Skyform Wind Portal</h1>
       <p>Your current IP address is:</p>
       <div class="ip">${ip}</div>
       <p>Send this number to your portal administrator to be added to the staging access list.</p>
       <div class="note">
         ✓ This page is always accessible from both the live portal and staging.<br>
         Live portal: <a href="https://skyform-portal.netlify.app">skyform-portal.netlify.app</a><br>
         Staging: <a href="https://skyform-staging.netlify.app">skyform-staging.netlify.app</a>
       </div>
     </body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export const config = { path: "/my-ip" }
