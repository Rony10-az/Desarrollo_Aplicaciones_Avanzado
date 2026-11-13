// Rutas del dominio "productos" (catálogo). CRUD protegido con JWT,
// excepto la lectura pública (GET) si así se decide más adelante.

const { Router } = require('express');
const productosController = require('../controllers/productos.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', productosController.listar);
router.get('/:id', productosController.obtenerPorId);
router.post('/', authMiddleware, productosController.crear);
router.put('/:id', authMiddleware, productosController.actualizar);
router.delete('/:id', authMiddleware, productosController.eliminar);

module.exports = router;
