// Llamadas al dominio /clientes del backend.

import { apiFetch } from '../lib/fetcher';

export function listarClientes(token) {
  return apiFetch('/clientes', { token });
}

export function obtenerCliente(id, token) {
  return apiFetch(`/clientes/${id}`, { token });
}

export function crearCliente(datos, token) {
  return apiFetch('/clientes', { method: 'POST', body: datos, token });
}

export function actualizarCliente(id, datos, token) {
  return apiFetch(`/clientes/${id}`, { method: 'PUT', body: datos, token });
}

export function eliminarCliente(id, token) {
  return apiFetch(`/clientes/${id}`, { method: 'DELETE', token });
}
