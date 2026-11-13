'use client';

// Hook de conveniencia para leer AuthContext sin importar useContext
// en cada componente: const { usuario, token, login, logout } = useAuth();

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  return useContext(AuthContext);
}
