// Fábrica de middlewares de validación de body. Se usa en las rutas que
// necesiten validar forma/tipo de datos antes de llegar al controlador,
// ej: router.post('/', validate(esquemaProducto), productosController.crear).
//
// TODO: conectar con una librería de esquemas (ej. zod o joi) cuando se
// definan las reglas de validación de cada dominio.

function validate(schema) {
  return (req, res, next) => {
    // const resultado = schema.safeParse(req.body);
    // if (!resultado.success) return res.status(400).json({ error: resultado.error });
    next();
  };
}

module.exports = validate;
