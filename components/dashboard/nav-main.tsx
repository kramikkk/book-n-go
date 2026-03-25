"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Icon } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  color = "var(--slug-primary)",
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
  color?: string
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarSeparator/>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "group border-l-2 !transition-all !duration-200 !ease-out",
                    isActive
                      ? "rounded-l-none hover:opacity-90"
                      : "border-transparent hover:border-l-2"
                  )}
                  style={isActive ? {
                    borderLeftColor: color,
                    backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 15%, transparent)`,
                  } : undefined}
                >
                  <Link href={item.url}>
                    {item.icon && (
                      <item.icon
                        className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                        style={{ color: isActive ? color : undefined }}
                      />
                    )}
                    <span
                      style={{ color: isActive ? color : undefined }}
                      className="font-semibold transition-colors duration-200"
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
