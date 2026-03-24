import { redirect } from "next/navigation"
import { ChartBar } from "@/components/chart-bar"
import { ChartPie } from "@/components/chart-pie"
import { DashboardCards } from "@/components/dashboard-cards"
import { UpcomingTable } from "@/components/upcoming-table"
import { requireAdmin } from "@/lib/supabase/server"
import { buildStats } from "@/app/api/admin/dashboard/stats"
import { buildBarChart } from "@/app/api/admin/dashboard/bar-chart"
import { buildPieChart } from "@/app/api/admin/dashboard/pie-chart"
import type { RawRow, BookingRow } from "@/app/api/admin/dashboard/types"
import type { Booking } from "@/lib/schemas"

export default async function DashboardPage() {
  const { error, supabase, user } = await requireAdmin()
  if (error) redirect("/")

  // Use UTC for server-side rendering; charts are timezone-aware when the
  // client passes ?tz= via the API route. For the page, UTC is acceptable.
  const tz = "UTC"

  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const dateLimit = oneYearAgo.toISOString().split("T")[0]

  const [{ data, error: dbError }, { count: totalCount }] = await Promise.all([
    supabase
      .from("bookings")
      .select(`id, name, contact, date, time_start, time_end, type, status, created_at,
        profiles!bookings_customer_id_fkey ( id, first_name, last_name, email )`)
      .eq("admin_id", user!.id)
      .gte("date", dateLimit)
      .order("date", { ascending: true })
      .order("time_start", { ascending: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("admin_id", user!.id),
  ])

  if (dbError) {
    // Render with empty data rather than crashing
    return renderDashboard(null, null, null, [])
  }

  const rows: BookingRow[] = ((data ?? []) as RawRow[]).map((b: RawRow) => ({
    id: b.id, name: b.name, contact: b.contact, date: b.date,
    time_start: b.time_start, time_end: b.time_end,
    type: b.type as BookingRow["type"], status: b.status as BookingRow["status"],
    service: null, created_at: b.created_at,
    customer: b.profiles[0] ?? null,
  }))

  const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date())
  const upcoming = rows.filter((b) => b.status === "Pending" && b.date >= todayStr).slice(0, 10)

  const stats = buildStats(rows)
  stats.total = totalCount ?? stats.total

  return renderDashboard(stats, buildBarChart(rows, tz), buildPieChart(rows), upcoming)
}

function renderDashboard(
  stats: { total: number; pending: number; completed: number; canceled: number } | null,
  barChart: unknown,
  pieChart: unknown,
  upcoming: BookingRow[]
) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DashboardCards stats={stats} />
          <div className="flex flex-wrap items-stretch gap-4 px-4 md:gap-6 lg:px-6">
            <div className="min-w-[300px] flex-[2]">
              <ChartBar data={barChart} />
            </div>
            <div className="min-w-[350px] flex-[1]">
              <ChartPie data={pieChart} />
            </div>
          </div>
          <div className="px-4 lg:px-6">
            <UpcomingTable bookings={upcoming as unknown as Booking[]} />
          </div>
        </div>
      </div>
    </div>
  )
}
