// Única capa que ejecuta SQL para la tabla "usuarios".
// No valida nada de negocio: solo guarda/consulta lo que le piden.

const pool = require('../config/database');

async function crearUsuario({ nombre, email, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol)
     VALUES ($1, $2, $3, 'vendedor')
     RETURNING id, nombre, email, rol, creado_en`,
    [nombre, email, passwordHash]
  );
  return rows[0];
}

async function buscarPorEmail(email) {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return rows[0];
}

module.exports = { crearUsuario, buscarPorEmail };
