import Image from "next/image"
import { cookies } from "next/headers"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function Layout({ children }: { children: React.ReactNode }) {
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
      <AppSidebar variant="inset" />
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
          <div className="relative">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
