'use client';

// Página /productos: lista el catálogo (GET /productos) y permite
// crear/editar/eliminar productos (reservado a usuarios autenticados).

import { useEffect, useState } from 'react';
import { listarProductos } from '../../services/productos.service';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    listarProductos().then(setProductos).catch(console.error);
  }, []);

  return (
    <main>
      <h1>Productos</h1>
      {/* TODO: tabla de productos, formulario de alta/edición, confirmación de borrado */}
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>{producto.nombre}</li>
        ))}
      </ul>
    </main>
  );
}
