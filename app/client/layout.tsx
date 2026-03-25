import Image from "next/image"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar_state")?.value
  const defaultOpen = sidebarState !== "false"

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, avatar_url")
    .eq("id", user.id)
    .single()

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Client"
  const email = profile?.email ?? ""
  const avatar = profile?.avatar_url ?? ""

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="bg-background text-foreground"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={{ name, email, avatar }} />
      <SidebarInset className="overflow-hidden">
        <div className="relative flex flex-1 flex-col">
          {/* Wave spans behind header + top of content */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden"
            aria-hidden="true"
            style={{ height: "420px" }}
          >
            <svg
              viewBox="0 0 1440 420"
              preserveAspectRatio="none"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="client-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#3F51B5" stopOpacity="1" />
                  <stop offset="50%"  stopColor="#3A79C3" stopOpacity="1" />
                  <stop offset="100%" stopColor="#329A9A" stopOpacity="1" />
                </linearGradient>
              </defs>
              {/* Back layer — subtle depth */}
              <path
                d="M0,320 C240,380 480,240 720,320 C960,400 1200,260 1440,320 L1440,0 L0,0 Z"
                fill="url(#client-wave-grad)"
                opacity="0.35"
              />
              {/* Front layer */}
              <path
                d="M0,280 C180,340 360,220 540,280 C720,340 900,220 1080,280 C1260,340 1380,250 1440,280 L1440,0 L0,0 Z"
                fill="url(#client-wave-grad)"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Transparent header floats over the wave */}
          <div className="relative z-10">
            <SiteHeader variant="transparent" user={{ name, email, avatar }} />
          </div>

          {/* Page content */}
          <div className="relative z-10 flex flex-1 flex-col min-h-[calc(100vh-var(--header-height))]">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
