"use client"

import { useRouter } from "next/navigation"
import { IconLogout } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavUser({
  user,
  logoutRedirect = "/",
}: {
  user: { name: string; email: string; avatar: string }
  logoutRedirect?: string
}) {
  const router = useRouter()

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push(logoutRedirect)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="group/user flex w-full items-center gap-3 rounded-md px-2 py-1.5 transition-colors duration-200 hover:bg-sidebar-accent">
          <Avatar className="h-8 w-8 shrink-0 rounded-lg border border-[color-mix(in_srgb,var(--slug-primary)_25%,transparent)] transition-transform duration-200 group-hover/user:scale-105">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-foreground">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center justify-center rounded-md p-1.5 text-destructive opacity-0 transition-all duration-200 hover:bg-destructive/10 group-hover/user:opacity-100"
          >
            <IconLogout className="size-4 transition-transform duration-200 hover:scale-110" />
          </button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
