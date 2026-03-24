import React from "react"
import Image from "next/image"
import { cookies } from "next/headers"

import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/dashboard/user-sidebar"

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar_state")?.value
  const defaultOpen = sidebarState !== "false"

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <UserSidebar slug={slug} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="relative flex-1">
          <Image
            src="/WaveBG.png"
            alt=""
            width={1440}
            height={320}
            className="absolute top-0 left-0 w-full h-auto"
            priority
          />
          <div className="relative flex min-h-[calc(100vh-var(--header-height))] flex-col">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
