// Única capa que ejecuta SQL para la tabla "clientes".

const pool = require('../config/database');

async function obtenerTodos() {
  const { rows } = await pool.query('SELECT * FROM clientes ORDER BY id');
  return rows;
}

async function obtenerPorId(id) {
  const { rows } = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
  return rows[0];
}

async function crear({ nombre, email, telefono, documento }) {
  const { rows } = await pool.query(
    `INSERT INTO clientes (nombre, email, telefono, documento)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nombre, email, telefono, documento]
  );
  return rows[0];
}

async function actualizar(id, { nombre, email, telefono, documento }) {
  const { rows } = await pool.query(
    `UPDATE clientes SET nombre = $1, email = $2, telefono = $3, documento = $4
     WHERE id = $5 RETURNING *`,
    [nombre, email, telefono, documento, id]
  );
  return rows[0];
}

async function eliminar(id) {
  await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
