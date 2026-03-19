import { createClient } from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'

const VALID_COLORS = ['blue', 'indigo', 'purple', 'rose', 'orange', 'green', 'teal']

// ─── GET /api/admin/settings ──────────────────────────────────────────────────
// Returns the admin's current settings row.
//
// Response 200:
//   { settings: Settings | null }

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user)                               return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' },    { status: 403 })

    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .eq('admin_id', user.id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    return NextResponse.json({ settings }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ─── PATCH /api/admin/settings ────────────────────────────────────────────────
// Updates one or more settings fields. All fields are optional —
// only the fields you send will be updated.
//
// Request body (all optional):
//   business_name        string
//   slug                 string   (3–50 chars, lowercase letters/numbers/hyphens only)
//   welcome_message      string   (max 300 chars)
//   seo_title            string   (max 60 chars)
//   seo_description      string   (max 160 chars)
//   primary_color        string   (blue | indigo | purple | rose | orange | green | teal)
//   new_booking_alerts   boolean
//   cancellation_alerts  boolean
//
// Response 200:
//   { message: string, settings: Settings }

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user)                               return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' },    { status: 403 })

    const body = await request.json()

    const {
      business_name,
      slug,
      welcome_message,
      seo_title,
      seo_description,
      primary_color,
      new_booking_alerts,
      cancellation_alerts,
    } = body

    // ── Slug ──
    if (slug !== undefined) {
      if (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug) || slug.length < 3 || slug.length > 50) {
        return NextResponse.json(
          { error: 'Slug must be 3–50 characters, lowercase letters, numbers, and hyphens only' },
          { status: 400 }
        )
      }
    }

    // ── String length limits ──
    if (welcome_message && welcome_message.length > 300) {
      return NextResponse.json({ error: 'Welcome message must be 300 characters or less' }, { status: 400 })
    }
    if (seo_title && seo_title.length > 60) {
      return NextResponse.json({ error: 'SEO title must be 60 characters or less' }, { status: 400 })
    }
    if (seo_description && seo_description.length > 160) {
      return NextResponse.json({ error: 'SEO description must be 160 characters or less' }, { status: 400 })
    }

    // ── primary_color ──
    if (primary_color !== undefined && !VALID_COLORS.includes(primary_color)) {
      return NextResponse.json(
        { error: `Invalid primary_color. Must be one of: ${VALID_COLORS.join(', ')}` },
        { status: 400 }
      )
    }

    if (new_booking_alerts !== undefined && typeof new_booking_alerts !== 'boolean') {
      return NextResponse.json({ error: 'new_booking_alerts must be a boolean' }, { status: 400 })
    }
    if (cancellation_alerts !== undefined && typeof cancellation_alerts !== 'boolean') {
      return NextResponse.json({ error: 'cancellation_alerts must be a boolean' }, { status: 400 })
    }

    // Build update object with only the fields that were provided
    const updates: Record<string, unknown> = {}
    if (business_name       !== undefined) updates.business_name       = business_name
    if (slug                !== undefined) updates.slug                = slug
    if (welcome_message     !== undefined) updates.welcome_message     = welcome_message
    if (seo_title           !== undefined) updates.seo_title           = seo_title
    if (seo_description     !== undefined) updates.seo_description     = seo_description
    if (primary_color       !== undefined) updates.primary_color       = primary_color
    if (new_booking_alerts  !== undefined) updates.new_booking_alerts  = new_booking_alerts
    if (cancellation_alerts !== undefined) updates.cancellation_alerts = cancellation_alerts

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields provided to update' }, { status: 400 })
    }

    const { data: settings, error: dbError } = await supabase
      .from('settings')
      .upsert({ admin_id: user.id, ...updates }, { onConflict: 'admin_id' })
      .select('*')
      .single()

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.json({ error: 'That slug is already taken' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Settings updated successfully', settings },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}