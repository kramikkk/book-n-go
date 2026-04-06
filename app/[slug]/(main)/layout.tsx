import React from "react"
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

  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, last_name, email, avatar_url")
      .eq("id", user.id)
      .single(),
    supabase
      .from("settings")
      .select("business_name, logo_url")
      .eq("slug", slug)
      .maybeSingle(),
  ])

  const name         = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Customer"
  const email        = profile?.email ?? ""
  const avatar       = profile?.avatar_url ?? ""
  const businessName = settings?.business_name || slug.replace(/-/g, " ")
  const logoUrl      = settings?.logo_url ?? null

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
      <UserSidebar slug={slug} user={{ name, email, avatar }} business={{ name: businessName, logoUrl }} logoutRedirect={`/${slug}`} variant="inset" />
      <SidebarInset className="overflow-hidden">
        {/* Wrapper is relative so the absolute wave is scoped to this area */}
        <div className="relative flex flex-1 flex-col">

          {/* Wave spans behind header + top of content */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden"
            aria-hidden="true"
            style={{ height: "280px" }}
          >
            <svg
              viewBox="0 0 1440 280"
              preserveAspectRatio="none"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="slug-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="var(--slug-primary)"      stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--slug-primary-dark)" stopOpacity="1" />
                </linearGradient>
              </defs>
              {/* Back layer — subtle depth */}
              <path
                d="M0,200 C240,260 480,120 720,200 C960,280 1200,140 1440,200 L1440,0 L0,0 Z"
                fill="url(#slug-wave-grad)"
                opacity="0.35"
              />
              {/* Front layer */}
              <path
                d="M0,160 C180,220 360,100 540,160 C720,220 900,100 1080,160 C1260,220 1380,130 1440,160 L1440,0 L0,0 Z"
                fill="url(#slug-wave-grad)"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Transparent header floats over the wave */}
          <div className="relative z-10">
            <SiteHeader variant="transparent" user={{ name, email, avatar }} logoutRedirect={`/${slug}`} />
          </div>

          {/* Page content — sits below the wave */}
          <div className="relative z-10 flex flex-1 flex-col min-h-[calc(100vh-var(--header-height))]">
            {children}
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
