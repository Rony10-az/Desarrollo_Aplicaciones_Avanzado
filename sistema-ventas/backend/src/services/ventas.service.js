// Reglas de negocio de ventas: validar stock disponible antes de vender,
// calcular el total, descontar stock del producto, asociar al cliente y
// al usuario que la registró. Orquesta productos.repository y
// ventas.repository (puede necesitar leer stock de otro dominio).

const ventasRepository = require('../repositories/ventas.repository');
const productosRepository = require('../repositories/productos.repository');

async function listar() {
  return ventasRepository.obtenerTodas();
}

async function obtenerPorId(id) {
  const venta = await ventasRepository.obtenerPorId(id);
  if (!venta) {
    throw new Error('Venta no encontrada');
  }
  return venta;
}

async function crear({ clienteId, items }, usuario) {
  // TODO:
  // 1. Por cada item, verificar stock en productosRepository.
  // 2. Calcular el total sumando (precio * cantidad) de cada item.
  // 3. Descontar el stock vendido.
  // 4. Guardar la venta y su detalle en una transacción.
  return ventasRepository.crear({ clienteId, items, vendedorId: usuario.id });
}

module.exports = { listar, obtenerPorId, crear };
