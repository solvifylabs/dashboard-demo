"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DemoBanner } from "@/components/demo/demo-banner"
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  UtensilsCrossed,
  Plus,
  DollarSign,
  Component,
  User,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Pacifico, Baloo_2 } from "next/font/google"

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700"],
})

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
})

const navigation = [
  { name: "Pedidos",      href: "/",          icon: LayoutDashboard, adminOnly: false, operatorBlocked: false },
  { name: "Historial",   href: "/orders",     icon: ClipboardList,   adminOnly: false, operatorBlocked: false },
  { name: "Rendimiento", href: "/analytics",  icon: BarChart3,       adminOnly: false, operatorBlocked: true  },
  { name: "Clientes",    href: "/clientes",   icon: User,            adminOnly: false, operatorBlocked: true  },
  { name: "Menú",        href: "/menu",       icon: UtensilsCrossed, adminOnly: false, operatorBlocked: false },
  { name: "Combos",      href: "/combos",     icon: Component,       adminOnly: false, operatorBlocked: false },
  { name: "Extras",      href: "/extras",     icon: Plus,            adminOnly: false, operatorBlocked: false },
  { name: "Precios",     href: "/pricing",    icon: DollarSign,      adminOnly: false, operatorBlocked: true  },
  { name: "Usuarios",    href: "/usuarios",   icon: Users,           adminOnly: true,  operatorBlocked: false },
]

export function AppSidebar({ role }: { role?: "admin" | "operator" }) {
  const pathname = usePathname()

  const visibleNav = navigation.filter((item) => {
    if (item.adminOnly && role !== "admin") return false
    if (item.operatorBlocked && role === "operator") return false
    return true
  })

  return (
    <Sidebar collapsible="icon" variant="floating" className="ios-sidebar">
      <SidebarHeader className="pb-0">
        <div className="flex items-center gap-3 px-1 py-2">
          <Image
            src="/dishflow.png"
            alt="Logo"
            width={64}
            height={64}
            className="rounded-full bg-black shrink-0"
          />
          <div
            className="
              flex flex-col leading-tight
              transition-all duration-200
              group-data-[collapsible=icon]:hidden
            "
          >
            <span className={cn(baloo.className, "text-lg font-bold tracking-wide")}>
              Dishflow
            </span>
     
          </div>
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <DemoBanner />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "rounded-xl transition-all duration-200",
                        isActive && "bg-sidebar-accent font-medium",
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
