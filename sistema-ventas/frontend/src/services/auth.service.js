// Llamadas al dominio /auth del backend. No guarda el token aquí;
// quien llama (AuthContext) decide dónde persistirlo.

import { apiFetch } from '../lib/fetcher';

export function login({ email, password }) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } });
}

export function register({ nombre, email, password }) {
  return apiFetch('/auth/register', { method: 'POST', body: { nombre, email, password } });
}
