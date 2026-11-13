// Middleware de error centralizado. Cualquier controlador que llame a
// next(error) termina aquí; evita try/catch repetido devolviendo siempre
// la misma forma de respuesta de error.

function errorMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  const status = err.status || 400;
  res.status(status).json({ error: err.message || 'Error interno' });
}

module.exports = errorMiddleware;
