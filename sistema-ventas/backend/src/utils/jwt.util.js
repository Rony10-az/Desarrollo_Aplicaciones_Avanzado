// Helpers para firmar y verificar JWT. Único lugar del backend que toca
// la librería jsonwebtoken; auth.service y auth.middleware usan esto.

const jwt = require('jsonwebtoken');
const env = require('../config/env');

function firmarToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

function verificarToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = { firmarToken, verificarToken };
