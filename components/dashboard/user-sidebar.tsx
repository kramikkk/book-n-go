"use client"

import * as React from "react"
import {
  IconCalendarClock,
  IconCalendarCheck,
  IconHistory,
  IconDashboard,
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

function getNavItems(slug: string) {
  return [
    {
      title: "Book Now",
      url: `/${slug}/book-now`,
      icon: IconCalendarClock,
    },
    {
      title: "My Booking",
      url: `/${slug}/my-booking`,
      icon: IconCalendarCheck,
    },
    {
      title: "History",
      url: `/${slug}/history`,
      icon: IconHistory,
    },
    {
      title: "Profile",
      url: `/${slug}/profile`,
      icon: IconUser,
    },
  ]
}

export function UserSidebar({
  slug,
  user,
  logoutRedirect,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  slug: string
  user: { name: string; email: string; avatar: string }
  logoutRedirect?: string
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
              <a href="#" className="flex w-full items-center gap-3">
                <Avatar className="h-20 w-20 overflow-hidden rounded-xl">
                  <AvatarImage src="/BNGLogo.png" alt="BookNGo" className="scale-125 object-cover" />
                  <AvatarFallback className="rounded-xl text-base">BG</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-3xl font-bold text-transparent">
                    BookNGo
                  </span>
                  <span className="text-base font-semibold text-[#3EB09B]">User Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavItems(slug)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logoutRedirect={logoutRedirect} />
      </SidebarFooter>
    </Sidebar>
  )
}
