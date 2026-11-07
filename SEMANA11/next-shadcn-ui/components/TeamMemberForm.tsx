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
import { Switch } from "@/components/ui/switch"
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
import type { TeamMember } from "@/lib/types"
import { formatDisplayDate, parseISODate, toISODate } from "@/lib/date"
import { AlertCircleIcon, CalendarIcon } from "lucide-react"

const emptyForm = {
  name: "",
  email: "",
  role: "",
  position: "",
  phone: "",
  birthdate: "",
  projectId: "none",
  isActive: true,
}

type FormState = typeof emptyForm

function memberToForm(member: TeamMember): FormState {
  return {
    name: member.name,
    email: member.email,
    role: member.role,
    position: member.position,
    phone: member.phone,
    birthdate: member.birthdate,
    projectId: member.projectId ?? "none",
    isActive: member.isActive,
  }
}

export function TeamMemberForm({
  member,
  open,
  onOpenChange,
}: {
  member: TeamMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { projects, addMember, updateMember } = useDashboard()
  const [formData, setFormData] = useState<FormState>(() =>
    member ? memberToForm(member) : emptyForm
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const isEditing = Boolean(member)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.role) {
      setError("Completa el nombre, el correo y el rol del miembro.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        position: formData.position,
        phone: formData.phone,
        birthdate: formData.birthdate,
        projectId: formData.projectId === "none" ? null : formData.projectId,
        isActive: formData.isActive,
      }
      if (isEditing && member) {
        await updateMember(member.userId, payload)
      } else {
        await addMember(payload)
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
            <DialogTitle>
              {isEditing ? "Editar Miembro" : "Agregar Miembro del Equipo"}
            </DialogTitle>
            <DialogDescription>
              Completa los datos del miembro. Click en guardar cuando termines.
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="member-name">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="member-name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="member-email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="member-email"
                  type="email"
                  placeholder="correo@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="member-role">
                  Rol <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="member-role"
                  placeholder="Developer, Designer..."
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="member-position">Puesto</Label>
                <Input
                  id="member-position"
                  placeholder="Frontend Developer"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="member-phone">Teléfono</Label>
                <Input
                  id="member-phone"
                  placeholder="+51 987 654 321"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Fecha de nacimiento</Label>
                <Popover>
                  <PopoverTrigger
                    render={<Button type="button" variant="outline" className="justify-start font-normal" />}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDisplayDate(formData.birthdate)}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseISODate(formData.birthdate)}
                      onSelect={(date) =>
                        setFormData({ ...formData, birthdate: toISODate(date) })
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-project">Proyecto asignado</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) =>
                  setFormData({ ...formData, projectId: value ?? "none" })
                }
              >
                <SelectTrigger id="member-project">
                  <SelectValue placeholder="Sin proyecto asignado" />
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
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="member-active">Miembro activo</Label>
                <p className="text-xs text-muted-foreground">
                  Indica si el miembro está actualmente disponible.
                </p>
              </div>
              <Switch
                id="member-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
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
              {isEditing ? "Guardar Cambios" : "Agregar Miembro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
