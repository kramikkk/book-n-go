import { requireClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

import { buildStats } from './stats'
import { buildBarChart } from './bar-chart'
import { buildPieChart } from './pie-chart'
import type { RawRow, BookingRow, DashboardData } from './types'

// ─── GET /api/client/dashboard ─────────────────────────────────────────────────
// Returns all data needed to render the dashboard in a single request.
// Limits search to the last 12 months for scalability.

export async function GET(request: Request) {
  try {
    const { error, status, supabase, user } = await requireClient()
    if (error) return NextResponse.json({ error }, { status })

    // Scale optimization: only fetch bookings from the last 12 months to prevent
    // performance degradation as history grows.
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const dateLimit = oneYearAgo.toISOString().split('T')[0]

    // Validate timezone — fall back to UTC rather than crashing
    const rawTz = new URL(request.url).searchParams.get('tz') ?? 'UTC'
    let tz = 'UTC'
    try {
      Intl.DateTimeFormat(undefined, { timeZone: rawTz })
      tz = rawTz
    } catch {
      // invalid tz string — silently fall back to UTC
    }

    const [{ data, error: dbError }, { count: totalCount }] = await Promise.all([
      supabase
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
        .eq('client_id', user!.id)
        .gte('date', dateLimit)
        .order('date',       { ascending: true })
        .order('time_start', { ascending: true }),
      // All-time total (unfiltered) for the stats total card
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user!.id),
    ])

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

    const stats = buildStats(rows)
    stats.total = totalCount ?? stats.total

    const payload: DashboardData = {
      stats,
      barChart: buildBarChart(rows, tz),
      pieChart: buildPieChart(rows),
      upcoming,
    }

    return NextResponse.json(payload, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}