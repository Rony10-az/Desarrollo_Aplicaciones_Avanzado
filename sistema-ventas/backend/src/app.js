// Configura la aplicación Express: middlewares globales y montaje de rutas.
// No escucha ningún puerto aquí (eso es responsabilidad de server.js), así
// las pruebas pueden importar `app` sin levantar un servidor real.

const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// CORS: solo el origen configurado (el frontend Next.js) puede consumir la API.
app.use(cors({ origin: env.corsOrigin }));

// Parseo de JSON en el body de las peticiones.
app.use(express.json());

// Todas las rutas del negocio (sin prefijo /api/), ver src/routes/index.js
app.use('/', routes);

// Manejador de errores centralizado: cualquier `next(error)` termina aquí.
app.use(errorMiddleware);

module.exports = app;
