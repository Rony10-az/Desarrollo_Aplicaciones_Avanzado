"use client"

import * as React from "react"
import type {
  DashboardSettings,
  Project,
  Task,
  TeamMember,
} from "@/lib/types"

const SIMULATED_DELAY = 700

function delay(ms = SIMULATED_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

const initialMembers: TeamMember[] = [
  {
    userId: "usr-maria",
    role: "Developer",
    name: "María García",
    email: "maria@example.com",
    position: "Frontend Developer",
    birthdate: "1996-03-12",
    phone: "+51 987 111 222",
    projectId: "proj-ecommerce",
    isActive: true,
  },
  {
    userId: "usr-juan",
    role: "Developer",
    name: "Juan Pérez",
    email: "juan@example.com",
    position: "Backend Developer",
    birthdate: "1993-07-22",
    phone: "+51 987 222 333",
    projectId: "proj-api",
    isActive: true,
  },
  {
    userId: "usr-ana",
    role: "Designer",
    name: "Ana López",
    email: "ana@example.com",
    position: "UI/UX Designer",
    birthdate: "1998-01-05",
    phone: "+51 987 333 444",
    projectId: "proj-mobile",
    isActive: false,
  },
  {
    userId: "usr-carlos",
    role: "DevOps",
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    position: "DevOps Engineer",
    birthdate: "1991-11-30",
    phone: "+51 987 444 555",
    projectId: "proj-api",
    isActive: true,
  },
  {
    userId: "usr-laura",
    role: "Manager",
    name: "Laura Martínez",
    email: "laura@example.com",
    position: "Project Manager",
    birthdate: "1989-05-18",
    phone: "+51 987 555 666",
    projectId: null,
    isActive: true,
  },
]

const initialProjects: Project[] = [
  {
    id: "proj-ecommerce",
    title: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js",
    category: "web",
    priority: "high",
    status: "En progreso",
    progress: 65,
    memberIds: ["usr-maria", "usr-juan"],
  },
  {
    id: "proj-mobile",
    title: "Mobile App",
    description: "Aplicación móvil con React Native",
    category: "mobile",
    priority: "medium",
    status: "En revisión",
    progress: 90,
    memberIds: ["usr-ana"],
  },
  {
    id: "proj-dashboard",
    title: "Dashboard Analytics",
    description: "Panel de análisis con visualizaciones",
    category: "web",
    priority: "low",
    status: "Planificado",
    progress: 20,
    memberIds: ["usr-laura"],
  },
  {
    id: "proj-api",
    title: "API Gateway",
    description: "Microservicios con Node.js",
    category: "web",
    priority: "high",
    status: "En progreso",
    progress: 45,
    memberIds: ["usr-juan", "usr-carlos"],
  },
  {
    id: "proj-design",
    title: "Design System",
    description: "Librería de componentes reutilizables",
    category: "design",
    priority: "medium",
    status: "Completado",
    progress: 100,
    memberIds: ["usr-maria"],
  },
  {
    id: "proj-marketing",
    title: "Marketing Website",
    description: "Sitio web institucional",
    category: "marketing",
    priority: "medium",
    status: "En progreso",
    progress: 75,
    memberIds: ["usr-ana", "usr-laura"],
  },
]

const initialTasks: Task[] = [
  { id: "task-1", description: "Implementar autenticación", projectId: "proj-ecommerce", status: "En progreso", priority: "Alta", userId: "usr-maria", dateline: "2025-11-15", estimatedHours: 8 },
  { id: "task-2", description: "Diseñar pantalla de perfil", projectId: "proj-mobile", status: "Pendiente", priority: "Media", userId: "usr-ana", dateline: "2025-11-20", estimatedHours: 5 },
  { id: "task-3", description: "Configurar CI/CD", projectId: "proj-api", status: "Completado", priority: "Alta", userId: "usr-carlos", dateline: "2025-11-10", estimatedHours: 6 },
  { id: "task-4", description: "Optimizar queries SQL", projectId: "proj-ecommerce", status: "En progreso", priority: "Urgente", userId: "usr-juan", dateline: "2025-11-12", estimatedHours: 10 },
  { id: "task-5", description: "Documentar API endpoints", projectId: "proj-api", status: "Pendiente", priority: "Baja", userId: "usr-laura", dateline: "2025-11-25", estimatedHours: 3 },
  { id: "task-6", description: "Diseñar sistema de componentes", projectId: "proj-design", status: "Completado", priority: "Media", userId: "usr-maria", dateline: "2025-10-30", estimatedHours: 12 },
  { id: "task-7", description: "Revisar accesibilidad del sitio", projectId: "proj-marketing", status: "Pendiente", priority: "Baja", userId: "usr-ana", dateline: "2025-11-18", estimatedHours: 4 },
  { id: "task-8", description: "Configurar analíticas", projectId: "proj-dashboard", status: "En progreso", priority: "Media", userId: "usr-laura", dateline: "2025-11-22", estimatedHours: 6 },
  { id: "task-9", description: "Migrar base de datos", projectId: "proj-api", status: "Pendiente", priority: "Urgente", userId: "usr-carlos", dateline: "2025-11-14", estimatedHours: 9 },
  { id: "task-10", description: "Pruebas de carga", projectId: "proj-ecommerce", status: "Pendiente", priority: "Alta", userId: "usr-juan", dateline: "2025-11-28", estimatedHours: 7 },
  { id: "task-11", description: "Diseñar landing page", projectId: "proj-marketing", status: "En progreso", priority: "Media", userId: "usr-maria", dateline: "2025-11-19", estimatedHours: 5 },
  { id: "task-12", description: "Integrar pasarela de pagos", projectId: "proj-ecommerce", status: "Pendiente", priority: "Urgente", userId: "usr-juan", dateline: "2025-12-01", estimatedHours: 11 },
  { id: "task-13", description: "Capacitar al equipo", projectId: "proj-design", status: "Completado", priority: "Baja", userId: "usr-laura", dateline: "2025-11-05", estimatedHours: 2 },
]

const initialSettings: DashboardSettings = {
  companyName: "Acme Studio",
  language: "es",
  timezone: "America/Lima",
  emailNotifications: true,
  weeklyDigest: false,
}

interface DashboardContextValue {
  projects: Project[]
  members: TeamMember[]
  tasks: Task[]
  settings: DashboardSettings
  addProject: (
    data: Omit<Project, "id" | "status" | "progress">
  ) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addMember: (data: Omit<TeamMember, "userId">) => Promise<void>
  updateMember: (
    userId: string,
    data: Omit<TeamMember, "userId">
  ) => Promise<void>
  deleteMember: (userId: string) => Promise<void>
  addTask: (data: Omit<Task, "id">) => Promise<void>
  updateTask: (id: string, data: Omit<Task, "id">) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  updateSettings: (data: DashboardSettings) => Promise<void>
}

const DashboardContext = React.createContext<DashboardContextValue | null>(
  null
)

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects)
  const [members, setMembers] = React.useState<TeamMember[]>(initialMembers)
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [settings, setSettings] =
    React.useState<DashboardSettings>(initialSettings)

  const addProject = React.useCallback(
    async (data: Omit<Project, "id" | "status" | "progress">) => {
      await delay()
      setProjects((prev) => [
        ...prev,
        { ...data, id: generateId("proj"), status: "Planificado", progress: 0 },
      ])
    },
    []
  )

  const deleteProject = React.useCallback(async (id: string) => {
    await delay(400)
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
  }, [])

  const addMember = React.useCallback(
    async (data: Omit<TeamMember, "userId">) => {
      await delay()
      setMembers((prev) => [...prev, { ...data, userId: generateId("usr") }])
    },
    []
  )

  const updateMember = React.useCallback(
    async (userId: string, data: Omit<TeamMember, "userId">) => {
      await delay()
      setMembers((prev) =>
        prev.map((m) => (m.userId === userId ? { ...data, userId } : m))
      )
    },
    []
  )

  const deleteMember = React.useCallback(async (userId: string) => {
    await delay(400)
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
  }, [])

  const addTask = React.useCallback(async (data: Omit<Task, "id">) => {
    await delay()
    setTasks((prev) => [...prev, { ...data, id: generateId("task") }])
  }, [])

  const updateTask = React.useCallback(
    async (id: string, data: Omit<Task, "id">) => {
      await delay()
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...data, id } : t)))
    },
    []
  )

  const deleteTask = React.useCallback(async (id: string) => {
    await delay(400)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateSettings = React.useCallback(
    async (data: DashboardSettings) => {
      await delay()
      setSettings(data)
    },
    []
  )

  const value = React.useMemo<DashboardContextValue>(
    () => ({
      projects,
      members,
      tasks,
      settings,
      addProject,
      deleteProject,
      addMember,
      updateMember,
      deleteMember,
      addTask,
      updateTask,
      deleteTask,
      updateSettings,
    }),
    [
      projects,
      members,
      tasks,
      settings,
      addProject,
      deleteProject,
      addMember,
      updateMember,
      deleteMember,
      addTask,
      updateTask,
      deleteTask,
      updateSettings,
    ]
  )

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = React.useContext(DashboardContext)
  if (!ctx) {
    throw new Error("useDashboard debe usarse dentro de DashboardProvider")
  }
  return ctx
}
