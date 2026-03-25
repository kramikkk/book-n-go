import React from "react"
import Image from "next/image"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/dashboard/user-sidebar"
import { createClient } from "@/lib/supabase/server"

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

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${slug}`)

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, avatar_url")
    .eq("id", user.id)
    .single()

  const name   = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Customer"
  const email  = profile?.email ?? ""
  const avatar = profile?.avatar_url ?? ""

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
      <UserSidebar slug={slug} user={{ name, email, avatar }} logoutRedirect={`/${slug}`} variant="inset" />
      <SidebarInset>
        <SiteHeader user={{ name, email, avatar }} logoutRedirect={`/${slug}`} />
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
