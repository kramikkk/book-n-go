import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ─── Auth helper ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401, supabase, user: null }
  if (user.user_metadata?.role !== 'admin') return { error: 'Forbidden', status: 403, supabase, user: null }
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
  price:      number
  created_at: string
  services:   { id: string; label: string }[]
  profiles:   { id: string; first_name: string | null; last_name: string | null; email: string | null }[]
}

// ─── GET /api/admin/bookings ──────────────────────────────────────────────────
// Returns all bookings belonging to this admin.
//
// Query params (all optional):
//   status   = Pending | Completed | Canceled
//   type     = Appointment | Reservation
//   date     = YYYY-MM-DD  (exact date filter)
//   from     = YYYY-MM-DD  (date range start, inclusive)
//   to       = YYYY-MM-DD  (date range end, inclusive)
//
// Response 200:
//   { bookings: Booking[] }
//
// Each Booking:
//   id, name, contact, date, time_start, time_end, type, status,
//   price, created_at,
//   service: { id, label } | null,
//   customer: { id, first_name, last_name, email } | null

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
        price,
        created_at,
        services ( id, label ),
        profiles!bookings_customer_id_fkey ( id, first_name, last_name, email )
      `)
      .eq('admin_id', user!.id)
      .order('date', { ascending: false })
      .order('time_start', { ascending: false })

    if (filterStatus) query = query.eq('status', filterStatus)
    if (filterType)   query = query.eq('type', filterType)
    if (filterDate)   query = query.eq('date', filterDate)
    if (filterFrom)   query = query.gte('date', filterFrom)
    if (filterTo)     query = query.lte('date', filterTo)

    const { data, error: dbError } = await query

    if (dbError) {
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    // Normalise join shape
    const bookings = (data ?? [] as RawBookingRow[]).map((b: RawBookingRow) => ({
      id:         b.id,
      name:       b.name,
      contact:    b.contact,
      date:       b.date,
      time_start: b.time_start,
      time_end:   b.time_end,
      type:       b.type,
      status:     b.status,
      price:      b.price,
      created_at: b.created_at,
      service:   b.services[0]  ? { id: b.services[0].id,  label: b.services[0].label }  : null,
      customer:  b.profiles[0]  ? { id: b.profiles[0].id,  first_name: b.profiles[0].first_name,
                                     last_name: b.profiles[0].last_name, email: b.profiles[0].email } : null,
    }))

    return NextResponse.json({ bookings }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
