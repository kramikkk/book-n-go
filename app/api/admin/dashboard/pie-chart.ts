import type { BookingRow, BookingType, PieChartData, PieChartEntry } from './types'

// Builds status distribution (Pending/Completed/Canceled) per booking type.
// Feeds the Distribution donut chart on the dashboard.

export function buildPieChart(rows: BookingRow[]): PieChartData {
  const makePie = (type: BookingType): PieChartEntry[] => {
    const filtered = rows.filter((b) => b.type === type)
    return [
      { status: 'pending',   count: filtered.filter((b) => b.status === 'Pending').length,   fill: 'var(--color-pending)'   },
      { status: 'completed', count: filtered.filter((b) => b.status === 'Completed').length, fill: 'var(--color-completed)' },
      { status: 'canceled',  count: filtered.filter((b) => b.status === 'Canceled').length,  fill: 'var(--color-canceled)'  },
    ]
  }

  return {
    reservation: makePie('Reservation'),
    appointment: makePie('Appointment'),
  }
}
