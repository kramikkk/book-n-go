import { redirect } from "next/navigation"
import { WebsiteConfiguration } from "@/components/dashboard/website-configuration"
import { BusinessProfile } from "@/components/dashboard/business-profile"
import { ChangeTheme } from "@/components/dashboard/change-theme"
import { ServicesManager } from "@/components/dashboard/services-manager"
import { createClient } from "@/lib/supabase/server"

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: settings } = await supabase
    .from("settings")
    .select("slug, welcome_message, seo_title, seo_description, business_name, logo_url, primary_color, theme")
    .eq("client_id", user.id)
    .maybeSingle()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-wrap items-stretch gap-4 px-4 lg:px-6">
            <div className="flex min-w-[420px] flex-1 flex-col [&>*]:flex-1">
              <WebsiteConfiguration settings={settings} />
            </div>
            <div className="flex min-w-[360px] flex-1 flex-col gap-4 [&>*]:flex-1">
              <BusinessProfile businessName={settings?.business_name ?? ""} logoUrl={settings?.logo_url ?? null} />
              <ChangeTheme primaryColor={settings?.primary_color ?? "blue"} theme={settings?.theme ?? "system"} />
            </div>
            <div className="flex min-w-[360px] flex-1 flex-col [&>*]:flex-1">
              <ServicesManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
