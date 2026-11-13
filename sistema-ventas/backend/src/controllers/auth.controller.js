// Controlador de "auth": traduce HTTP <-> service.
// Lee req.body, llama al service, responde con status + JSON.
// No valida reglas de negocio ni firma JWT aquí: eso vive en auth.service.js.

const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { nombre, email, password } = req.body;
    const usuario = await authService.registrar({ nombre, email, password });
    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { token, usuario } = await authService.login({ email, password });
    res.status(200).json({ token, usuario });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
