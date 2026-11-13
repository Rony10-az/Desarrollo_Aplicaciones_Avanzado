// Controlador de "ventas": traduce HTTP <-> service.
// req.usuario viene del auth.middleware (usuario autenticado que vende).

const ventasService = require('../services/ventas.service');

async function listar(req, res, next) {
  try {
    const ventas = await ventasService.listar();
    res.json(ventas);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const venta = await ventasService.obtenerPorId(req.params.id);
    res.json(venta);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const venta = await ventasService.crear(req.body, req.usuario);
    res.status(201).json(venta);
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtenerPorId, crear };
