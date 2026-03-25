"use client"

import { usePathname, useRouter } from "next/navigation"
import { IconLogout } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

function getPageTitle(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean).pop() ?? ""
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export function SiteHeader({
  user,
  logoutRedirect = "/",
  variant = "default",
}: {
  user: { name: string; email: string; avatar: string }
  logoutRedirect?: string
  variant?: "default" | "transparent"
}) {
  const pathname = usePathname()
  const router = useRouter()
  const pageTitle = getPageTitle(pathname)
  const isTransparent = variant === "transparent"

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
    <header className={`flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) ${isTransparent ? "border-transparent bg-transparent" : "border-b"}`}>
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className={`-ml-1 ${isTransparent ? "text-white hover:bg-white/20 hover:text-white" : ""}`} />
        <Separator orientation="vertical" className={`mx-2 data-[orientation=vertical]:h-4 ${isTransparent ? "bg-white/30" : ""}`} />
        <h1 className={`text-base font-bold ${isTransparent ? "text-white" : "bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-transparent"}`}>
          {pageTitle}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className={`h-8 w-8 cursor-pointer rounded-lg ring-offset-0 ${isTransparent ? "ring-2 ring-white/40" : ""}`}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={`rounded-lg ${isTransparent ? "bg-white/20 text-white" : ""}`}>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56 rounded-lg" align="end" sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <IconLogout className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
