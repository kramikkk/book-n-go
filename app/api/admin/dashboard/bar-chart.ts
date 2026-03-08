import type { BarChartData, BarChartEntry, BookingRow } from './types'

// Builds booking counts grouped by day, month, and year.
// Feeds the Bookings Chart bar chart on the dashboard.

export function buildBarChart(rows: BookingRow[]): BarChartData {
  const today = new Date()

  // ── Daily: Mon–Sun of the current week ───────────────────────────────────
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const daily: BarChartEntry[] = DAY_LABELS.map((label, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    const dateStr = day.toISOString().split('T')[0]
    const dayRows = rows.filter((b) => b.date === dateStr)
    return {
      label,
      reservation: dayRows.filter((b) => b.type === 'Reservation').length,
      appointment: dayRows.filter((b) => b.type === 'Appointment').length,
    }
  })

  // ── Monthly: Jan–Dec of the current year ─────────────────────────────────
  const year = today.getFullYear()
  const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const monthly: BarChartEntry[] = MONTH_LABELS.map((label, i) => {
    const monthRows = rows.filter((b) => {
      const d = new Date(b.date)
      return d.getFullYear() === year && d.getMonth() === i
    })
    return {
      label,
      reservation: monthRows.filter((b) => b.type === 'Reservation').length,
      appointment: monthRows.filter((b) => b.type === 'Appointment').length,
    }
  })

  // ── Yearly: last 5 years ──────────────────────────────────────────────────
  const yearly: BarChartEntry[] = Array.from({ length: 5 }, (_, i) => {
    const y = year - 4 + i
    const yearRows = rows.filter((b) => new Date(b.date).getFullYear() === y)
    return {
      label:       String(y),
      reservation: yearRows.filter((b) => b.type === 'Reservation').length,
      appointment: yearRows.filter((b) => b.type === 'Appointment').length,
    }
  })

  return { daily, monthly, yearly }
}
