import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ─── PATCH /api/client/bookings/[id] ──────────────────────────────────────────
// Updates the status of a single booking.
// Client can only update bookings that belong to them.
//
// Request body:
//   { status: 'Pending' | 'Completed' | 'Canceled' }
//
// Response 200:
//   { message: string, booking: { id, status } }

const VALID_STATUSES = ['Pending', 'Completed', 'Canceled']

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'client') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (status === undefined) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      )
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    // .eq('client_id') ensures the client can only update their own bookings
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .eq('client_id', user.id)
      .select('id, status')
      .single()

    if (dbError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found or you do not have permission to update it' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Booking updated successfully', booking },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ─── DELETE /api/client/bookings/[id] ─────────────────────────────────────────
// Permanently deletes a booking that belongs to the authenticated client.

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'client') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params

    const { error: dbError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .eq('client_id', user.id)

    if (dbError) {
      return NextResponse.json({ error: 'Booking not found or you do not have permission to delete it' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
