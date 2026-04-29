"use client"

import { useState, useEffect, useTransition } from "react"
import {
  getUsers,
  createUser,
  toggleUserActive,
} from "@/lib/actions/users"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, UserCheck, UserX } from "lucide-react"
import { toast } from "sonner"

type AppUser = {
  id: string
  name: string
  email: string
  role: "admin" | "operator"
  is_active: boolean
  created_at: string
}

export function UserManagementPanel() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator" as "admin" | "operator",
  })

  async function loadUsers() {
    try {
      const data = await getUsers()
      setUsers(data ?? [])
    } catch {
      toast.error("No se pudieron cargar los usuarios")
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function handleOpenCreate() {
    setForm({ name: "", email: "", password: "", role: "operator" })
    setDialogOpen(true)
  }

  function handleSubmit() {
    if (!form.name || !form.email || !form.password) return
    startTransition(async () => {
      try {
        await createUser(form)
        toast.success("Usuario creado")
        setDialogOpen(false)
        await loadUsers()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al crear usuario")
      }
    })
  }

  function handleToggle(id: string, currentActive: boolean) {
    startTransition(async () => {
      try {
        await toggleUserActive(id, !currentActive)
        toast.success(currentActive ? "Usuario desactivado" : "Usuario activado")
        await loadUsers()
      } catch {
        toast.error("Error al actualizar usuario")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo usuario
        </Button>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <Card key={user.id} className="bg-card">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="capitalize">
                  {user.role === "admin" ? "Admin" : "Operador"}
                </Badge>
                <Badge
                  variant={user.is_active ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.is_active ? "Activo" : "Inactivo"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={() => handleToggle(user.id, user.is_active)}
                  title={user.is_active ? "Desactivar" : "Activar"}
                >
                  {user.is_active ? (
                    <UserX className="h-4 w-4 text-destructive" />
                  ) : (
                    <UserCheck className="h-4 w-4 text-green-500" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo usuario</DialogTitle>
            <DialogDescription>
              Completá los datos para crear un nuevo acceso al sistema
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="juan@tulocal.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm({ ...form, role: v as "admin" | "operator" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">Operador</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!form.name || !form.email || !form.password || isPending}
              onClick={handleSubmit}
            >
              {isPending ? "Creando..." : "Crear usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
