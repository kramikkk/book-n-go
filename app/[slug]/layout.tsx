import React from "react"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { SlugThemeWrapper } from "@/components/landing/slug-theme-wrapper"

export default async function SlugRootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: settings } = await supabase
    .from("settings")
    .select("theme, primary_color")
    .eq("slug", slug)
    .maybeSingle()

  const theme        = (settings?.theme         ?? "system") as "light" | "dark" | "system"
  const primaryColor = settings?.primary_color  ?? "blue"

  return (
    <SlugThemeWrapper theme={theme} primaryColor={primaryColor}>
      {children}
    </SlugThemeWrapper>
  )
}
