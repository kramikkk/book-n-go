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
      <SidebarInset>
        <SiteHeader user={{ name, email, avatar }} />
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
