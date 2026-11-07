"use client"

import { useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useDashboard } from "@/lib/store"
import type { Task, TaskPriority, TaskStatus } from "@/lib/types"
import { TaskForm } from "@/components/TaskForm"
import { ConfirmDialog, useConfirmDialog } from "@/components/ConfirmDialog"

const PAGE_SIZE = 5

const statusVariant = (status: TaskStatus) => {
  switch (status) {
    case "Completado":
      return "default" as const
    case "En progreso":
      return "secondary" as const
    case "Pendiente":
      return "outline" as const
    default:
      return "outline" as const
  }
}

const priorityVariant = (priority: TaskPriority) => {
  switch (priority) {
    case "Urgente":
      return "destructive" as const
    case "Alta":
      return "default" as const
    case "Media":
      return "secondary" as const
    case "Baja":
      return "outline" as const
    default:
      return "outline" as const
  }
}

export function TasksTable() {
  const { tasks, projects, members, deleteTask } = useDashboard()
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const confirmDelete = useConfirmDialog<Task>()

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageTasks = useMemo(
    () =>
      tasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [tasks, currentPage]
  )

  const projectTitle = (projectId: string | null) =>
    projects.find((p) => p.id === projectId)?.title ?? "Sin proyecto"

  const assigneeName = (userId: string | null) =>
    members.find((m) => m.userId === userId)?.name ?? "Sin asignar"

  const handleAdd = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    const task = confirmDelete.target
    if (!task) return
    setDeletingId(task.id)
    try {
      await deleteTask(task.id)
      confirmDelete.close()
      if (pageTasks.length === 1 && currentPage > 1) {
        setPage(currentPage - 1)
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={handleAdd}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Nueva Tarea
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Página {currentPage} de {totalPages} · {tasks.length} tareas en total
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay tareas registradas.
                </TableCell>
              </TableRow>
            ) : (
              pageTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.description}</TableCell>
                  <TableCell>{projectTitle(task.projectId)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>{assigneeName(task.userId)}</TableCell>
                  <TableCell>{task.dateline}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(task)}>
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={deletingId === task.id}
                      onClick={() => confirmDelete.request(task)}
                    >
                      {deletingId === task.id && <Spinner className="mr-1" />}
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage((p) => Math.max(1, p - 1))
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(p)
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage((p) => Math.min(totalPages, p + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <TaskForm
        key={formOpen ? editingTask?.id ?? "new" : "closed"}
        task={editingTask}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={confirmDelete.setOpen}
        title="Eliminar tarea"
        description={`¿Eliminar la tarea "${confirmDelete.target?.description ?? ""}"?`}
        loading={deletingId === confirmDelete.target?.id}
        onConfirm={handleDelete}
      />
    </div>
  )
}
