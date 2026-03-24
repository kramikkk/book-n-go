import type { BookingRow, DashboardStats } from './types'

// Counts total, pending, completed, and canceled bookings.
// Feeds the four cards at the top of the dashboard.

export function buildStats(rows: BookingRow[]): DashboardStats {
  return {
    total:     rows.length,
    pending:   rows.filter((b) => b.status === 'Pending').length,
    completed: rows.filter((b) => b.status === 'Completed').length,
    canceled:  rows.filter((b) => b.status === 'Canceled').length,
  }
}
