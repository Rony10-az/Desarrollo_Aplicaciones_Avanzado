// Reglas de negocio de clientes: validar email/documento único, formato, etc.
// Delega el acceso a datos a clientes.repository.js.

const clientesRepository = require('../repositories/clientes.repository');

async function listar() {
  return clientesRepository.obtenerTodos();
}

async function obtenerPorId(id) {
  const cliente = await clientesRepository.obtenerPorId(id);
  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }
  return cliente;
}

async function crear(datos) {
  // TODO: validar datos (nombre, email, documento) antes de guardar
  return clientesRepository.crear(datos);
}

async function actualizar(id, datos) {
  await obtenerPorId(id);
  return clientesRepository.actualizar(id, datos);
}

async function eliminar(id) {
  await obtenerPorId(id);
  return clientesRepository.eliminar(id);
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
