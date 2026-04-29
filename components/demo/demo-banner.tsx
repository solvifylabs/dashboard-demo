"use client"

import { Info } from "lucide-react"

export function DemoBanner() {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-600 dark:text-amber-400">
      <Info className="h-3 w-3 shrink-0" />
      <span className="group-data-[collapsible=icon]:hidden leading-tight">
        Modo Demo — los datos se borran al cerrar la pestaña
      </span>
    </div>
  )
}
