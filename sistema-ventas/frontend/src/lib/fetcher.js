// Wrapper único de fetch hacia el backend: arma la URL base, agrega el
// header Authorization si hay token, y lanza error si la respuesta no es ok.
// Todos los archivos en src/services/ usan esto en vez de fetch directo.

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Error en la petición');
  }

  if (res.status === 204) return null;
  return res.json();
}
