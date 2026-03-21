import type { BarChartData, BarChartEntry, BookingRow } from './types'

// Builds booking counts grouped by day, month, and year.
// Feeds the Bookings Chart bar chart on the dashboard.

export function buildBarChart(rows: BookingRow[], tz: string = 'UTC'): BarChartData {
  // Format a Date to YYYY-MM-DD in the admin's timezone.
  // 'en-CA' locale gives us that format natively.
  const toLocalDateStr = (d: Date): string =>
    new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d)

  const today       = new Date()
  const todayStr    = toLocalDateStr(today)
  const [yearStr]   = todayStr.split('-')
  const currentYear = parseInt(yearStr, 10)

  // ── Daily: Mon–Sun of the current week (in the admin's timezone) ─────────
  // Derive the local day-of-week by parsing the YYYY-MM-DD string we already
  // have — no reliance on the server's own timezone.
  const [, localMonth, localDay] = todayStr.split('-').map(Number)
  const localFullDate = new Date(Date.UTC(currentYear, localMonth - 1, localDay))
  const localDow = localFullDate.getUTCDay() // 0=Sun, 1=Mon … 6=Sat

  // Offset (in days) from today back to Monday
  const mondayOffset = localDow === 0 ? -6 : 1 - localDow

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const daily: BarChartEntry[] = DAY_LABELS.map((label, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + mondayOffset + i)
    const dateStr = toLocalDateStr(d)
    const dayRows = rows.filter((b) => b.date === dateStr)
    return {
      label,
      reservation: dayRows.filter((b) => b.type === 'Reservation').length,
      appointment: dayRows.filter((b) => b.type === 'Appointment').length,
    }
  })

  // ── Monthly: Jan–Dec of the current year (in the admin's timezone) ───────
  // Parse year/month directly from the YYYY-MM-DD string to avoid any
  // timezone shifting that new Date(b.date) can introduce.
  const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const monthly: BarChartEntry[] = MONTH_LABELS.map((label, i) => {
    const monthRows = rows.filter((b) => {
      const [y, m] = b.date.split('-').map(Number)
      return y === currentYear && m === i + 1
    })
    return {
      label,
      reservation: monthRows.filter((b) => b.type === 'Reservation').length,
      appointment: monthRows.filter((b) => b.type === 'Appointment').length,
    }
  })

  // ── Yearly: last 5 years ──────────────────────────────────────────────────
  const yearly: BarChartEntry[] = Array.from({ length: 5 }, (_, i) => {
    const y = currentYear - 4 + i
    const yearRows = rows.filter((b) => parseInt(b.date.split('-')[0], 10) === y)
    return {
      label:       String(y),
      reservation: yearRows.filter((b) => b.type === 'Reservation').length,
      appointment: yearRows.filter((b) => b.type === 'Appointment').length,
    }
  })

  return { daily, monthly, yearly }
}