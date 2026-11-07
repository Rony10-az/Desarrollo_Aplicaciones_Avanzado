"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useDashboard } from "@/lib/store"
import type { TeamMember } from "@/lib/types"
import { TeamMemberForm } from "@/components/TeamMemberForm"
import { ConfirmDialog, useConfirmDialog } from "@/components/ConfirmDialog"

export function TeamList() {
  const { members, deleteMember } = useDashboard()
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const confirmDelete = useConfirmDialog<TeamMember>()

  const handleAdd = () => {
    setEditingMember(null)
    setFormOpen(true)
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    const member = confirmDelete.target
    if (!member) return
    setDeletingId(member.userId)
    try {
      await deleteMember(member.userId)
      confirmDelete.close()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>
            Gestiona los miembros de tu equipo y sus roles
          </CardDescription>
        </div>
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
          Agregar Miembro
        </Button>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay miembros registrados.
          </p>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.position || member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.isActive ? "Activo" : "Ausente"}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    disabled={deletingId === member.userId}
                    onClick={() => confirmDelete.request(member)}
                  >
                    {deletingId === member.userId && <Spinner className="mr-1" />}
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <TeamMemberForm
        key={formOpen ? editingMember?.userId ?? "new" : "closed"}
        member={editingMember}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={confirmDelete.setOpen}
        title="Eliminar miembro"
        description={`¿Eliminar a ${confirmDelete.target?.name ?? ""} del equipo?`}
        loading={deletingId === confirmDelete.target?.userId}
        onConfirm={handleDelete}
      />
    </Card>
  )
}
