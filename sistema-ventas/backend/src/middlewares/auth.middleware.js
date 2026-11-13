// Verifica el JWT enviado en el header Authorization: "Bearer <token>".
// Si es válido, cuelga el usuario decodificado en req.usuario y continúa;
// si no, corta la petición con 401 antes de llegar al controlador.

const { verificarToken } = require('../utils/jwt.util');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.usuario = verificarToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
