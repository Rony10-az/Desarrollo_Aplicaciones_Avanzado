// Forma de las entidades "venta" y "venta_detalle".

/**
 * @typedef {Object} Venta
 * @property {number} id
 * @property {number} cliente_id
 * @property {number} vendedor_id
 * @property {number} total
 * @property {string} creado_en
 */

/**
 * @typedef {Object} VentaDetalle
 * @property {number} id
 * @property {number} venta_id
 * @property {number} producto_id
 * @property {number} cantidad
 * @property {number} precio_unitario
 */

module.exports = {};
