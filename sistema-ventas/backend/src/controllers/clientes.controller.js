// Controlador de "clientes": traduce HTTP <-> service.
// Mismo patrón que productos.controller.js.

const clientesService = require('../services/clientes.service');

async function listar(req, res, next) {
  try {
    const clientes = await clientesService.listar();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const cliente = await clientesService.obtenerPorId(req.params.id);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const cliente = await clientesService.crear(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const cliente = await clientesService.actualizar(req.params.id, req.body);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    await clientesService.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
