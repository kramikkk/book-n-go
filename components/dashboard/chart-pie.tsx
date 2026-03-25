"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { IconChartPie } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PieChartData } from "@/app/api/client/dashboard/types"

const chartConfig = {
  count: {
    label: "Bookings",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-2)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartPie({ data }: { data?: PieChartData | null }) {
  const [filter, setFilter] = React.useState<"reservation" | "appointment">("reservation")

  const chartData = data?.[filter] ?? []

  const totalBookings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  return (
    <Card className="flex h-[400px] flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="flex items-center gap-2">
          <IconChartPie className="size-4 text-blue-500" />
          <h1 className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">Distribution</h1>
        </CardTitle>
        <Select value={filter} onValueChange={(v) => setFilter(v as "reservation" | "appointment")}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reservation">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-[2px]" style={{ backgroundColor: "var(--chart-1)" }} />
                Reservation
              </span>
            </SelectItem>
            <SelectItem value="appointment">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-[2px]" style={{ backgroundColor: "var(--chart-2)" }} />
                Appointment
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {totalBookings === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <IconChartPie className="size-10 opacity-20" />
            <p className="text-sm">No data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[300px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalBookings.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Bookings
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
