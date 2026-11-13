// Forma de la entidad "usuario" (tabla usuarios). Documenta los campos que
// maneja el resto del backend; no ejecuta queries (eso es de repositories/).

/**
 * @typedef {Object} Usuario
 * @property {number} id
 * @property {string} nombre
 * @property {string} email
 * @property {string} password_hash
 * @property {'admin'|'vendedor'} rol
 * @property {string} creado_en
 */

module.exports = {};
