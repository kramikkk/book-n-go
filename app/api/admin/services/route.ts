import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const VALID_TYPES = ['appointment', 'reservation']

// ─── GET /api/admin/services ──────────────────────────────────────────────────
// Returns all services for this admin, grouped by type.
//
// Response 200:
//   {
//     services: {
//       appointment: Service[],
//       reservation: Service[],
//     }
//   }
//
// Each Service:
//   { id, type, label, description, sort_order, created_at }

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data, error } = await supabase
      .from('services')
      .select('id, type, label, description, sort_order, created_at')
      .eq('admin_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
    }

    const services = {
      appointment: (data ?? []).filter((s) => s.type === 'appointment'),
      reservation: (data ?? []).filter((s) => s.type === 'reservation'),
    }

    return NextResponse.json({ services }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ─── POST /api/admin/services ─────────────────────────────────────────────────
// Creates a new service for this admin.
//
// Request body:
//   { type: 'appointment' | 'reservation', label: string, description?: string }
//
// Response 201:
//   { message: string, service: Service }

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { type, label, description } = await request.json()

    if (!type || !label) {
      return NextResponse.json({ error: 'Type and label are required' }, { status: 400 })
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    if (typeof label !== 'string' || label.trim().length === 0) {
      return NextResponse.json({ error: 'Label cannot be empty' }, { status: 400 })
    }

    // Set sort_order to the end of the existing list for this type
    const { count } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('admin_id', user.id)
      .eq('type', type)

    const { data: service, error: dbError } = await supabase
      .from('services')
      .insert({
        admin_id:    user.id,
        type,
        label:       label.trim(),
        description: description?.trim() || null,
        sort_order:  count ?? 0,
      })
      .select('id, type, label, description, sort_order, created_at')
      .single()

    if (dbError) {
      return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Service created successfully', service },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
