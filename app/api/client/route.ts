import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ─── GET /api/client ───────────────────────────────────────────────────────────
// Returns the currently authenticated client's profile.
//
// Response 200:
//   { profile: Profile }

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user)                               return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'client') return NextResponse.json({ error: 'Forbidden' },    { status: 403 })

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, first_name, middle_name, last_name, email, phone, avatar_url, role, created_at')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    return NextResponse.json({ profile }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
