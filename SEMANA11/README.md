# Semana 11 — Componentes y Estilización

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-components-000000?logo=shadcnui&logoColor=white)

Laboratorio de **Desarrollo de Aplicaciones Web Avanzado**: dos mini-proyectos en Next.js que exploran dos formas distintas de construir una librería de componentes — CSS Modules combinado con Tailwind, y shadcn/ui con lógica de negocio real.

## Contenido

| # | Proyecto | Qué demuestra |
|---|----------|----------------|
| [Ejercicio 1](#ejercicio-1--css-modules--tailwind-css) | [`next-components-styling/`](next-components-styling) | CSS Modules para animaciones + Tailwind para layout |
| [Ejercicio 2 + Tarea](#ejercicio-2--la-tarea--shadcnui) | [`next-shadcn-ui/`](next-shadcn-ui) | Dashboard completo con shadcn/ui y CRUD en memoria |

---

## Ejercicio 1 — CSS Modules + Tailwind CSS

**Carpeta:** [`next-components-styling/`](next-components-styling)

Cuatro componentes reutilizables que muestran cuándo conviene cada herramienta:

| Componente | CSS Modules | Tailwind CSS |
|---|---|---|
| **Button** | Efecto de onda al click, gradientes, spinner de carga | Tamaños, layout, estados `disabled` |
| **Card** | — | Todo el componente (hover, imagen, footer) |
| **Badge** | — | Todo el componente (variantes de color y tamaño) |
| **Input** | Label flotante, animación de error (`shake`) | Estructura, spacing, iconos |

La página [`app/styling`](next-components-styling/src/app/styling/page.tsx) integra los cuatro componentes en un solo layout de demostración.

```bash
cd next-components-styling
npm install
npm run dev
# http://localhost:3000/styling
```

---

## Ejercicio 2 + La Tarea — shadcn/ui

**Carpeta:** [`next-shadcn-ui/`](next-shadcn-ui)

Dashboard de proyectos con datos en memoria (sin backend): crear, editar y eliminar se simulan con una pequeña latencia para imitar una llamada real a una API.

### Secciones del dashboard

- **Resumen** — métricas calculadas en vivo a partir de los datos en memoria (total de proyectos, tareas completadas, horas trabajadas, miembros activos).
- **Proyectos** — creación con selección de miembros del equipo, vista de detalle y eliminación.
- **Equipo** — alta, edición y baja de integrantes (`userId`, `role`, `name`, `email`, `position`, `birthdate`, `phone`, `projectId`, `isActive`).
- **Tareas** — alta, edición y baja con paginación (`description`, `projectId`, `status`, `priority`, `userId`, `dateline`).
- **Configuración** — formulario de preferencias (idioma, zona horaria, notificaciones) con guardado simulado.

### Componentes shadcn/ui usados

`Button` · `Card` · `Input` · `Label` · `Select` · `Dialog` · `Tabs` · `Badge` · `Avatar` · `Table` · `Checkbox` · `Switch` · **`Spinner`** (peticiones simuladas) · **`Alert`** (validación de formularios) · **`Calendar`** (fechas, vía Popover) · **`Pagination`** (tabla de tareas)

### Frontend

- Tema de color violeta/índigo propio (no el gris por defecto de shadcn).
- Página de inicio propia (no la plantilla de `create-next-app`): hero con mini-preview del dashboard y una grilla de tarjetas que abren el dashboard directo en la sección correspondiente (`/dashboard?tab=...`).
- Animaciones de scroll (`IntersectionObserver`, sin dependencias nuevas): las secciones aparecen con fade-in y desplazamiento en cascada a medida que se hace scroll.

```bash
cd next-shadcn-ui
npm install
npm run dev
# http://localhost:3000
```

---

## Estructura

```
SEMANA11/
├── next-components-styling/   # Ejercicio 1
│   └── src/
│       ├── app/styling/        # Página de demostración
│       └── components/
│           ├── ui/              # Button, Badge, Input
│           └── cards/           # Card
└── next-shadcn-ui/             # Ejercicio 2 + La Tarea
    ├── app/
    │   ├── page.tsx              # Landing
    │   └── dashboard/            # Dashboard (tabs: overview/projects/team/tasks/settings)
    ├── components/
    │   ├── ui/                   # Componentes base de shadcn/ui
    │   ├── ProjectForm.tsx       # Crear proyecto
    │   ├── ProjectsGrid.tsx      # Listado + detalle + eliminar
    │   ├── TeamList.tsx / TeamMemberForm.tsx
    │   ├── TasksTable.tsx / TaskForm.tsx
    │   ├── SettingsForm.tsx
    │   ├── ConfirmDialog.tsx     # Confirmación de eliminación
    │   └── Reveal.tsx            # Animaciones de scroll
    └── lib/
        ├── store.tsx             # Estado + CRUD en memoria
        ├── types.ts
        └── date.ts
```

## Notas técnicas

- Ambos proyectos usan **Next.js 16** con Turbopack; esta versión trae cambios importantes respecto a versiones anteriores (Tailwind v4 vía `@tailwindcss/postcss`, CSS Modules nativo de Turbopack, `shadcn/ui` basado en **Base UI** en vez de Radix UI — por ejemplo, `DialogTrigger` usa la prop `render` en lugar de `asChild`).
- El estado de `next-shadcn-ui` vive solo en memoria del navegador: se reinicia a los datos de ejemplo en cada recarga completa de página (no hay persistencia ni backend).
