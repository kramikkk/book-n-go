import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ─── GET /api/bookings/availability ──────────────────────────────────────────
// Returns booked slots and fully booked dates for a given admin.
//
// Query params:
//   slug = string (required) - Admin slug to fetch availability for
//   date = string (optional) - Fetch specific date, otherwise fetches next 30 days
//
// Response 200:
//   { bookedSlots: string[], fullyBookedDates: string[] }

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const dateFilter = searchParams.get('date')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // 1. Find admin id by slug
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('admin_id')
      .eq('slug', slug)
      .single()

    if (settingsError || !settings) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const adminId = settings.admin_id

    // 2. Fetch bookings
    let query = supabase
      .from('bookings')
      .select('date, time_start')
      .eq('admin_id', adminId)
      .in('status', ['Pending', 'Confirmed'])

    if (dateFilter) {
      query = query.eq('date', dateFilter)
    } else {
      const today = new Date().toISOString().split('T')[0]
      query = query.gte('date', today)
    }

    const { data: bookings, error: bookingsError } = await query

    if (bookingsError) {
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    const bookedSlots: string[] = []

    // Simplistic grouping by date
    const dateCounts: Record<string, number> = {}

      ; (bookings || []).forEach((b: { date: string; time_start: string }) => {
        // For simple implementation, we just return time_start if returning multiple days is too complex to map.
        // But actually, the UI expects booked slots for the *currently selected date* on the client.
        // And the client expects fullybookedDates.
        if (dateFilter && b.date === dateFilter) {
          bookedSlots.push(b.time_start)
        }
        dateCounts[b.date] = (dateCounts[b.date] || 0) + 1
      })

    const fullyBookedDates: string[] = []
    // Let's say a date is fully booked if it has 10 bookings
    for (const [date, count] of Object.entries(dateCounts)) {
      if (count >= 10) {
        fullyBookedDates.push(date)
      }
    }

    return NextResponse.json({ bookedSlots, fullyBookedDates }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
