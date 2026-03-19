import { createClient } from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'

// ─── PATCH /api/admin/services/[id] ──────────────────────────────────────────
// Updates the label and/or description of a single service.
// For drag-and-drop reordering, send orderedIds in the request body.
//
// Request body (mutually exclusive):
//   { label?: string, description?: string }
//   { orderedIds: string[] }
//
// Response 200:
//   { message: string, service: Service }

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user)                               return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' },    { status: 403 })

    const { id }                             = await params
    const body                               = await request.json()
    const { label, description, orderedIds } = body

    // ── Reorder branch ──
    if (orderedIds !== undefined) {
      if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        return NextResponse.json(
          { error: 'orderedIds must be a non-empty array' },
          { status: 400 }
        )
      }

      await Promise.all(
        orderedIds.map((sid: string, index: number) =>
          supabase
            .from('services')
            .update({ sort_order: index })
            .eq('id', sid)
            .eq('admin_id', user.id)
        )
      )

      return NextResponse.json({ message: 'Services reordered successfully' }, { status: 200 })
    }

    // ── Label / description branch ──
    if (label === undefined && description === undefined) {
      return NextResponse.json(
        { error: 'Provide at least one field to update: label or description' },
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
    if (!user)                               return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' },    { status: 403 })

    const { id } = await params

    const { data: existing, error: fetchError } = await supabase
      .from('services')
      .select('id')
      .eq('id', id)
      .eq('admin_id', user.id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Service not found or you do not have permission to delete it' },
        { status: 404 }
      )
    }

    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('admin_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}