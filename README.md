<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white">
  <img alt="JWT" src="https://img.shields.io/badge/JWT-black?style=flat-square&logo=jsonwebtokens&logoColor=white">
  <img alt="Render" src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white">
  <img alt="GitHub Actions" src="https://img.shields.io/badge/CI%2FCD-2088FF?style=flat-square&logo=githubactions&logoColor=white">
</p>

<h1 align="center">Desarrollo de Aplicaciones Web Avanzado</h1>
<p align="center"><strong>Portafolio de laboratorios y proyectos — 5to ciclo, Tecsup, 2026-2</strong></p>

<p align="center">
  <strong>Autor:</strong> Rony Quintana &nbsp;·&nbsp;
  <a href="https://github.com/Rony10-az">GitHub</a> &nbsp;·&nbsp;
  <a href="https://github.com/Rony10-az/Desarrollo_Aplicaciones_Avanzado">Repositorio</a>
</p>

---

El curso dura **16 semanas**. Este repositorio se actualiza semana a semana con el código y las evidencias de cada entrega: desde Node.js puro hasta APIs en capas, autenticación con JWT y despliegues en la nube con CI/CD.

## 📊 Progreso

```
████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  8 / 16 semanas
```

| 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09–16 |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ |

## 🌐 En producción

| Proyecto | Plataforma | Enlace |
|---|---|---|
| **express-mongo-cloud** (Semana 08) | Render | [express-mongo-cloud-kxvg.onrender.com](https://express-mongo-cloud-kxvg.onrender.com) |
| **express-mongo-auth** (Semana 07, reempaquetado) | Render | [exprees-mongo-jwt-quintana.onrender.com](https://exprees-mongo-jwt-quintana.onrender.com) |

Cada push a `main` dispara automáticamente un nuevo despliegue vía **GitHub Actions**, sin pasos manuales.

## 🗂️ Mapa del repositorio

```
.
├── 🟢 SEMANA01   Fundamentos de Node.js (JavaScript puro)
├── 🟢 SEMANA02   HTTP nativo, plantillas Handlebars y una API REST sencilla
├── 🟢 SEMANA03   Manejo de archivos y Streams en Node.js
├── 🟢 SEMANA04   Express + EJS con arquitectura MVC
├── 🟢 SEMANA05   API RESTful en capas (routes/controllers/services/repositories)
├── 🟢 SEMANA06   Persistencia con MongoDB y Mongoose
├── 🟢 SEMANA07   Autenticación y autorización con JWT y roles
├── 🟢 SEMANA08   Despliegue en la nube (Render/Vercel) + CI/CD con GitHub Actions
└── ⚪ SEMANA09–16  Pendientes
```

## 📚 Laboratorios por semana

<details>
<summary><strong>Semana 01 — Fundamentos de Node.js</strong> <code>Node.js puro</code></summary>
<br>

**Carpeta:** [SEMANA01/](SEMANA01/)

Gestor de tareas por consola, resuelto en tres versiones incrementales dentro de `Laboratorio01/`:

| Archivo | Descripción |
|---|---|
| `app.js` | Versión base: agregar, listar, completar y filtrar tareas en memoria (arrays). |
| `app2.js` | Mejora de `app.js` con validaciones de datos y categorías como constantes. |
| `app3.js` | Persistencia de las tareas en disco (`tareas.json`) usando los módulos `fs` y `readline`. |

**Stack:** Node.js, JavaScript (ES6). Sin dependencias externas.

</details>

<details>
<summary><strong>Semana 02 — HTTP nativo, plantillas y una API REST</strong> <code>Handlebars</code></summary>
<br>

**Carpeta:** [SEMANA02/](SEMANA02/) · [README propio](SEMANA02/README.md)

| Carpeta | Contenido |
|---|---|
| `Ejercicio01/` | Servidor HTTP con el módulo nativo `http` (sin frameworks), con rutas básicas y una página `services.html`. |
| `Ejercicio02/` | Servidor HTTP nativo que renderiza vistas con **Handlebars** (`home.hbs`, `about.hbs`, `students.hbs`). |
| `Ejercicios03/` | **Student API**: API REST de estudiantes en Node.js puro, con patrón *repository* para separar el acceso a datos. |
| `Docs/` | Capturas de las pruebas en Postman de la Student API (GET, POST, PUT, DELETE y filtros). |

**Stack:** Node.js, módulo `http`, Handlebars, JSON como almacenamiento.

</details>

<details>
<summary><strong>Semana 03 — Manejo de archivos y Streams</strong> <code>fs · zlib · exceljs</code></summary>
<br>

**Carpeta:** [SEMANA03/](SEMANA03/) · [README propio](SEMANA03/README.md)

| Carpeta | Contenido |
|---|---|
| `laboratorio03/` | Lectura, escritura, compresión con `zlib`, *backpressure* y transformación de texto, todo con streams nativos. |
| `tarea02-excel-server/` | Servidor HTTP que genera y descarga un reporte Excel **en streaming** con `exceljs`. |

**Stack:** Node.js (`fs`, `zlib`, `stream`), exceljs.

</details>

<details>
<summary><strong>Semana 04 — Express, EJS y arquitectura MVC</strong> <code>Express · EJS · Materialize</code></summary>
<br>

**Carpeta:** [SEMANA04/](SEMANA04/) · [README propio](SEMANA04/mi-sitio-express/Readme.md)

**`mi-sitio-express/`** — Sitio web "Balón de Oro" construido con **Express + EJS + Materialize**, organizado en MVC (`controllers/`, `routes/`, `views/`, `public/`):

- Encuesta de votación con ranking en vivo y estadísticas.
- Formulario de contacto con panel de administración (`/admin`).
- Página "Acerca de" y error 404 personalizado.

**Stack:** Express 5, EJS, Materialize CSS.

</details>

<details>
<summary><strong>Semana 05 — API RESTful en capas</strong> <code>Express · Nodemailer</code></summary>
<br>

**Carpeta:** [SEMANA05/](SEMANA05/) · [README propio](SEMANA05/api-restful/README.md)

**`api-restful/`** — Sistema de gestión de **tickets de soporte**, con arquitectura en capas:

```
routes/ → controllers/ → services/ → repositories/ → database/db.json
```

Cada vez que se crea, asigna o cambia el estado de un ticket se genera una notificación; las de tipo `email` se envían con **Nodemailer**. Incluye manejo global de errores (`middlewares/errorHandler.js`).

**Stack:** Express 5, Nodemailer, dotenv, cors, morgan, uuid. Persistencia en archivo JSON.

</details>

<details>
<summary><strong>Semana 06 — Persistencia con MongoDB y Mongoose</strong> <code>MongoDB · Mongoose</code></summary>
<br>

**Carpeta:** [SEMANA06/](SEMANA06/) · [README propio](SEMANA06/mongo-node/README.md)

**`mongo-node/`** — Aplicación "Social Media Posts": CRUD de publicaciones asociadas a un usuario (sin login), con hashtags e imagen opcional. Estructura en capas dentro de `src/` (`controllers/`, `db/`, `models/`, `repositories/`, `routes/`, `services/`, `views/`, `public/`).

**Stack:** Express, EJS, MongoDB + Mongoose, dotenv, nodemon.

</details>

<details open>
<summary><strong>Semana 07 — Autenticación JWT y roles</strong> <code>JWT · bcrypt · Chart.js</code></summary>
<br>

**Carpeta:** [SEMANA07/](SEMANA07/) · [README propio](SEMANA07/express-mongo-auth/README.md)

**`express-mongo-auth/`** — Sistema de autenticación y autorización con roles `admin` y `user`:

- Login/registro con **JSON Web Tokens** (token guardado en `sessionStorage`, enviado como `Authorization: Bearer`).
- Middlewares `authenticate` y `authorize` para proteger rutas de la API.
- Dashboards distintos para cada rol (gráficos con Chart.js), página de "Mi cuenta" y vistas de error 403/404.
- Semilla automática de roles y de un usuario administrador.

**Stack:** Express, MongoDB + Mongoose, JSON Web Token, bcrypt, EJS, Materialize, Chart.js.

</details>

<details open>
<summary><strong>Semana 08 — Despliegue en la nube y CI/CD</strong> <code>Render · Atlas · GitHub Actions</code></summary>
<br>

**Carpeta:** [SEMANA08/](SEMANA08/) · [README propio](SEMANA08/express-mongo-cloud/README.md)

**`express-mongo-cloud/`** — API REST de gestión de usuarios (CRUD) con Express y Mongoose, conectada a **MongoDB Atlas** y desplegada en **Render**:

- CRUD completo de usuarios (`/api/users`) probado con Postman.
- Conexión a un cluster de MongoDB Atlas, validada con MongoDB Compass.
- Despliegue continuo: cada push a `main` dispara un Deploy Hook de Render mediante GitHub Actions.
- El laboratorio de Semana 07 (`express-mongo-auth`) también se reempaquetó y desplegó en la nube como segunda API.

**Stack:** Express, Mongoose, MongoDB Atlas, Render, GitHub Actions.

</details>

## 🧰 Tecnologías por semana

| Semana | Runtime | Framework / Librerías | Persistencia |
|:--:|---|---|---|
| 01 | Node.js puro | — | Archivo JSON |
| 02 | Node.js puro | Handlebars | Memoria / JSON |
| 03 | Node.js puro | exceljs | Archivos (txt, xlsx) |
| 04 | Node.js | Express, EJS, Materialize | Memoria |
| 05 | Node.js | Express, Nodemailer | Archivo JSON |
| 06 | Node.js | Express, EJS, Mongoose | MongoDB |
| 07 | Node.js (ESM) | Express, EJS, Mongoose, JWT, bcrypt | MongoDB Atlas |
| 08 | Node.js (ESM) | Express, Mongoose | MongoDB Atlas |

## ▶️ Cómo ejecutar un proyecto puntual

Cada proyecto con dependencias trae su propio `package.json`:

```bash
cd SEMANAxx/nombre-del-proyecto
npm install
npm start        # o: npm run dev (si tiene nodemon)
```

Los proyectos que usan MongoDB (semanas 06, 07 y 08) requieren un archivo `.env` propio (ver el README de cada proyecto) y una base de datos MongoDB local o en Atlas. Los proyectos de las semanas 01 a 03 no requieren instalación: se ejecutan directamente con `node archivo.js`.

## 📌 Semanas 09 a 16

Pendientes de desarrollo. Se agregarán como `SEMANA09/`, `SEMANA10/`, … siguiendo la misma convención de carpetas y documentación de las semanas anteriores.
