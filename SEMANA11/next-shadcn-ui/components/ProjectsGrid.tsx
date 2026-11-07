"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useDashboard } from "@/lib/store"
import type { Project } from "@/lib/types"
import { ProjectDetails } from "@/components/ProjectDetails"
import { ConfirmDialog, useConfirmDialog } from "@/components/ConfirmDialog"

export function ProjectsGrid() {
  const { projects, deleteProject } = useDashboard()
  const [detailsProject, setDetailsProject] = useState<Project | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const confirmDelete = useConfirmDialog<Project>()

  const handleDelete = async () => {
    const project = confirmDelete.target
    if (!project) return
    setDeletingId(project.id)
    try {
      await deleteProject(project.id)
      confirmDelete.close()
    } finally {
      setDeletingId(null)
    }
  }

  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay proyectos. Crea el primero con el botón &quot;Nuevo Proyecto&quot;.
      </p>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
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
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {project.memberIds.length} miembros
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDetailsProject(project)
                        setDetailsOpen(true)
                      }}
                    >
                      Ver detalles
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={deletingId === project.id}
                      onClick={() => confirmDelete.request(project)}
                    >
                      {deletingId === project.id && <Spinner className="mr-1" />}
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ProjectDetails
        project={detailsProject}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={confirmDelete.setOpen}
        title="Eliminar proyecto"
        description={`¿Eliminar el proyecto "${confirmDelete.target?.title ?? ""}"? Esta acción no se puede deshacer.`}
        loading={deletingId === confirmDelete.target?.id}
        onConfirm={handleDelete}
      />
    </>
  )
}
