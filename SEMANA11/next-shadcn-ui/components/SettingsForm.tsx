"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDashboard } from "@/lib/store"
import { CheckCircle2Icon } from "lucide-react"

export function SettingsForm() {
  const { settings, updateSettings } = useDashboard()
  const [formData, setFormData] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateSettings(formData)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {saved && (
        <Alert>
          <CheckCircle2Icon className="h-4 w-4" />
          <AlertTitle>Configuración guardada</AlertTitle>
          <AlertDescription>
            Tus preferencias se actualizaron correctamente (simulado en memoria).
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-2">
        <Label htmlFor="settings-company">Nombre de la empresa</Label>
        <Input
          id="settings-company"
          value={formData.companyName}
          onChange={(e) => {
            setSaved(false)
            setFormData({ ...formData, companyName: e.target.value })
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="settings-language">Idioma</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => {
              setSaved(false)
              setFormData({ ...formData, language: (value as "es" | "en") ?? "es" })
            }}
          >
            <SelectTrigger id="settings-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="settings-timezone">Zona horaria</Label>
          <Select
            value={formData.timezone}
            onValueChange={(value) => {
              setSaved(false)
              setFormData({ ...formData, timezone: value ?? formData.timezone })
            }}
          >
            <SelectTrigger id="settings-timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/Lima">América/Lima (UTC-5)</SelectItem>
              <SelectItem value="America/Bogota">América/Bogotá (UTC-5)</SelectItem>
              <SelectItem value="America/Mexico_City">América/Ciudad de México (UTC-6)</SelectItem>
              <SelectItem value="Europe/Madrid">Europa/Madrid (UTC+1)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label htmlFor="settings-email">Notificaciones por correo</Label>
          <p className="text-xs text-muted-foreground">
            Recibe un correo cuando se te asigne una tarea.
          </p>
        </div>
        <Switch
          id="settings-email"
          checked={formData.emailNotifications}
          onCheckedChange={(checked) => {
            setSaved(false)
            setFormData({ ...formData, emailNotifications: checked })
          }}
        />
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label htmlFor="settings-digest">Resumen semanal</Label>
          <p className="text-xs text-muted-foreground">
            Recibe un resumen de la actividad de tus proyectos cada semana.
          </p>
        </div>
        <Switch
          id="settings-digest"
          checked={formData.weeklyDigest}
          onCheckedChange={(checked) => {
            setSaved(false)
            setFormData({ ...formData, weeklyDigest: checked })
          }}
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving && <Spinner className="mr-2" />}
        Guardar Configuración
      </Button>
    </form>
  )
}
