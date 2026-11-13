// Ejemplo de prueba de integración: hace una petición HTTP real contra
// app.js y revisa el status code / forma de la respuesta. Requiere que
// la base de datos de pruebas tenga el esquema de migrations/001_init.sql.

const request = require('supertest');
const app = require('../../src/app');

describe('GET /productos', () => {
  test('responde 200 con un arreglo', async () => {
    const res = await request(app).get('/productos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
