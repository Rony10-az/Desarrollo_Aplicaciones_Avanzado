# API RESTful - Sistema de Tickets

API REST desarrollada con **Node.js** y **Express** para gestionar tickets de soporte. Cada vez que un ticket se crea, se asigna o cambia de estado, el sistema genera una notificación y, cuando es de tipo `email`, envía un correo con **Nodemailer**.

Proyecto del curso Desarrollo de Aplicaciones Web Avanzado (Semana 05).

## Tecnologías

- Node.js + Express 5
- Nodemailer (envío de correos)
- dotenv (variables de entorno)
- cors y morgan (middlewares)
- uuid (identificadores)
- Persistencia en archivo JSON (`database/db.json`)

## Estructura del proyecto

```
api-restful/
├── app.js                     # Punto de entrada y configuración de Express
├── routes/                    # Definición de endpoints
├── controllers/               # Reciben la petición y devuelven la respuesta
├── services/                  # Lógica de negocio
│   └── email/Emailservice.js  # Envío de correos con Nodemailer
├── repositories/              # Acceso a los datos (db.json)
├── middlewares/
│   └── errorHandler.js        # Manejo global de errores
└── database/db.json           # Base de datos en JSON
```

El flujo de una petición es: **ruta → controlador → servicio → repositorio**.

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto (ya está incluido en el `.gitignore`):

```env
MAILER_SERVICE=gmail
MAILER_EMAIL=tu_correo@dominio.com
MAILER_SECRET_KEY=tu_contraseña_de_aplicacion
NOTIFICATION_EMAIL_TO=destino1@gmail.com,destino2@dominio.com
```

| Variable | Descripción |
|---|---|
| `MAILER_SERVICE` | Servicio de correo que usa Nodemailer (por ejemplo `gmail`) |
| `MAILER_EMAIL` | Cuenta desde la que se envían los correos |
| `MAILER_SECRET_KEY` | Contraseña de aplicación de esa cuenta (no la contraseña normal) |
| `NOTIFICATION_EMAIL_TO` | Destinatarios de las notificaciones, separados por coma |

> Si cambias el `.env`, reinicia el servidor: las variables se leen solo al arrancar.

## Ejecución

```bash
npm start      # ejecuta con node
npm run dev    # ejecuta con nodemon (recarga automática)
```

El servidor queda disponible en `http://localhost:3000`.

## Endpoints

### Tickets

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/tickets` | Crea un ticket |
| `GET` | `/tickets?page=1&limit=10` | Lista los tickets con paginación |
| `PUT` | `/tickets/:id/assign` | Asigna el ticket a un usuario |
| `PUT` | `/tickets/:id/status` | Cambia el estado del ticket |
| `GET` | `/tickets/:id/notifications` | Lista las notificaciones de un ticket |
| `DELETE` | `/tickets/:id` | Elimina un ticket |

### Notificaciones

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/notifications` | Lista todas las notificaciones |

## Ejemplos

**Crear un ticket**

```http
POST /tickets
Content-Type: application/json

{
  "title": "No carga el login",
  "description": "La página queda en blanco al iniciar sesión",
  "priority": "high"
}
```

Si no se envía `priority`, se usa `medium`. El ticket nuevo se guarda con estado `nuevo` y sin usuario asignado.

**Asignar un ticket**

```http
PUT /tickets/:id/assign
Content-Type: application/json

{ "user": "Rony" }
```

**Cambiar el estado**

```http
PUT /tickets/:id/status
Content-Type: application/json

{ "status": "en progreso" }
```

**Respuesta de la lista (paginada)**

```json
{
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 0, "totalPages": 1 }
}
```

## Notificaciones

| Acción | Tipo de notificación |
|---|---|
| Crear un ticket | `email` |
| Asignar un ticket | `email` |
| Cambiar el estado | `push` |

- Las de tipo `email` se guardan y además se envían por correo a los destinatarios de `NOTIFICATION_EMAIL_TO`.
- Las de tipo `push` solo se guardan en `db.json`; no se envía nada externo.

## Manejo de errores

El middleware global devuelve un JSON con el mensaje de error. Por ejemplo, al operar sobre un ticket que no existe:

```json
{ "error": "Ticket no encontrado" }
```

con código de estado `404`. Los errores no controlados responden `500` con "Error interno del servidor".

## Autor

Rony Quintana - Tecsup
