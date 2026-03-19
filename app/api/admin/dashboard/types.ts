// ─── Raw Supabase join shape ──────────────────────────────────────────────────
// Supabase returns joined tables as arrays, not single objects

export type RawRow = {
  id:         string
  name:       string
  contact:    string
  date:       string
  time_start: string
  time_end:   string
  type:       string
  status:     string
  created_at: string
  services:   { label: string }[]
  profiles:   { id: string; first_name: string | null; last_name: string | null; email: string | null }[]
}

// ─── Normalised booking row ───────────────────────────────────────────────────

export type BookingStatus = 'Pending' | 'Completed' | 'Canceled'
export type BookingType   = 'Appointment' | 'Reservation'

export type BookingRow = {
  id:         string
  name:       string
  contact:    string
  date:       string
  time_start: string
  time_end:   string
  type:       BookingType
  status:     BookingStatus
  service:    string | null
  created_at: string
  customer: {
    id:         string
    first_name: string | null
    last_name:  string | null
    email:      string | null
  } | null
}

// ─── Stats cards ─────────────────────────────────────────────────────────────

export type DashboardStats = {
  total:     number
  pending:   number
  completed: number
  canceled:  number
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

export type BarChartEntry = {
  label:       string
  reservation: number
  appointment: number
}

export type BarChartData = {
  daily:   BarChartEntry[]
  monthly: BarChartEntry[]
  yearly:  BarChartEntry[]
}

// ─── Pie chart ────────────────────────────────────────────────────────────────

export type PieChartEntry = {
  status: string
  count:  number
  fill:   string
}

export type PieChartData = {
  reservation: PieChartEntry[]
  appointment: PieChartEntry[]
}

// ─── Full API response ────────────────────────────────────────────────────────

export type DashboardData = {
  stats:    DashboardStats
  barChart: BarChartData
  pieChart: PieChartData
  upcoming: BookingRow[]
}