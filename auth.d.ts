import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "admin" | "operator"
    }
  }
  interface User {
    role: "admin" | "operator"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "admin" | "operator"
  }
}
