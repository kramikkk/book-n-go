import { ChartBar } from "@/components/chart-bar"
import { ChartPie } from "@/components/chart-pie"
import { DashboardCards } from "@/components/dashboard-cards"
import { UpcomingTable } from "@/components/upcoming-table"
import { getAllBookings } from "@/lib/services/booking-service"

export default async function DashboardPage() {
  const bookings = await getAllBookings()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DashboardCards />
          <div className="flex flex-wrap items-stretch gap-4 px-4 md:gap-6 lg:px-6">
            <div className="min-w-[300px] flex-[2]">
              <ChartBar />
            </div>
            <div className="min-w-[350px] flex-[1]">
              <ChartPie />
            </div>
          </div>
          <div className="px-4 lg:px-6">
            <UpcomingTable bookings={bookings} />
          </div>
        </div>
      </div>
    </div>
  )
}
