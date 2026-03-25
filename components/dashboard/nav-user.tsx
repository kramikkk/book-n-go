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
        <div className="flex w-full items-center gap-3 rounded-md px-2 py-1.5">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-[#3EB09B]">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center justify-center rounded-md p-1.5 text-destructive hover:bg-destructive/10"
          >
            <IconLogout className="size-4" />
          </button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
