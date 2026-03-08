import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { buildStats }    from './stats'
import { buildBarChart } from './bar-chart'
import { buildPieChart } from './pie-chart'
import type { BookingRow, BookingStatus, BookingType, DashboardData, RawRow } from './types'

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────
// Returns all data needed for the admin dashboard in one request.
//
// Response 200:
//   {
//     stats:    { total, pending, completed, canceled },
//     barChart: { daily, monthly, yearly },
//     pieChart: { reservation, appointment },
//     upcoming: BookingRow[]  (pending only, max 10, sorted by date asc)
//   }

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        name,
        contact,
        date,
        time_start,
        time_end,
        type,
        status,
        created_at,
        services ( label ),
        profiles!bookings_customer_id_fkey ( id, first_name, last_name, email )
      `)
      .eq('admin_id', user.id)
      .order('date', { ascending: true })
      .order('time_start', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    // Normalise Supabase join shape (joins come back as arrays)
    const rows: BookingRow[] = (data ?? [] as RawRow[]).map((b: RawRow) => ({
      id:         b.id,
      name:       b.name,
      contact:    b.contact,
      date:       b.date,
      time_start: b.time_start,
      time_end:   b.time_end,
      type:       b.type   as BookingType,
      status:     b.status as BookingStatus,
      service:    b.services[0]?.label ?? null,
      created_at: b.created_at,
      customer:   b.profiles[0]
        ? {
            id:         b.profiles[0].id,
            first_name: b.profiles[0].first_name,
            last_name:  b.profiles[0].last_name,
            email:      b.profiles[0].email,
          }
        : null,
    }))

    const dashboardData: DashboardData = {
      stats:    buildStats(rows),
      barChart: buildBarChart(rows),
      pieChart: buildPieChart(rows),
      upcoming: rows.filter((b) => b.status === 'Pending').slice(0, 10),
    }

    return NextResponse.json(dashboardData, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
