import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse }  from 'next/server'

// ─── POST /api/auth/register ──────────────────────────────────────────────────
// Creates a new customer account.
//
// Request body:
//   {
//     email:        string  (required)
//     password:     string  (required, min 8 chars)
//     first_name:   string  (required)
//     last_name:    string  (required)
//     phone:        string  (required)
//     middle_name?: string
//   }
//
// Note: role is intentionally NOT accepted from the request body.
// Public registration always creates a 'customer' account. Admin accounts



const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const { email, password, first_name, middle_name, last_name, phone } =
      await request.json()

    const trimmedEmail      = email?.trim()
    const trimmedFirstName  = first_name?.trim()
    const trimmedLastName   = last_name?.trim()
    const trimmedPhone      = phone?.trim()
    const trimmedMiddleName = middle_name?.trim() || null

    if (!trimmedEmail || !password || !trimmedFirstName || !trimmedLastName || !trimmedPhone) {
      return NextResponse.json(
        { error: 'Email, password, first name, last name and phone number are required' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: { role: 'customer' },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user || authData.user.identities?.length === 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name:  trimmedFirstName,
        middle_name: trimmedMiddleName,
        last_name:   trimmedLastName,
        phone:       trimmedPhone,
        email:       trimmedEmail,
        role:        'customer',
      })
      .eq('id', authData.user.id)

    if (profileError) {
      try {
        const adminClient = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        await adminClient.auth.admin.deleteUser(authData.user.id)
      } catch {
        console.error('[register] orphaned auth user — delete manually:', authData.user.id)
      }

      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Account created successfully! Please check your email to verify your account.' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}