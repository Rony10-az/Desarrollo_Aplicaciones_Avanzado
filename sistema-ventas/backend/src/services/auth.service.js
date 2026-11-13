// Reglas de negocio de autenticación:
// - registrar: valida datos, hashea password (bcrypt), guarda usuario.
// - login: valida credenciales contra el hash, firma un JWT si son correctas.
// No conoce Express (req/res); solo recibe/devuelve datos planos.

const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/auth.repository');
const { firmarToken } = require('../utils/jwt.util');

async function registrar({ nombre, email, password }) {
  // TODO: validar que el email no exista ya (authRepository.buscarPorEmail)
  const passwordHash = await bcrypt.hash(password, 10);
  const usuario = await authRepository.crearUsuario({ nombre, email, passwordHash });
  delete usuario.password_hash;
  return usuario;
}

async function login({ email, password }) {
  const usuario = await authRepository.buscarPorEmail(email);
  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  const passwordValido = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordValido) {
    throw new Error('Credenciales inválidas');
  }

  const token = firmarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });
  delete usuario.password_hash;
  return { token, usuario };
}

module.exports = { registrar, login };
