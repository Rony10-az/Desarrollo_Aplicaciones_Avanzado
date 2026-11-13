// Reglas de negocio del catálogo de productos:
// validar stock no-negativo, precio válido, nombre único, etc.
// Delega el acceso a datos a productos.repository.js.

const productosRepository = require('../repositories/productos.repository');

async function listar() {
  return productosRepository.obtenerTodos();
}

async function obtenerPorId(id) {
  const producto = await productosRepository.obtenerPorId(id);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }
  return producto;
}

async function crear(datos) {
  // TODO: validar datos (nombre, precio > 0, stock >= 0) antes de guardar
  return productosRepository.crear(datos);
}

async function actualizar(id, datos) {
  await obtenerPorId(id); // lanza si no existe
  return productosRepository.actualizar(id, datos);
}

async function eliminar(id) {
  await obtenerPorId(id);
  return productosRepository.eliminar(id);
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
