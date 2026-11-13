// Controlador de "productos": traduce HTTP <-> service.
// Cada método delega toda la lógica de negocio a productos.service.js.

const productosService = require('../services/productos.service');

async function listar(req, res, next) {
  try {
    const productos = await productosService.listar();
    res.json(productos);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const producto = await productosService.obtenerPorId(req.params.id);
    res.json(producto);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const producto = await productosService.crear(req.body);
    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const producto = await productosService.actualizar(req.params.id, req.body);
    res.json(producto);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    await productosService.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
