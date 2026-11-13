// Ejemplo de prueba unitaria: valida que el service lance error cuando
// el repositorio no encuentra el producto. Mockear siempre el repository,
// nunca la base de datos real, en pruebas unitarias.

jest.mock('../../src/repositories/productos.repository');
const productosRepository = require('../../src/repositories/productos.repository');
const productosService = require('../../src/services/productos.service');

describe('productos.service', () => {
  test('obtenerPorId lanza error si el producto no existe', async () => {
    productosRepository.obtenerPorId.mockResolvedValue(undefined);

    await expect(productosService.obtenerPorId(999)).rejects.toThrow(
      'Producto no encontrado'
    );
  });
});
