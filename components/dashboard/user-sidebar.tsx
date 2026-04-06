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
  business,
  logoutRedirect,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  slug: string
  user: { name: string; email: string; avatar: string }
  business?: { name: string; logoUrl: string | null }
  logoutRedirect?: string
}) {
  const initials = (business?.name ?? "BG")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

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
                <Avatar className="h-10 w-10 overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--slug-primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--slug-primary)_10%,transparent)] transition-transform duration-200 ease-out group-hover/logo:scale-105">
                  <AvatarImage src={business?.logoUrl ?? "/BNGLogo.png"} alt={business?.name ?? "BookNGo"} className="scale-125 object-cover" />
                  <AvatarFallback className="rounded-lg text-sm font-bold text-[var(--slug-primary)]">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col transition-transform duration-200 ease-out group-hover/logo:translate-x-0.5">
                  <span className="slug-gradient-text text-xl font-bold">{business?.name ?? "BookNGo"}</span>
                  <span className="text-xs font-medium text-muted-foreground">User Panel</span>
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
