"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { IconChartBar } from "@tabler/icons-react"

export const description = "A multiple bar chart"

const allChartData: Record<string, { label: string; reservation: number; appointment: number }[]> = {
  daily: [
    { label: "Mon", reservation: 12, appointment: 8 },
    { label: "Tue", reservation: 19, appointment: 14 },
    { label: "Wed", reservation: 15, appointment: 10 },
    { label: "Thu", reservation: 22, appointment: 18 },
    { label: "Fri", reservation: 30, appointment: 25 },
    { label: "Sat", reservation: 28, appointment: 20 },
    { label: "Sun", reservation: 10, appointment: 6 },
  ],
  monthly: [
    { label: "Jan", reservation: 186, appointment: 80 },
    { label: "Feb", reservation: 305, appointment: 200 },
    { label: "Mar", reservation: 237, appointment: 120 },
    { label: "Apr", reservation: 73, appointment: 190 },
    { label: "May", reservation: 209, appointment: 130 },
    { label: "Jun", reservation: 214, appointment: 140 },
    { label: "Jul", reservation: 198, appointment: 110 },
    { label: "Aug", reservation: 245, appointment: 160 },
    { label: "Sep", reservation: 220, appointment: 145 },
    { label: "Oct", reservation: 260, appointment: 175 },
    { label: "Nov", reservation: 290, appointment: 195 },
    { label: "Dec", reservation: 310, appointment: 210 },
  ],
  yearly: [
    { label: "2020", reservation: 1200, appointment: 800 },
    { label: "2021", reservation: 1800, appointment: 1200 },
    { label: "2022", reservation: 2200, appointment: 1600 },
    { label: "2023", reservation: 2800, appointment: 2000 },
    { label: "2024", reservation: 3200, appointment: 2400 },
    { label: "2025", reservation: 3800, appointment: 2900 },
  ],
}

const chartConfig = {
  reservation: {
    label: "Reservation",
    color: "var(--chart-1)",
  },
  appointment: {
    label: "Appointment",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartBar({ data: _data }: { data?: unknown } = {}) {
  const [period, setPeriod] = React.useState<"daily" | "monthly" | "yearly">("daily")

  const chartData = allChartData[period]

  return (
    <Card className="flex h-[400px] flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <IconChartBar className="size-4 text-blue-500" />
          <h1 className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">Bookings Chart</h1>
        </CardTitle>
        <Select value={period} onValueChange={(v) => setPeriod(v as "daily" | "monthly" | "yearly")}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={30}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="reservation" fill="var(--color-reservation)" radius={4} />
            <Bar dataKey="appointment" fill="var(--color-appointment)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
