// Rutas del dominio "auth": registro/login y emisión de JWT.
// Solo declaran URL + verbo + controlador. Nada de lógica aquí.

const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
