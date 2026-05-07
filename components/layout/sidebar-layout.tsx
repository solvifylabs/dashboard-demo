"use client"

import type React from "react"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { useRef } from "react"
import { AppSidebar } from "./sidebar"

export function SidebarLayout({
  children,
  role,
}: Readonly<{
  children: React.ReactNode
  role?: "admin" | "operator"
}>) {
  const { setOpen, isMobile } = useSidebar()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const canHover = () =>
    !isMobile && window.matchMedia("(hover: hover)").matches

  const handleMouseOver = () => {
    if (!canHover()) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseOut = (e: React.MouseEvent) => {
    if (!canHover()) return
    // Only close when the cursor is truly leaving the entire sidebar tree
    // (includes the fixed container which is a DOM descendant but outside the box)
    const related = e.relatedTarget as Node | null
    if (related && e.currentTarget.contains(related)) return
    timeoutRef.current = setTimeout(() => setOpen(false), 250)
  }

  return (
    <>
      <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <AppSidebar role={role} />
      </div>
      <SidebarInset>
        <main className="flex flex-1 min-h-0 flex-col p-4 md:p-2 container mx-auto">
          {children}
        </main>
      </SidebarInset>
    </>
  )
}
