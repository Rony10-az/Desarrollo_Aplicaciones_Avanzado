// Única capa que ejecuta SQL para "ventas" y "venta_detalle".
// crear() debería correr dentro de una transacción (pool.connect + BEGIN/COMMIT)
// porque escribe en dos tablas y descuenta stock en productos.

const pool = require('../config/database');

async function obtenerTodas() {
  const { rows } = await pool.query('SELECT * FROM ventas ORDER BY id DESC');
  return rows;
}

async function obtenerPorId(id) {
  const { rows } = await pool.query('SELECT * FROM ventas WHERE id = $1', [id]);
  return rows[0];
}

async function crear({ clienteId, items, vendedorId }) {
  // TODO: envolver en una transacción:
  // 1. INSERT INTO ventas (cliente_id, vendedor_id, total) ...
  // 2. INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario) por cada item
  const { rows } = await pool.query(
    `INSERT INTO ventas (cliente_id, vendedor_id, total)
     VALUES ($1, $2, 0) RETURNING *`,
    [clienteId, vendedorId]
  );
  return { ...rows[0], items };
}

module.exports = { obtenerTodas, obtenerPorId, crear };
