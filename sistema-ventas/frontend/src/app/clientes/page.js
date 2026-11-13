'use client';

// Página /clientes: lista y gestiona clientes (requiere sesión).

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { listarClientes } from '../../services/clientes.service';

export default function ClientesPage() {
  const { token } = useAuth();
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!token) return;
    listarClientes(token).then(setClientes).catch(console.error);
  }, [token]);

  return (
    <main>
      <h1>Clientes</h1>
      {/* TODO: tabla de clientes, formulario de alta/edición */}
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>{cliente.nombre}</li>
        ))}
      </ul>
    </main>
  );
}
