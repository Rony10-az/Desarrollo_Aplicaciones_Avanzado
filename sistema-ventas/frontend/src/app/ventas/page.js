'use client';

// Página /ventas: registrar una nueva venta (elegir cliente + productos)
// y listar el historial de ventas (requiere sesión).

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { listarVentas } from '../../services/ventas.service';

export default function VentasPage() {
  const { token } = useAuth();
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    if (!token) return;
    listarVentas(token).then(setVentas).catch(console.error);
  }, [token]);

  return (
    <main>
      <h1>Ventas</h1>
      {/* TODO: formulario de nueva venta (cliente + items de producto), tabla de historial */}
      <ul>
        {ventas.map((venta) => (
          <li key={venta.id}>Venta #{venta.id} — Total: {venta.total}</li>
        ))}
      </ul>
    </main>
  );
}
