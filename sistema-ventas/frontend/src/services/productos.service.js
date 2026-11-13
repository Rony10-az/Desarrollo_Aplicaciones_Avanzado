// Llamadas al dominio /productos del backend. Espeja uno a uno las rutas
// de backend/src/routes/productos.routes.js.

import { apiFetch } from '../lib/fetcher';

export function listarProductos() {
  return apiFetch('/productos');
}

export function obtenerProducto(id) {
  return apiFetch(`/productos/${id}`);
}

export function crearProducto(datos, token) {
  return apiFetch('/productos', { method: 'POST', body: datos, token });
}

export function actualizarProducto(id, datos, token) {
  return apiFetch(`/productos/${id}`, { method: 'PUT', body: datos, token });
}

export function eliminarProducto(id, token) {
  return apiFetch(`/productos/${id}`, { method: 'DELETE', token });
}
