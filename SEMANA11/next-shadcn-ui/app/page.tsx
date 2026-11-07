import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Settings,
  Users,
} from "lucide-react"
import { Reveal } from "@/components/Reveal"

const connections = [
  {
    tab: "projects",
    title: "Proyectos",
    description: "Crea proyectos, asigna miembros y sigue el avance de cada uno.",
    icon: FolderKanban,
  },
  {
    tab: "team",
    title: "Equipo",
    description: "Altas, bajas y disponibilidad de cada integrante.",
    icon: Users,
  },
  {
    tab: "tasks",
    title: "Tareas",
    description: "Pendientes con fecha límite, prioridad y responsable.",
    icon: ListChecks,
  },
  {
    tab: "settings",
    title: "Configuración",
    description: "Idioma, zona horaria y notificaciones del equipo.",
    icon: Settings,
  },
]

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              P
            </span>
            <span className="text-sm font-medium tracking-tight">Panel de Proyectos</span>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground active:translate-y-px"
          >
            Ir al Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <p className="text-sm font-medium text-primary">Gestión de proyectos</p>
            <h1 className="mt-3 max-w-lg text-4xl font-semibold tracking-tighter leading-none text-foreground md:text-6xl">
              Organiza tu equipo sin perder el hilo.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Un solo lugar para repartir tareas, revisar el avance de cada proyecto
              y saber quién está disponible esta semana.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:translate-y-px"
              >
                Abrir Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#conexiones"
                className="inline-flex h-11 items-center gap-2 rounded-lg border px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Ver secciones
              </a>
            </div>
          </div>

          {/* Decorative live preview */}
          <div className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-150">
            <div className="rounded-[1.75rem] border bg-card p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resumen</span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  En vivo
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Proyectos activos</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">18</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Tareas al día</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">76%</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Equipo activo</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">11</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Horas esta semana</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">214h</p>
                </div>
              </div>
              <div className="mt-4 flex h-14 items-end gap-1.5 rounded-xl border p-3">
                {[30, 55, 40, 70, 48, 85, 62, 38, 72, 50].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      height: `${h}%`,
                      transformOrigin: "bottom",
                      animation: "bar-grow 0.6s cubic-bezier(0.16,1,0.3,1) both",
                      animationDelay: `${300 + i * 60}ms`,
                    }}
                    className="flex-1 rounded-sm bg-primary/70"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <a
          href="#conexiones"
          aria-label="Ver secciones"
          className="mx-auto mt-16 flex w-fit items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown
            className="h-5 w-5"
            style={{ animation: "scroll-cue 1.8s ease-in-out infinite" }}
          />
        </a>
      </section>

      {/* Conexiones */}
      <section id="conexiones" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Todo lo que necesitas, conectado
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Entra directo a la sección que te interesa del dashboard.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {/* Large feature tile */}
            <Reveal className="sm:col-span-2 md:col-span-2 md:row-span-2">
              <Link
                href="/dashboard?tab=overview"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] active:scale-[0.98]"
              >
                <div>
                  <LayoutDashboard className="h-7 w-7 text-primary" strokeWidth={1.5} />
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">Resumen general</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Métricas en vivo de proyectos, tareas completadas, horas trabajadas
                    y disponibilidad del equipo, calculadas en tiempo real.
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Ver métricas
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>

            {connections.map((item, index) => (
              <Reveal key={item.tab} delay={(index + 1) * 90}>
                <Link
                  href={`/dashboard?tab=${item.tab}`}
                  className="group flex h-full flex-col justify-between rounded-[1.75rem] border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] active:scale-[0.98]"
                >
                  <div>
                    <item.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    <h3 className="mt-4 text-base font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Abrir
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
          Laboratorio de componentes con shadcn/ui.
        </div>
      </footer>
    </div>
  )
}
