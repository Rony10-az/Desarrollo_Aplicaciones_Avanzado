// Rutas del dominio "ventas": registrar una venta y consultarla.
// Protegidas con JWT (solo usuarios autenticados venden/consultan).

const { Router } = require('express');
const ventasController = require('../controllers/ventas.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/', ventasController.listar);
router.get('/:id', ventasController.obtenerPorId);
router.post('/', ventasController.crear);

module.exports = router;
