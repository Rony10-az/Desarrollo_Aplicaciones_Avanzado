// Helpers opcionales para uniformar respuestas JSON de éxito/error,
// por si se quiere una forma consistente en todos los controladores
// en vez de res.json(...) directo.

function ok(res, data, status = 200) {
  return res.status(status).json(data);
}

function fail(res, message, status = 400) {
  return res.status(status).json({ error: message });
}

module.exports = { ok, fail };
