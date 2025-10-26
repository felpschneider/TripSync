"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon,
  WalletIcon,
  MapIcon,
  CheckSquareIcon,
  UsersIcon,
  BellIcon,
  MessageSquareIcon,
} from "lucide-react"

interface TripNavProps {
  tripId: string
}

export function TripNav({ tripId }: TripNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: `/trips/${tripId}`,
      label: "Painel",
      icon: LayoutDashboardIcon,
    },
    {
      href: `/trips/${tripId}/expenses`,
      label: "Despesas",
      icon: WalletIcon,
    },
    {
      href: `/trips/${tripId}/proposals`,
      label: "Propostas",
      icon: MapIcon,
    },
    {
      href: `/trips/${tripId}/tasks`,
      label: "Tarefas",
      icon: CheckSquareIcon,
    },
    {
      href: `/trips/${tripId}/chat`,
      label: "Chat",
      icon: MessageSquareIcon,
    },
    {
      href: `/trips/${tripId}/members`,
      label: "Membros",
      icon: UsersIcon,
    },
    {
      href: `/trips/${tripId}/activity`,
      label: "Atividades",
      icon: BellIcon,
    },
  ]

  return (
    <nav className="border-b bg-card overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
