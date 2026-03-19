import { createClient } from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'

import { buildStats }    from './stats'
import { buildBarChart } from './bar-chart'
import { buildPieChart } from './pie-chart'
import type { RawRow, BookingRow, DashboardData } from './types'

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────
// Returns all data needed to render the dashboard in a single request:
//   stats    — total / pending / completed / canceled counts
//   barChart — booking counts grouped by day / month / year
//   pieChart — status distribution per booking type
//   upcoming — next 10 pending bookings (soonest first)
//
// Query params (optional):
//   tz  IANA timezone string used to compute "current week / year".
//       Falls back to 'UTC' if omitted or invalid.
//
// Response 200:
//   { stats, barChart, pieChart, upcoming }

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user)                                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' },    { status: 403 })

    // Validate timezone — fall back to UTC rather than crashing
    const rawTz = new URL(request.url).searchParams.get('tz') ?? 'UTC'
    let tz = 'UTC'
    try {
      Intl.DateTimeFormat(undefined, { timeZone: rawTz })
      tz = rawTz
    } catch {
      // invalid tz string — silently fall back to UTC
    }

    const { data, error: dbError } = await supabase
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
        profiles!bookings_customer_id_fkey ( id, first_name, last_name, email )
      `)
      .eq('admin_id', user.id)
      .order('date',       { ascending: true })
      .order('time_start', { ascending: true })

    if (dbError) {
      return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
    }

    // Normalise the Supabase join shape (arrays → single objects)
    const rows: BookingRow[] = ((data ?? []) as RawRow[]).map((b: RawRow) => ({
      id:         b.id,
      name:       b.name,
      contact:    b.contact,
      date:       b.date,
      time_start: b.time_start,
      time_end:   b.time_end,
      type:       b.type as BookingRow['type'],
      status:     b.status as BookingRow['status'],
      service:    null,
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

    // Upcoming: next 10 pending bookings from today onward.
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date())
    const upcoming = rows
      .filter((b) => b.status === 'Pending' && b.date >= todayStr)
      .slice(0, 10)

    const payload: DashboardData = {
      stats:    buildStats(rows),
      barChart: buildBarChart(rows, tz),
      pieChart: buildPieChart(rows),
      upcoming,
    }

    return NextResponse.json(payload, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}