// Punto único donde se registran todas las rutas de la API.
// Importante: las rutas NO llevan prefijo /api/, cada dominio se monta
// directo en la raíz (ej. /auth, /productos, /clientes, /ventas).

const { Router } = require('express');

const authRoutes = require('./auth.routes');
const productosRoutes = require('./productos.routes');
const clientesRoutes = require('./clientes.routes');
const ventasRoutes = require('./ventas.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/productos', productosRoutes);
router.use('/clientes', clientesRoutes);
router.use('/ventas', ventasRoutes);

module.exports = router;
