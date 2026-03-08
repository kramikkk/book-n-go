import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/profile
// Fetches the current logged in user's profile
export async function GET() {
  try {
    const supabase = await createClient()

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      )
    }

    // Fetch their profile from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, first_name, middle_name, last_name, email, phone, avatar_url, role, created_at')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { profile },
      { status: 200 }
    )

  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// PATCH /api/profile
// Updates the current logged in user's personal information
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      )
    }

    // Get the fields to update from the request
    const { first_name, middle_name, last_name, phone, email } = await request.json()

    // Validate required fields
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Update the profile in the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name,
        middle_name: middle_name || null,
        last_name,
        phone,
        email: email || user.email,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // If email was changed, update it in Supabase Auth too
    if (email && email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email })

      if (emailError) {
        return NextResponse.json(
          { error: 'Profile updated but failed to update email' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        profile,
      },
      { status: 200 }
    )

  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
