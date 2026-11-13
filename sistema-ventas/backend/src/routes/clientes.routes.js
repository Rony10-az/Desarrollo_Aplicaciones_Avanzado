// Rutas del dominio "clientes". CRUD protegido con JWT.

const { Router } = require('express');
const clientesController = require('../controllers/clientes.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/', clientesController.listar);
router.get('/:id', clientesController.obtenerPorId);
router.post('/', clientesController.crear);
router.put('/:id', clientesController.actualizar);
router.delete('/:id', clientesController.eliminar);

module.exports = router;
