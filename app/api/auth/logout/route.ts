import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// Signs out the current user and clears the session cookie.
//
// Response 200:
//   { message: string }

export async function POST() {
  try {
    const supabase = await createClient()

    // FIX: removed the upfront getUser() check that returned a 401 when there
    // was no active session. Logout should always succeed from the client's
    // perspective — returning an error for an already-logged-out session causes
    // client-side error handling to fire on a state that is already correct.
    // signOut() is a no-op when there is no session, so this is safe.
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
