'use client';

// Estado global de sesión: usuario autenticado + token JWT.
// Persiste el token en localStorage para no perder la sesión al recargar.
// Cualquier página/componente que necesite saber "quién está logueado"
// consume este contexto con el hook useAuth (src/hooks/useAuth.js).

import { createContext, useEffect, useState } from 'react';
import * as authService from '../services/auth.service';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  async function login(email, password) {
    const data = await authService.login({ email, password });
    setToken(data.token);
    setUsuario(data.usuario);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
  }

  function logout() {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
