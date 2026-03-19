import { createClient } from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'

// ─── GET /api/profile ─────────────────────────────────────────────────────────
// Fetches the current logged-in user's profile.
//
// Response 200:
//   { profile: Profile }

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 })
    }

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

// ─── PATCH /api/profile ───────────────────────────────────────────────────────
// Updates the current logged-in user's personal information.
//
// Request body:
//   {
//     first_name:   string  (required)
//     last_name:    string  (required)
//     phone:        string  (required)
//     middle_name?: string
//     email?:       string
//   }
//
// Response 200:
//   { message: string, profile: Profile }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 })
    }

    const { first_name, middle_name, last_name, phone, email } = await request.json()

    // ── Required field validation ──
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Phone is required at registration — enforce the same rule here so a
    // user cannot accidentally clear it by submitting the profile form.
    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // FIX: validate email format when a new email is provided.
    const trimmedEmail = email?.trim()
    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const isEmailChanging = trimmedEmail && trimmedEmail !== user.email

    // FIX: update Supabase Auth FIRST when the email is changing, then update
    // the profiles table. The previous order (profiles first) left the two
    // sources out of sync if the auth update failed — the DB would have the
    // new email while auth still held the old one.
    //
    // auth.updateUser triggers a confirmation email to the new address.
    // The auth record only flips after the user confirms, so there is a
    // brief window where auth.email !== profiles.email — this is expected
    // Supabase behaviour and not a bug.
    if (isEmailChanging) {
      const { error: emailError } = await supabase.auth.updateUser({ email: trimmedEmail })
      if (emailError) {
        return NextResponse.json(
          { error: 'Failed to update email' },
          { status: 500 }
        )
      }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name:  first_name.trim(),
        middle_name: middle_name?.trim() || null,
        last_name:   last_name.trim(),
        phone:       phone.trim(),
        email:       trimmedEmail || user.email,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Profile updated successfully', profile },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
