// Única capa que ejecuta SQL para la tabla "productos".

const pool = require('../config/database');

async function obtenerTodos() {
  const { rows } = await pool.query('SELECT * FROM productos ORDER BY id');
  return rows;
}

async function obtenerPorId(id) {
  const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
  return rows[0];
}

async function crear({ nombre, descripcion, precio, stock }) {
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, descripcion, precio, stock)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nombre, descripcion, precio, stock]
  );
  return rows[0];
}

async function actualizar(id, { nombre, descripcion, precio, stock }) {
  const { rows } = await pool.query(
    `UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4
     WHERE id = $5 RETURNING *`,
    [nombre, descripcion, precio, stock, id]
  );
  return rows[0];
}

async function eliminar(id) {
  await pool.query('DELETE FROM productos WHERE id = $1', [id]);
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
