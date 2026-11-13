# Backend — Sistema de Ventas (Express + PostgreSQL)

API REST en capas. Cada carpeta de `src/` tiene una responsabilidad única; una petición
fluye siempre en el mismo sentido:

```
request → routes → controller → service → repository → PostgreSQL
                                    ↓
response ← controller ← ← ← ← ← ← ┘
```

## Capas

| Carpeta | Qué hace | Qué NO hace |
|---|---|---|
| `routes/` | Define la URL y el verbo HTTP, conecta con un controlador. No valida reglas de negocio. | No habla con la base de datos, no arma respuestas. |
| `controllers/` | Lee `req` (body, params, query), llama al service correspondiente y arma la respuesta HTTP (status + JSON). | No contiene SQL ni reglas de negocio. |
| `services/` | Reglas de negocio: validaciones, cálculos, orquestar varias repositorios, hashear contraseñas, firmar JWT. | No conoce `req`/`res` de Express, no escribe SQL directo. |
| `repositories/` | Única capa que sabe que la base de datos es PostgreSQL. Arma y ejecuta queries SQL con `pg`. | No valida reglas de negocio. |
| `models/` | Forma/estructura de cada entidad (los campos de la tabla) y su documentación. | No ejecuta queries. |
| `middlewares/` | Funciones que se ejecutan antes del controlador: verificar JWT, manejar errores, validar body. | — |
| `utils/` | Helpers reutilizables sin estado (firmar/verificar JWT, formatear respuestas). | — |
| `database/migrations` | Scripts SQL que crean/alteran tablas. | — |
| `database/seeds` | Scripts SQL con datos de prueba. | — |

## Dominios (módulos del negocio)

Cada dominio (`auth`, `productos`, `clientes`, `ventas`) repite el mismo patrón de
archivos: `*.routes.js`, `*.controller.js`, `*.service.js`, `*.repository.js`. Esto es
intencional: si un dominio crece mucho, se puede mover tal cual a su propio
microservicio (ver el README raíz del proyecto, sección "Fase actual vs. arquitectura
objetivo").

- **auth** — registro, login, emisión/verificación de JWT, roles de usuario.
- **productos** — catálogo: alta, baja, edición y consulta de productos/stock.
- **clientes** — datos de clientes que compran.
- **ventas** — registro de pedidos/ventas, detalle de venta, reportes simples.

## Rutas (sin prefijo `/api/`)

```
POST   /auth/register
POST   /auth/login

GET    /productos
GET    /productos/:id
POST   /productos
PUT    /productos/:id
DELETE /productos/:id

GET    /clientes
GET    /clientes/:id
POST   /clientes
PUT    /clientes/:id
DELETE /clientes/:id

GET    /ventas
GET    /ventas/:id
POST   /ventas
```

## Cómo correr

```bash
cp .env.example .env     # completar credenciales de PostgreSQL y JWT_SECRET
npm install
npm run dev               # nodemon, recarga automática
npm test                  # pruebas con Jest + Supertest
```

## Base de datos

Ejecutar `src/database/migrations/001_init.sql` sobre la base `sistema_ventas` para
crear las tablas. Opcionalmente `src/database/seeds/seed.sql` para datos de prueba.
