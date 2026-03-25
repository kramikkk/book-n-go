"use client"

import * as React from "react"
import {
  IconCalendarClock,
  IconDashboard,
  IconSettings,
  IconUser,
} from "@tabler/icons-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navMain = [
    {
      title: "Dashboard",
      url: "/client/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Bookings",
      url: "/client/bookings",
      icon: IconCalendarClock,
    },
    {
      title: "Profile",
      url: "/client/profile",
      icon: IconUser,
    },
    {
      title: "Settings",
      url: "/client/settings",
      icon: IconSettings,
    },
  ]

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string }
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3 data-[slot=sidebar-menu-button]:!h-auto"
            >
              <a href="#" className="group/logo flex w-full items-center gap-3">
                <Avatar className="h-10 w-10 overflow-hidden rounded-lg border border-[#3A79C3]/30 bg-[#3A79C3]/10 transition-transform duration-200 ease-out group-hover/logo:scale-105">
                  <AvatarImage src="/BNGLogo.png" alt="BookNGo" className="scale-125 object-cover" />
                  <AvatarFallback className="rounded-lg text-sm font-bold text-[#3A79C3]">BG</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col transition-transform duration-200 ease-out group-hover/logo:translate-x-0.5">
                  <span className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-xl font-bold text-transparent">
                    BookNGo
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">Client Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} color="#3A79C3" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
