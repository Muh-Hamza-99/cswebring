export default async (req) => {
    const ALLOWED_ORIGIN = "https://cswebring.netlify.app";

    const origin = req.headers.get("origin") || "";
  
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      if (origin === ALLOWED_ORIGIN) {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }
      return new Response("Forbidden", { status: 403 });
    }
  
    // Enforce origin
    if (origin && origin !== ALLOWED_ORIGIN) {
      return new Response("Forbidden", { status: 403 });
    }
  
    // Put your Apps Script Web App URL here:
    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
  
    if (!APPS_SCRIPT_URL) {
      return new Response("Missing APPS_SCRIPT_URL env var", { status: 500 });
    }
  
    const upstream = await fetch(APPS_SCRIPT_URL);
    const text = await upstream.text();
  
    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Cache-Control": "public, max-age=60",
        "Netlify-CDN-Cache-Control": "public, max-age=60",
      },
    });
  };
  