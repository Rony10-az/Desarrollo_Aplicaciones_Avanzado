export type ProjectStatus = "Planificado" | "En progreso" | "En revisión" | "Completado"

export interface Project {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  status: ProjectStatus
  progress: number
  memberIds: string[]
}

export interface TeamMember {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string | null
  isActive: boolean
}

export type TaskStatus = "Pendiente" | "En progreso" | "Completado"
export type TaskPriority = "Baja" | "Media" | "Alta" | "Urgente"

export interface Task {
  id: string
  description: string
  projectId: string | null
  status: TaskStatus
  priority: TaskPriority
  userId: string | null
  dateline: string
  estimatedHours: number
}

export interface DashboardSettings {
  companyName: string
  language: "es" | "en"
  timezone: string
  emailNotifications: boolean
  weeklyDigest: boolean
}
