# express-mongo-cloud

API REST de gestión de usuarios (CRUD) construida con Express y Mongoose, conectada a una base de datos en la nube (MongoDB Atlas) y desplegada en Render con integración y despliegue continuo (CI/CD) mediante GitHub Actions.

## Stack

- Node.js + Express
- Mongoose (MongoDB Atlas)
- cors, dotenv
- nodemon (entorno de desarrollo)

## Estructura del proyecto

```
express-mongo-cloud/
├── docs/                    # Capturas de evidencia del laboratorio
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── repositories/
│   │   └── userRepository.js
│   ├── routes/
│   │   └── user.routes.js
│   ├── services/
│   │   └── userService.js
│   ├── app.js               # Configuración base de Express
│   └── server.js            # Conexión a Mongo + arranque del servidor
├── .env.example
└── package.json
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (ver `.env.example`):

```
PORT=3000
MONGO_URI=mongodb+srv://<db_username>:<db_password>@dawacluster.tyrj3qk.mongodb.net/my_cloud_database?retryWrites=true&w=majority
```

## Instalación y ejecución local

```bash
npm install
npm run dev
```

El servidor solo se levanta si la conexión a MongoDB Atlas se establece correctamente (ver `src/server.js`).

## Endpoints

| Método | Ruta              | Descripción              |
|--------|-------------------|---------------------------|
| GET    | /api/users        | Lista todos los usuarios  |
| GET    | /api/users/:id    | Obtiene un usuario por id |
| POST   | /api/users        | Crea un nuevo usuario     |
| PUT    | /api/users/:id    | Actualiza un usuario      |
| DELETE | /api/users/:id    | Elimina un usuario        |

## Base de datos en la nube (MongoDB Atlas)

Se configuró un cluster (`dawacluster1.b8j877d.mongodb.net`) en MongoDB Atlas y se validó la conexión usando MongoDB Compass con las credenciales del usuario de base de datos.

| Captura | Descripción |
|---|---|
| ![Conexión Compass](docs/Screenshot%202026-10-10%20114018.png) | Configuración de la cadena de conexión en MongoDB Compass |
| ![Cluster conectado](docs/Screenshot%202026-10-10%20114008.png) | Cluster conectado desde Compass, listado de bases de datos |

## Despliegue en producción (Render)

El servicio se desplegó como **Web Service** en Render, apuntando al monorepo de GitHub con el **Root Directory** fijado en `SEMANA08/express-mongo-cloud/` para que solo se construya esta carpeta.

- **Servicio:** `express-mongo-cloud`
- **URL pública:** https://express-mongo-cloud-kxvg.onrender.com
- **Build command:** `yarn`
- **Start command:** `npm start` → `node src/server.js`
- **Variables de entorno en Render:** `MONGO_URI`, `PORT`

| Captura | Descripción |
|---|---|
| ![Configuración del Web Service](docs/Screenshot%202026-10-10%20113928.png) | Configuración del Web Service: repo, branch y Root Directory |
| ![Variables de entorno](docs/Screenshot%202026-10-10%20113944.png) | Variables de entorno configuradas y URL pública del servicio |
| ![Logs del primer deploy](docs/Screenshot%202026-10-10%20113900.png) | Logs del primer deploy: conexión exitosa a MongoDB Atlas y servidor arriba |

## Pruebas con Postman

Se registraron datos de prueba contra la API en local (`POST /api/users`), confirmando la persistencia en MongoDB Atlas.

| Captura | Descripción |
|---|---|
| ![Prueba Postman](docs/Screenshot%202026-10-10%20113954.png) | `POST http://localhost:3000/api/users` → `201 Created` |

## CI/CD con GitHub Actions

Se configuró integración y despliegue continuo para que cada push a `main` dispare automáticamente un nuevo deploy en Render, sin pasos manuales:

1. Se generó un **Deploy Hook** en el Web Service de Render.
2. Se guardó como secret `RENDER_DEPLOY_HOOK_URL` en GitHub (Settings → Secrets and variables → Actions).
3. Se creó el workflow [`/.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml), que en cada push a `main` hace un `curl -X POST` al Deploy Hook.

| Captura | Descripción |
|---|---|
| ![Ejecución de GitHub Actions](docs/Screenshot%202026-10-10%20121552.png) | Workflow `deploy.yml` ejecutado con éxito en GitHub Actions tras un push a `main` |
| ![Auto-deploy en Render](docs/Screenshot%202026-10-10%20115653.png) | Render recibiendo el Auto-Deploy disparado por el Deploy Hook (commit "CI/CD added") |

Con esto, cualquier cambio subido a `main` queda publicado en producción sin intervención manual.

## Tarea 2 — API con JWT en la nube

Reutilizando el proyecto del laboratorio 07 (`SEMANA07/express-mongo-auth`), se desplegó en Render la API de autenticación con JWT, conectada también a MongoDB Atlas.

- **Repositorio:** https://github.com/Rony10-az/Desarrollo_Aplicaciones_Avanzado
- **API en la nube:** https://exprees-mongo-jwt-quintana.onrender.com

## Enlaces

- Repositorio: https://github.com/Rony10-az/Desarrollo_Aplicaciones_Avanzado
- API en la nube (express-mongo-cloud): https://express-mongo-cloud-kxvg.onrender.com
