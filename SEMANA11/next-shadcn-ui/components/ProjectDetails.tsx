"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDashboard } from "@/lib/store"
import type { Project } from "@/lib/types"

const categoryLabels: Record<string, string> = {
  web: "Desarrollo Web",
  mobile: "Desarrollo Mobile",
  design: "Diseño",
  marketing: "Marketing",
  other: "Otro",
}

const priorityLabels: Record<string, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
}

export function ProjectDetails({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { members } = useDashboard()

  if (!project) return null

  const projectMembers = members.filter((m) =>
    project.memberIds.includes(m.userId)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>{project.description || "Sin descripción."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{categoryLabels[project.category] ?? project.category}</Badge>
            <Badge variant="outline">Prioridad: {priorityLabels[project.priority] ?? project.priority}</Badge>
            <Badge
              variant={
                project.status === "Completado"
                  ? "default"
                  : project.status === "En revisión"
                  ? "secondary"
                  : "outline"
              }
            >
              {project.status}
            </Badge>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">
              Miembros del equipo ({projectMembers.length})
            </p>
            {projectMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Este proyecto aún no tiene miembros asignados.
              </p>
            ) : (
              <div className="grid gap-2">
                {projectMembers.map((member) => (
                  <div key={member.userId} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
