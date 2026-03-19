import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
// Signs in an existing user.
//
// Request body:
//   { email: string, password: string }
//
// Response 200:
//   { message: string, user: Profile }

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // FIX: trim email before validation and sign-in — a trailing space would
    // pass the truthiness check but cause a "Invalid email or password" error
    // that is frustrating to debug.
    const trimmedEmail = email?.trim()

    if (!trimmedEmail || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email:    trimmedEmail,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role, avatar_url')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Logged in successfully', user: profile },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
