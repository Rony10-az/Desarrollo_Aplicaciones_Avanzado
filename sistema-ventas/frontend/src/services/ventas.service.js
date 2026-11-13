// Llamadas al dominio /ventas del backend.

import { apiFetch } from '../lib/fetcher';

export function listarVentas(token) {
  return apiFetch('/ventas', { token });
}

export function obtenerVenta(id, token) {
  return apiFetch(`/ventas/${id}`, { token });
}

export function crearVenta(datos, token) {
  return apiFetch('/ventas', { method: 'POST', body: datos, token });
}
