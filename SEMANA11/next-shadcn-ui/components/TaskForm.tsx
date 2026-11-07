"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDashboard } from "@/lib/store"
import type { Task, TaskPriority, TaskStatus } from "@/lib/types"
import { formatDisplayDate, parseISODate, toISODate } from "@/lib/date"
import { AlertCircleIcon, CalendarIcon } from "lucide-react"

const emptyForm = {
  description: "",
  projectId: "none",
  status: "Pendiente" as TaskStatus,
  priority: "Media" as TaskPriority,
  userId: "none",
  dateline: "",
  estimatedHours: "4",
}

type FormState = typeof emptyForm

function taskToForm(task: Task): FormState {
  return {
    description: task.description,
    projectId: task.projectId ?? "none",
    status: task.status,
    priority: task.priority,
    userId: task.userId ?? "none",
    dateline: task.dateline,
    estimatedHours: String(task.estimatedHours),
  }
}

export function TaskForm({
  task,
  open,
  onOpenChange,
}: {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { projects, members, addTask, updateTask } = useDashboard()
  const [formData, setFormData] = useState<FormState>(() =>
    task ? taskToForm(task) : emptyForm
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const isEditing = Boolean(task)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.description || !formData.dateline) {
      setError("Completa la descripción y la fecha límite de la tarea.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        description: formData.description,
        projectId: formData.projectId === "none" ? null : formData.projectId,
        status: formData.status,
        priority: formData.priority,
        userId: formData.userId === "none" ? null : formData.userId,
        dateline: formData.dateline,
        estimatedHours: Number(formData.estimatedHours) || 0,
      }
      if (isEditing && task) {
        await updateTask(task.id, payload)
      } else {
        await addTask(payload)
      }
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
            <DialogDescription>
              Completa los datos de la tarea. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>No se pudo guardar</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="task-description">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Input
                id="task-description"
                placeholder="¿Qué hay que hacer?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-project">Proyecto</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectId: value ?? "none" })
                  }
                >
                  <SelectTrigger id="task-project">
                    <SelectValue placeholder="Selecciona un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin proyecto</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">Asignado a</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, userId: value ?? "none" })
                  }
                >
                  <SelectTrigger id="task-assignee">
                    <SelectValue placeholder="Selecciona un miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.userId} value={member.userId}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: (value as TaskStatus) ?? "Pendiente" })
                  }
                >
                  <SelectTrigger id="task-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En progreso">En progreso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: (value as TaskPriority) ?? "Media" })
                  }
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  Fecha límite <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger
                    render={<Button type="button" variant="outline" className="justify-start font-normal" />}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDisplayDate(formData.dateline)}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseISODate(formData.dateline)}
                      onSelect={(date) =>
                        setFormData({ ...formData, dateline: toISODate(date) })
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-hours">Horas estimadas</Label>
                <Input
                  id="task-hours"
                  type="number"
                  min={0}
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Spinner className="mr-2" />}
              {isEditing ? "Guardar Cambios" : "Crear Tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
