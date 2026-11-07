# next-shadcn-ui

Ejercicio 2 y "La Tarea" de la Semana 11 — dashboard de proyectos construido con **shadcn/ui**, con CRUD completo en memoria (sin backend). Ver el [README general](../README.md) para el contexto completo del laboratorio.

## Qué incluye

- **Resumen** — métricas calculadas en vivo desde los datos en memoria.
- **Proyectos** — crear (con selección de miembros), ver detalle, eliminar.
- **Equipo** — alta, edición y baja de integrantes.
- **Tareas** — alta, edición, baja y paginación.
- **Configuración** — formulario de preferencias con guardado simulado.
- Componentes shadcn/ui: `Spinner`, `Alert`, `Calendar`, `Pagination`, `Popover`, además de los de la base (`Dialog`, `Tabs`, `Select`, `Table`, `Checkbox`, `Switch`, etc.).
- Página de inicio propia con hero, grilla de conexiones al dashboard y animaciones de scroll.

## Ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> El estado vive solo en memoria del navegador: se reinicia a los datos de ejemplo en cada recarga completa de página.
