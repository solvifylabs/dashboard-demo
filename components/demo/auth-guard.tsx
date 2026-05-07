"use client"

// Auth is handled server-side by middleware.ts (cookie-based).
// This component is kept as a pass-through wrapper.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
