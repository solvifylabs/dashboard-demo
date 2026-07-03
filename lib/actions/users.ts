"use server"

const DEMO_USERS = [
  { id: "demo-admin-00000000-0000-0000-0000", email: "demo@kibo.com", name: "Demo Admin", role: "admin" as const, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "demo-op-000000000-0000-0000-0000", email: "operador@kibo.com", name: "Demo Operador", role: "operator" as const, is_active: true, created_at: "2025-01-01T00:00:00Z" },
]

export async function getUsers() {
  return DEMO_USERS
}

export async function createUser(_input: { name: string; email: string; password: string; role: "admin" | "operator" }) {
  // no-op in demo
}

export async function toggleUserActive(_id: string, _isActive: boolean) {
  // no-op in demo
}
