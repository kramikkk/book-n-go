import { createClient } from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'

// ─── POST /api/auth/change-password ──────────────────────────────────────────
// Changes the password for the currently logged-in user.
//
// Requires the current password to prevent silent takeover if a session is
// ever compromised (e.g. via XSS or a shared browser).
//
// Request body:
//   { currentPassword: string, newPassword: string }
//
// Response 200:
//   { message: string }

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      )
    }

    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from your current password' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to change your password' },
        { status: 401 }
      )
    }

    // Re-authenticate with the current password before allowing the change.
    // This prevents anyone with access to an active session (XSS, shared
    // browser, etc.) from silently taking over an account.
    const { error: reAuthError } = await supabase.auth.signInWithPassword({
      email:    user.email!,
      password: currentPassword,
    })

    if (reAuthError) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
