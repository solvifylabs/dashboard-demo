import type React from "react"
import { QueryProvider } from "@/components/providers/query-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "sonner"
import { DemoPrintModal } from "@/components/demo/print-modal"
import { DemoTourOverlay } from "@/components/demo/tour-overlay"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = "admin" as const

  return (
    <ThemeProvider>
      <QueryProvider>
        <SidebarProvider defaultOpen={false}>
          <SidebarLayout role={role}>{children}</SidebarLayout>
          <Toaster richColors position="top-right" />
          <DemoPrintModal />
          <DemoTourOverlay />
        </SidebarProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
