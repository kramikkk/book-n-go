import { createClient } from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)                                return { error: 'Unauthorized', status: 401, supabase, user: null }
  if (user.app_metadata?.role !== 'admin') return { error: 'Forbidden',    status: 403, supabase, user: null }
  return { error: null, status: 200, supabase, user }
}

// Supabase returns joined tables as arrays, not single objects
type RawBookingRow = {
  id:         string
  name:       string
  contact:    string
  date:       string
  time_start: string
  time_end:   string
  type:       string
  status:     string
  created_at: string
  service_id: string | null
  profiles:   { id: string; first_name: string | null; last_name: string | null; email: string | null }[]
}

// ─── GET /api/admin/bookings ──────────────────────────────────────────────────
// Returns all bookings belonging to this admin.
//
// Query params (all optional):
//   status   = Pending | Completed | Canceled
//   type     = Appointment | Reservation
//   date     = YYYY-MM-DD  (exact date — mutually exclusive with from/to)
//   from     = YYYY-MM-DD  (range start, inclusive — ignored when date is set)
//   to       = YYYY-MM-DD  (range end,   inclusive — ignored when date is set)
//
// Passing both `date` and `from`/`to` returns a 400 to prevent silent
// over-filtering that would yield zero results.
//
// Response 200:
//   { bookings: Booking[] }

export async function GET(request: Request) {
  try {
    const { error, status, supabase, user } = await requireAdmin()
    if (error) return NextResponse.json({ error }, { status })

    const { searchParams } = new URL(request.url)
    const filterStatus = searchParams.get('status')
    const filterType   = searchParams.get('type')
    const filterDate   = searchParams.get('date')
    const filterFrom   = searchParams.get('from')
    const filterTo     = searchParams.get('to')

    // Reject conflicting date filters early instead of silently stacking them
    // (which almost always returns zero rows and is very hard to debug).
    if (filterDate && (filterFrom || filterTo)) {
      return NextResponse.json(
        { error: 'Use either `date` or `from`/`to`, not both' },
        { status: 400 }
      )
    }

    let query = supabase
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
        service_id,
        created_at,
        profiles!bookings_customer_id_fkey ( id, first_name, last_name, email )
      `)
      .eq('admin_id', user!.id)
      .order('date',       { ascending: false })
      .order('time_start', { ascending: false })

    if (filterStatus) query = query.eq('status', filterStatus)
    if (filterType)   query = query.eq('type',   filterType)
    if (filterDate)   query = query.eq('date',   filterDate)
    if (!filterDate && filterFrom) query = query.gte('date', filterFrom)
    if (!filterDate && filterTo)   query = query.lte('date', filterTo)

    const { data, error: dbError } = await query

    if (dbError) {
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    const bookings = ((data ?? []) as RawBookingRow[]).map((b: RawBookingRow) => ({
      id:         b.id,
      name:       b.name,
      contact:    b.contact,
      date:       b.date,
      time_start: b.time_start,
      time_end:   b.time_end,
      type:       b.type,
      status:     b.status,
      service_id: b.service_id,
      created_at: b.created_at,
      customer: b.profiles[0] ? {
        id:         b.profiles[0].id,
        first_name: b.profiles[0].first_name,
        last_name:  b.profiles[0].last_name,
        email:      b.profiles[0].email,
      } : null,
    }))

    return NextResponse.json({ bookings }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}