# Frontend — Sistema de Ventas (Next.js)

Interfaz web que consume la API del backend (`sistema-ventas/backend`). Usa el
**App Router** de Next.js.

## Estructura

| Carpeta | Qué va aquí |
|---|---|
| `src/app/` | Páginas y rutas de la aplicación (una carpeta = una ruta). |
| `src/components/ui/` | Componentes visuales reutilizables y genéricos (botones, inputs, tablas, modales). Sin lógica de negocio. |
| `src/components/layout/` | Estructura compartida de página: navbar, sidebar, layout del dashboard. |
| `src/services/` | Funciones que llaman a la API del backend (fetch). Un archivo por dominio, espejo de las rutas del backend. |
| `src/hooks/` | Hooks de React reutilizables (ej. `useAuth`, `useFetch`). |
| `src/context/` | Context API de React para estado global (ej. sesión del usuario). |
| `src/lib/` | Utilidades sin estado (formateo de moneda/fechas, wrapper de fetch). |

## Páginas (rutas de la app, NO de la API)

```
/                 → landing / redirección según sesión
/login            → formulario de inicio de sesión
/dashboard        → resumen general tras iniciar sesión
/productos        → listado y gestión de productos
/productos/[id]   → detalle/edición de un producto
/clientes         → listado y gestión de clientes
/ventas           → registrar y listar ventas
```

## Cómo correr

```bash
cp .env.example .env
npm install
npm run dev     # http://localhost:3000
```

El frontend llama al backend usando `process.env.NEXT_PUBLIC_API_URL` y
guarda el JWT recibido en el login para mandarlo en el header
`Authorization: Bearer <token>` de cada petición protegida (ver `src/lib/fetcher.js`
y `src/context/AuthContext.js`).
