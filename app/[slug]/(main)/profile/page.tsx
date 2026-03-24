import { PersonalInformation } from "@/components/dashboard/personal-information"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { ChangePassword } from "@/components/dashboard/change-password"

const ProfilePage = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-wrap items-stretch gap-4 px-4 lg:px-6">
            <div className="flex min-w-[360px] flex-1 flex-col gap-4">
              <ProfileCard />
              <ChangePassword />
            </div>
            <div className="flex min-w-[420px] flex-1 flex-col [&>*]:flex-1">
              <PersonalInformation />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage