import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { UserManagementPanel } from "@/components/auth/user-management-panel"

export default async function UsuariosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== "admin") redirect("/")

  return (
    <div className="flex h-screen flex-col">
      <Header title="Usuarios" subtitle="Gestión de accesos al dashboard" />
      <div className="flex-1 overflow-auto py-6">
        <UserManagementPanel />
      </div>
    </div>
  )
}
