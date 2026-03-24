import { IconCalendarClock, IconCircleCheck, IconCircleX, IconClock } from "@tabler/icons-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Stats = { total: number; pending: number; completed: number; canceled: number }

export function DashboardCards({ stats }: { stats: Stats | null }) {
  const s = stats ?? { total: 0, pending: 0, completed: 0, canceled: 0 }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <IconCalendarClock className="size-4 text-violet-500" />
            <CardDescription>Total Bookings</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {s.total}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <IconClock className="size-4 text-amber-500" />
            <CardDescription>Pending</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {s.pending}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <IconCircleCheck className="size-4 text-green-500" />
            <CardDescription>Completed</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {s.completed}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <IconCircleX className="size-4 text-red-500" />
            <CardDescription>Cancelled</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {s.canceled}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
