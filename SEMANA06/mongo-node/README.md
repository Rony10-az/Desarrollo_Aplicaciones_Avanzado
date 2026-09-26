# Social Media Posts

Aplicacion web con Node.js, Express, EJS y MongoDB para gestionar publicaciones asociadas a usuarios.

## Requisitos

- Node.js 18 o superior
- MongoDB local o MongoDB Atlas
- npm

## Instalacion

Desde esta carpeta:

```bash
npm install
```

Crea un archivo `.env` en `mongo-node` con la conexion a MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/social-media
PORT=3000
```

No subas el archivo `.env` al repositorio. Contiene informacion sensible y esta excluido por `.gitignore`.

## Ejecucion

Modo normal:

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

Abre la aplicacion en:

```text
http://localhost:3000
```

El puerto puede cambiar si se configura `PORT` en `.env`.

## Funcionalidades

- Bienvenida responsive con vista previa de publicaciones.
- Listado de Posts de todos los usuarios.
- Creacion de Posts.
- Edicion de Posts.
- Eliminacion de Posts.
- Seleccion del usuario autor mediante un desplegable, sin inicio de sesion.
- Validacion del usuario seleccionado antes de guardar un Post.
- Hashtags e imagen opcional.

## Rutas principales

| Metodo | Ruta | Funcion |
| --- | --- | --- |
| GET | `/` | Pagina de bienvenida |
| GET | `/posts` | Listado de Posts |
| GET | `/posts/new` | Formulario de nuevo Post |
| POST | `/posts` | Crear Post |
| GET | `/posts/:id/edit` | Formulario de edicion |
| POST | `/posts/:id` | Actualizar Post |
| POST | `/posts/:id/delete` | Eliminar Post |

## Estructura principal

```text
src/
  controllers/   Logica de las peticiones
  db/             Conexion con MongoDB
  models/         Modelos User y Post
  repositories/   Acceso a datos
  routes/         Rutas Express
  services/       Reglas de negocio
  views/          Plantillas EJS
  public/         Estilos y recursos estaticos
```

## Nota sobre validaciones

Las reglas `min`, `required` y `unique` del modelo Mongoose se aplican cuando los datos se guardan mediante la aplicacion Node.js. Las inserciones directas desde Mongo Shell requieren validadores configurados en MongoDB si tambien se desean controlar en la base de datos.
