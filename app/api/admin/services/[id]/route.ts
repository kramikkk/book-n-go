import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ─── PATCH /api/admin/services/[id] ──────────────────────────────────────────
// Updates the label and/or description of a single service.
// Also handles sort_order updates for drag-and-drop reordering:
// send the full ordered array of IDs for that type and all rows
// will be updated in a single call.
//
// Request body (use one mode at a time):
//
//   Mode A — edit label/description:
//     { label?: string, description?: string }
//
//   Mode B — reorder (drag and drop):
//     { orderedIds: string[] }
//     All IDs must belong to this admin. Each ID gets sort_order = its index.
//
// Response 200:
//   { message: string, service: Service }   (Mode A)
//   { message: string }                      (Mode B)

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const body = await request.json()
    const { label, description, orderedIds } = body

    // ── Mode B: reorder ──
    if (orderedIds !== undefined) {
      if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        return NextResponse.json({ error: 'orderedIds must be a non-empty array' }, { status: 400 })
      }

      // Update each service's sort_order based on its position in the array
      const updates = orderedIds.map((serviceId: string, index: number) =>
        supabase
          .from('services')
          .update({ sort_order: index })
          .eq('id', serviceId)
          .eq('admin_id', user.id) // safety: admin can only reorder their own
      )

      await Promise.all(updates)

      return NextResponse.json({ message: 'Services reordered successfully' }, { status: 200 })
    }

    // ── Mode A: edit label/description ──
    if (label === undefined && description === undefined) {
      return NextResponse.json(
        { error: 'Provide at least one field to update: label, description, or orderedIds' },
        { status: 400 }
      )
    }

    if (label !== undefined && typeof label === 'string' && label.trim().length === 0) {
      return NextResponse.json({ error: 'Label cannot be empty' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}
    if (label       !== undefined) updates.label       = label.trim()
    if (description !== undefined) updates.description = description?.trim() || null

    const { data: service, error: dbError } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .eq('admin_id', user.id)
      .select('id, type, label, description, sort_order, created_at')
      .single()

    if (dbError || !service) {
      return NextResponse.json(
        { error: 'Service not found or you do not have permission to update it' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Service updated successfully', service },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/services/[id] ─────────────────────────────────────────
// Deletes a service. Any bookings that referenced this service will have
// their service_id set to null (handled by the DB schema).
//
// Response 200:
//   { message: string }

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params

    const { error: dbError } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('admin_id', user.id)

    if (dbError) {
      return NextResponse.json(
        { error: 'Service not found or you do not have permission to delete it' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
