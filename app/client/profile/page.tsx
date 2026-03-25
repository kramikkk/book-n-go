import { redirect } from "next/navigation"
import { PersonalInformation } from "@/components/dashboard/personal-information"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { ChangePassword } from "@/components/dashboard/change-password"
import { createClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, middle_name, last_name, email, phone, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-wrap items-stretch gap-4 px-4 lg:px-6">
            <div className="flex min-w-[360px] flex-1 flex-col gap-4">
              <ProfileCard avatarUrl={profile?.avatar_url ?? null} />
              <ChangePassword />
            </div>
            <div className="flex min-w-[420px] flex-1 flex-col [&>*]:flex-1">
              <PersonalInformation profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
