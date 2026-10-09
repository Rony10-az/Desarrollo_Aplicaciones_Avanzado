# Desarrollo de Aplicaciones Web Avanzado — Portafolio

Portafolio de evidencias y proyectos del curso **Desarrollo de Aplicaciones Web Avanzado** (5to ciclo, Tecsup, 2026-2). El curso se desarrolla en **16 semanas**; este repositorio se actualiza semana a semana con el código, la documentación y las evidencias de cada entrega.

**Autor:** Rony Quintana
**Progreso actual:** Semanas 01 a 07 completadas (quedan pendientes las semanas 08 a 16, que se irán agregando conforme avance el ciclo).

---

## 📁 Convenciones de archivos

En cada carpeta `SEMANAxx/` pueden aparecer estos tipos de archivo, además del proyecto de código:

| Archivo | Significado |
|---|---|
| `PPT-S0X-EAREVALO-...pptx` | Diapositivas de teoría proporcionadas por el docente para esa semana (material de clase, no es autoría del alumno). |
| `GLAB-S0X-EAREVALO-...docx` | Guía de laboratorio del docente, completada como entregable de la semana. |
| `GLAB-S0X-...-RONY QUINTANA-...docx` | Versión final de la guía de laboratorio entregada por el alumno. |
| `README.md` dentro de un proyecto | Documentación específica de ese proyecto (instalación, rutas, capturas). |
| `Docs/` o `docs/` | Capturas de pantalla / evidencias de pruebas (Postman, navegador, etc.) de ese proyecto. |

---

## 🗂️ Estructura general

```
.
├── SEMANA01/   Fundamentos de Node.js (JavaScript puro)
├── SEMANA02/   HTTP nativo, plantillas Handlebars y una API REST sencilla
├── SEMANA03/   Manejo de archivos y Streams en Node.js
├── SEMANA04/   Express + EJS con arquitectura MVC
├── SEMANA05/   API RESTful en capas (routes/controllers/services/repositories) + envío de correos
├── SEMANA06/   Persistencia con MongoDB y Mongoose
├── SEMANA07/   Autenticación y autorización con JWT y roles
└── ... (SEMANA08 a SEMANA16, pendientes)
```

---

## SEMANA01 — Fundamentos de Node.js

**Carpeta:** [SEMANA01/](SEMANA01/)

Gestor de tareas por consola, resuelto en tres versiones incrementales dentro de `Laboratorio01/`:

| Archivo | Descripción |
|---|---|
| `app.js` | Versión base: agregar, listar, completar y filtrar tareas en memoria (arrays). |
| `app2.js` | Mejora de `app.js` con validaciones de datos y categorías como constantes. |
| `app3.js` | Persistencia de las tareas en disco (`tareas.json`) usando los módulos `fs` y `readline`. |
| `tareas.json` | Archivo donde `app3.js` guarda y lee las tareas. |

- **Tecnologías:** Node.js puro, JavaScript (ES6). Sin dependencias externas.
- **Otros archivos:** `PPT-S01-EAREVALO-2026-1.pptx` (material de la semana).

---

## SEMANA02 — HTTP nativo, plantillas y una API REST

**Carpeta:** [SEMANA02/](SEMANA02/) · [README propio](SEMANA02/README.md)

| Carpeta | Contenido |
|---|---|
| `Ejercicio01/` | Servidor HTTP con el módulo nativo `http` (sin frameworks), con rutas básicas y una página `services.html`. |
| `Ejercicio02/` | Servidor HTTP nativo que renderiza vistas con **Handlebars** (`views/home.hbs`, `about.hbs`, `students.hbs`). |
| `Ejercicios03/` | **Student API**: API REST de estudiantes en Node.js puro, con patrón *repository* (`repository/studentsRepository.js`) para separar el acceso a datos. |
| `Docs/` | Capturas de las pruebas en Postman de la Student API (GET, POST, PUT, DELETE y filtros). |
| `Eje/` | Carpeta vacía, sin uso. |

- **Tecnologías:** Node.js, módulo `http`, Handlebars, JSON como almacenamiento.
- **Otros archivos:** `GLAB-S02-EAREVALO-2026-1.docx`, `PPT-S02-EAREVALO-2026-1.pptx`.

---

## SEMANA03 — Manejo de archivos y Streams

**Carpeta:** [SEMANA03/](SEMANA03/) · [README propio](SEMANA03/README.md)

| Carpeta | Contenido |
|---|---|
| `laboratorio03/` | Cuatro actividades + una tarea sobre streams nativos: lectura (`actividad1-lectura.js`), escritura (`actividad2-escritura.js`), compresión con `zlib` (`actividad3-compresion.js`), *backpressure* (`actividad4-backpressure.js`) y transformación de texto a mayúsculas (`tarea1-mayusculas.js`). |
| `tarea02-excel-server/` | Servidor HTTP que genera y descarge un reporte Excel **en streaming** usando la librería `exceljs`. |

- **Tecnologías:** Node.js (módulos `fs`, `zlib`, `stream`), `exceljs`.
- **Otros archivos:** `PPT-S03-EAREVALO-2026-1 (1).pptx`.

---

## SEMANA04 — Express, EJS y arquitectura MVC

**Carpeta:** [SEMANA04/](SEMANA04/) · [README propio](SEMANA04/mi-sitio-express/Readme.md)

**`mi-sitio-express/`** — Sitio web "Balón de Oro" construido con **Express + EJS + Materialize**, organizado en MVC (`controllers/`, `routes/`, `views/`, `public/`). Incluye:
- Encuesta de votación con ranking en vivo y estadísticas.
- Formulario de contacto con panel de administración (`/admin`).
- Página "Acerca de" y error 404 personalizado.
- `Docs/`: capturas de cada vista del sitio.

- **Tecnologías:** Express 5, EJS, Materialize CSS.
- **Otros archivos:** `GLAB-S04-EAREVALO-2026-1.docx`, `GLAB-S04-EAREVALO-RONY-QUINTANA-2026-1.docx` (entregable final), `PPT-S03-EAREVALO-2026-1.pptx`.

---

## SEMANA05 — API RESTful en capas

**Carpeta:** [SEMANA05/](SEMANA05/) · [README propio](SEMANA05/api-restful/README.md)

**`api-restful/`** — Sistema de gestión de **tickets de soporte**, con arquitectura en capas:

```
routes/ → controllers/ → services/ → repositories/ → database/db.json
```

Cada vez que se crea, asigna o cambia el estado de un ticket se genera una notificación; las de tipo `email` se envían con **Nodemailer** (`services/email/Emailservice.js`). Incluye manejo global de errores (`middlewares/errorHandler.js`).

- **Tecnologías:** Express 5, Nodemailer, dotenv, cors, morgan, uuid. Persistencia en archivo JSON.
- **Otros archivos:** `GLAB-S05-EAREVALO-2026-1.docx`, `GLAB-S05-EAREVALO-RONY QUINTANA-2026-1.docx`.

---

## SEMANA06 — Persistencia con MongoDB y Mongoose

**Carpeta:** [SEMANA06/](SEMANA06/) · [README propio](SEMANA06/mongo-node/README.md)

**`mongo-node/`** — Aplicación "Social Media Posts": CRUD de publicaciones asociadas a un usuario (sin login), con hashtags e imagen opcional. Estructura en capas dentro de `src/` (`controllers/`, `db/`, `models/`, `repositories/`, `routes/`, `services/`, `views/`, `public/`).

- **Tecnologías:** Express, EJS, MongoDB + Mongoose, dotenv, nodemon.
- **Otros archivos:** `GLAB-S06-EAREVALO-2026-1.docx`, `GLAB-S06-EAREVALO-RONY QUINTANA-2026-1.docx`.
- *Nota:* `package.json` / `package-lock.json` en la raíz de `SEMANA06/` son residuales de una instalación hecha en el nivel equivocado; el proyecto real y sus dependencias están en `mongo-node/`.

---

## SEMANA07 — Autenticación JWT y roles

**Carpeta:** [SEMANA07/](SEMANA07/) · [README propio](SEMANA07/express-mongo-auth/README.md)

**`express-mongo-auth/`** — Sistema de autenticación y autorización con roles `admin` y `user`:

- Login/registro con **JSON Web Tokens** (token guardado en `sessionStorage`, enviado como `Authorization: Bearer`).
- Middlewares `authenticate` y `authorize` para proteger rutas de la API.
- Dashboards distintos para cada rol (gráficos con Chart.js), página de "Mi cuenta" y vistas de error 403/404.
- Semilla automática de roles y de un usuario administrador (`src/utils/seedRoles.js`, `seedUser.js`).
- `docs/`: capturas del flujo de inicio, login y dashboards.

- **Tecnologías:** Express, MongoDB + Mongoose, JSON Web Token, bcrypt, EJS, Materialize, Chart.js.
- **Otros archivos:** `GLAB-S07-EAREVALO-2026-1.docx`, `GLAB-S07-EAREVALO-RONY QUITNANA 2026-1.docx`.

---

## 📌 Semanas 08 a 16

Pendientes de desarrollo. Se agregarán como `SEMANA08/`, `SEMANA09/`, … siguiendo la misma convención de carpetas y documentación de las semanas anteriores.

---

## 🧰 Resumen de tecnologías usadas por semana

| Semana | Lenguaje / Runtime | Framework / Librerías principales | Persistencia |
|---|---|---|---|
| 01 | JavaScript (Node.js puro) | — | Archivo JSON |
| 02 | JavaScript (Node.js puro) | Handlebars | Memoria / JSON |
| 03 | JavaScript (Node.js puro) | exceljs | Archivos (txt, xlsx) |
| 04 | JavaScript (Node.js) | Express, EJS, Materialize | Memoria |
| 05 | JavaScript (Node.js) | Express, Nodemailer | Archivo JSON |
| 06 | JavaScript (Node.js) | Express, EJS, Mongoose | MongoDB |
| 07 | JavaScript (Node.js, ESM) | Express, EJS, Mongoose, JWT, bcrypt | MongoDB |

---

## ▶️ Cómo ejecutar un proyecto puntual

Cada proyecto con dependencias trae su propio `package.json`. En general:

```bash
cd SEMANAxx/nombre-del-proyecto
npm install
npm start        # o: npm run dev (si tiene nodemon)
```

Los proyectos que usan MongoDB (semanas 06 y 07) requieren un archivo `.env` propio (ver el README de cada proyecto) y una base de datos MongoDB local o en Atlas. Los proyectos de las semanas 01 a 03 no requieren instalación: se ejecutan directamente con `node archivo.js`.
