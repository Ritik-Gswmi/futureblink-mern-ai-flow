const rawBase = import.meta.env.VITE_API_URL || "";
const base = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

export async function apiRequest(path, options) {
  const url = base ? `${base}${path}` : path;
  const res = await fetch(url, options);

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (isJson) {
    try {
      const data = await res.json();
      return { res, data, text: null };
    } catch {
      const text = await res.text();
      return { res, data: null, text };
    }
  }

  const text = await res.text();
  return { res, data: null, text };
}

