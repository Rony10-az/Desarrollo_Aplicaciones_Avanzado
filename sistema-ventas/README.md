# Sistema de Gestión de Ventas

Proyecto del curso **Desarrollo de Aplicaciones Web Avanzado** (5to ciclo, Tecsup, 2026-2).

Sistema de ventas con backend en **Express** (API REST en capas: rutas → controladores →
servicios → repositorios) y frontend en **Next.js**. Base de datos **PostgreSQL**.
Seguridad con **JWT** (autenticación) y **CORS** (control de origen), pensada para
seguir escalando (rate limiting, roles más finos, etc. se añaden sobre esta misma base).

## Fase actual vs. arquitectura objetivo

El diagrama de arquitectura del curso plantea un sistema final en **microservicios**
(auth-service, catalog-service, sales-service, ai-service, cada uno con su propia base
de datos, detrás de un API Gateway, con CI/CD a Vercel/Render). Esa es la meta de escalado.

**Esta primera estructura es un monolito modular**: un solo backend Express con capas
`routes/controllers/services/repositories/models`, organizado **por dominio** (auth,
productos, clientes, ventas). Se eligió así porque:

- Es la base que pide la tarea ahora mismo (MVC + repositorios + servicios).
- Al estar separado por dominio desde el inicio, cada carpeta de dominio puede
  "graduarse" más adelante a su propio microservicio sin reescribir la lógica interna:
  solo se mueve la carpeta y se le pone su propio `server.js` y su propia base de datos.
- El frontend ya habla con el backend por HTTP (fetch a rutas simples), así que el día
  que el backend se parta en servicios detrás de un Gateway, el frontend casi no cambia.

## Estructura del repositorio

```
sistema-ventas/
├── backend/     → API REST con Express (ver backend/README.md)
└── frontend/    → Interfaz con Next.js (ver frontend/README.md)
```

Cada carpeta (`backend/`, `frontend/`) es independiente: su propio `package.json`,
su propio `.env`, y se levanta por separado.

## Convención de rutas

Las rutas de la API **no llevan el prefijo `/api/`**. Son rutas simples y directas por
dominio, con parámetros dinámicos donde corresponde:

```
/auth/login
/auth/register
/productos
/productos/:id
/clientes
/clientes/:id
/ventas
/ventas/:id
```

El frontend consume esas mismas rutas vía `NEXT_PUBLIC_API_URL` (ver `frontend/.env.example`).

## Cómo levantar el proyecto

```bash
# Backend
cd sistema-ventas/backend
cp .env.example .env
npm install
npm run dev

# Frontend (en otra terminal)
cd sistema-ventas/frontend
cp .env.example .env
npm install
npm run dev
```

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js (React) |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT |
| Seguridad de origen | CORS |
| Configuración | dotenv (`.env`) |
| Recarga en desarrollo | nodemon |
