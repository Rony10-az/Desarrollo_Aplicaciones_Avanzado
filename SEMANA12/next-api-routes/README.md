<div align="center">

# La Biblioteca

**Gestion de autores y libros** construida con Next.js 16 (App Router + Turbopack) y Prisma 8.
API REST completa + interfaz de 3 rutas con tema de biblioteca: portadas reales, fotos de autores y un modal de "libro grande" en 3D.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma_8-orm--postgres-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)

</div>

---

## Vista previa

<table>
<tr>
<td width="50%">

**Panel — `/`**
<br/>Hero animado, estadisticas generales y CRUD de autores
<img src="docs/screenshots/panel-hero.jpg" alt="Panel principal con hero animado" width="100%" />

</td>
<td width="50%">

**Panel — autores**
<br/>Tarjetas con foto real, bio y conteo de libros
<img src="docs/screenshots/panel-authors.jpg" alt="Grid de tarjetas de autores" width="100%" />

</td>
</tr>
<tr>
<td width="50%">

**Buscador — `/books`**
<br/>Hero de biblioteca + filtros, orden y paginacion
<img src="docs/screenshots/books-hero.jpg" alt="Hero del buscador de libros" width="100%" />

</td>
<td width="50%">

**Catalogo de libros**
<br/>Portadas reales (Open Library) por ISBN
<img src="docs/screenshots/books-grid.jpg" alt="Grid de libros con portadas reales" width="100%" />

</td>
</tr>
</table>

<div align="center">

**El "libro grande"** — modal con transformacion 3D, portada real, metadata y autor
<br/><br/>
<img src="docs/screenshots/book-modal.jpg" alt="Modal 3D del libro grande" width="70%" />

</div>

---

## Caracteristicas

- **CRUD completo de autores y libros**, con validaciones y relacion en cascada (`onDelete: Cascade`).
- **Busqueda avanzada** de libros: por titulo, genero y autor, con orden y paginacion server-side.
- **Estadisticas por autor**: total de libros, promedio de paginas, primer y ultimo libro, generos presentes.
- **Fotos y portadas reales**: fotos de autores clasicos desde Wikipedia (con campo editable `photoUrl` para cualquier autor), portadas de libros desde Open Library por ISBN, con fallback visual deterministico cuando no hay dato real.
- **Tarjetas de autor totalmente clicables**, con edicion/eliminacion inline sin disparar la navegacion.
- **Modal "libro grande"** con apertura en 3D (`perspective` + `rotateY`) y cursor-lupa al pasar sobre una tarjeta.
- **Carga progresiva con `Suspense`**: cada ruta muestra un *skeleton* mientras resuelve sus queries, sin bloquear el prerenderizado estatico (Cache Components).

## Stack

| Capa | Tecnologia |
|---|---|
| Framework | Next.js 16.4.5 (App Router, Turbopack, Cache Components) |
| Base de datos | PostgreSQL (Supabase) |
| ORM | Prisma 8 (`@prisma/orm-postgres`) — API "contract-first" (`db.orm.public.<Modelo>`), no confundir con Prisma 7 / `@prisma/client` |
| UI | React 19, Tailwind CSS v4, `next/image`, `next/font` (Fraunces + Plus Jakarta Sans) |
| Datos externos | Open Library Covers API (portadas de libros), Wikipedia REST API (fotos/bios de autores clasicos) |

> **Nota:** este proyecto usa Prisma 8, cuyas convenciones (`prisma.config.ts`, `prisma contract emit`, `db.orm.public.Modelo.select().where().all()`, codigos `sqlState`) difieren de Prisma 7. Ver `AGENTS.md` y la skill `prisma-8` si vas a modificar el esquema o las queries.

## Puesta en marcha

1. **Variables de entorno** — crear `.env` en la raiz del proyecto con:
   ```env
   DATABASE_URL="postgresql://usuario:password@host:puerto/db?sslmode=require"
   ```
2. **Instalar dependencias**
   ```bash
   npm install
   ```
3. **Sincronizar el esquema con la base de datos** (crea/actualiza las tablas `Author` y `Book` a partir de `prisma/schema.prisma`)
   ```bash
   npx prisma db update
   ```
4. **Levantar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
5. Abrir [http://localhost:3000](http://localhost:3000)

## Estructura del proyecto

```
prisma/
  schema.prisma          # Modelos Author y Book
src/
  prisma/
    db.ts                 # Entry point del runtime Prisma 8 (db.orm.public.*)
    contract.json          # Contrato generado (no editar a mano)
  app/
    page.tsx               # Ruta "/"        -> Panel de autores (dashboard)
    books/page.tsx         # Ruta "/books"   -> Buscador de libros
    authors/[id]/page.tsx  # Ruta "/authors/[id]" -> Ficha de autor
    api/
      authors/route.ts              # GET, POST
      authors/[id]/route.ts         # GET, PUT, DELETE
      authors/[id]/books/route.ts   # GET (libros de un autor)
      authors/[id]/stats/route.ts   # GET (estadisticas del autor)
      books/route.ts                # GET, POST
      books/[id]/route.ts           # GET, PUT, DELETE
      books/search/route.ts         # GET (busqueda, filtros, orden, paginacion)
    _components/            # Componentes compartidos (cliente y servidor)
public/
  images/                   # Heros, portadas de respaldo y fotos de autores (estaticas, locales)
docs/
  screenshots/              # Capturas usadas en este README
```

## Rutas de la aplicacion

| Ruta | Descripcion |
|---|---|
| `/` | Panel principal: listado de autores (foto, bio, cantidad de libros), estadisticas generales del catalogo (autores, libros, paginas, generos) y CRUD completo de autores. |
| `/books` | Buscador/catalogo de libros: filtros por titulo, genero y autor, orden y paginacion, tarjetas tipo "lomo de libro" con portada real cuando hay ISBN. |
| `/authors/[id]` | Ficha de un autor: foto grande, bio extendida, estadisticas (total de libros, promedio de paginas, primer/ultimo libro, generos), su coleccion de libros, edicion del autor y alta de nuevos libros. |

## API — Endpoints

Base URL: `http://localhost:3000/api`

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/authors` | Lista todos los autores con sus libros (`id`, `title`, `publishedYear`) y el conteo. |
| `POST` | `/authors` | Crea un autor. Body: `name`, `email` (obligatorios), `bio`, `nationality`, `birthYear`, `photoUrl` (opcionales). |
| `GET` | `/authors/:id` | Obtiene un autor por id, con sus libros. |
| `PUT` | `/authors/:id` | Actualiza un autor. |
| `DELETE` | `/authors/:id` | Elimina un autor (en cascada elimina sus libros). |
| `GET` | `/authors/:id/books` | Lista los libros de un autor especifico. |
| `GET` | `/authors/:id/stats` | Estadisticas del autor: total de libros, promedio de paginas, primer y ultimo libro, generos presentes. |
| `GET` | `/books` | Lista todos los libros con su autor. |
| `POST` | `/books` | Crea un libro. Body: `title`, `authorId` (obligatorios), `description`, `isbn`, `genre`, `publishedYear`, `pages` (opcionales). |
| `GET` | `/books/:id` | Obtiene un libro por id, con su autor. |
| `PUT` | `/books/:id` | Actualiza un libro. |
| `DELETE` | `/books/:id` | Elimina un libro. |
| `GET` | `/books/search` | Busqueda avanzada. Query params: `search` (titulo, contiene), `genre`, `authorName`, `page`, `limit` (max 50), `sortBy` (`title`\|`publishedYear`\|`createdAt`), `order` (`asc`\|`desc`). Responde `{ data, pagination }`. |

## Modelo de datos

```
Author { id, name, email (unico), bio?, nationality?, birthYear?, photoUrl?, createdAt, updatedAt }
Book   { id, title, description?, isbn? (unico), publishedYear?, pages?, genre?, authorId -> Author, createdAt, updatedAt }
```

- `Author.photoUrl`: URL opcional de foto del autor, asignable al crear/editar desde la UI. Si esta vacia, el sistema usa automaticamente una foto real de Wikipedia para los autores clasicos del seed, y si tampoco hay, muestra un monograma de color.
- Al borrar un `Author` se borran en cascada (`onDelete: Cascade`) todos sus `Book`.

## Notas de visualizacion

- **`/` (Panel):** hero a pantalla completa con foto de fondo y efecto Ken Burns, titulo animado palabra por palabra. Cada tarjeta de autor es completamente clicable (lleva a su ficha); los botones de editar/eliminar no disparan la navegacion (usan `stopPropagation`). Las fotos reales de los 7 autores clasicos se sirven localmente desde `public/images/authors/`.
- **`/books`:** mismo estilo de hero que el panel, pero con imagen de biblioteca. Al pasar el mouse sobre una tarjeta aparece un cursor en forma de lupa; al hacer click se abre el **modal del "libro grande"** con una transformacion 3D (`perspective` + `rotateY`) que simula abrir el libro. Si el libro tiene ISBN, se usa su portada real (Open Library); si no, se usa una textura de respaldo con un velo de color deterministico por libro. El nombre del autor aparece junto a su avatar circular (foto o inicial) tanto en la tarjeta como dentro del modal.
- **`/authors/[id]`:** panel dividido en dos: foto grande del autor a la izquierda (con degradado), datos y bio extendida a la derecha. Debajo, tiles de estadisticas y la coleccion completa de libros del autor, reutilizando las mismas tarjetas de `/books`.
- **Crear/editar autor:** el formulario modal incluye un campo "Foto (URL)" con **vista previa en vivo** en el panel de color de la izquierda; si la URL falla al cargar, cae automaticamente al monograma.
- **Estados de carga:** las tres rutas usan `Suspense` con *skeletons* dedicados (`DashboardSkeleton`, `CatalogSkeleton`, `AuthorDetailSkeleton`) mientras se resuelven las queries a la base de datos — es normal ver un parpadeo breve de la silueta antes del contenido real.
- Si al abrir una ruta ves errores de SQL o de parseo en la consola del navegador que no coinciden con el codigo actual, probablemente es cache vieja de Turbopack: reinicia el servidor de desarrollo (`npm run dev`) o borra la carpeta `.next` y vuelve a intentar.
