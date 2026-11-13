'use client';

// Página /productos/:id (ruta dinámica): detalle y edición de un producto.
// `params.id` lo entrega Next.js automáticamente según el nombre de la carpeta.

import { useEffect, useState } from 'react';
import { obtenerProducto } from '../../../services/productos.service';

export default function ProductoDetallePage({ params }) {
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    obtenerProducto(params.id).then(setProducto).catch(console.error);
  }, [params.id]);

  return (
    <main>
      <h1>Detalle de producto</h1>
      {/* TODO: formulario de edición pre-rellenado con `producto` */}
    </main>
  );
}
