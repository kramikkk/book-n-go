import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, first_name, middle_name, last_name, phone } = await request.json()

    // Validate required fields
    if (!email || !password || !first_name || !last_name || !phone) {
      return NextResponse.json(
        { error: 'Email, password, first name, last name and phone number are required' },
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

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Update profile with user information
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name,
        middle_name: middle_name || null, // optional
        last_name,
        phone: phone,
        email,
      })
      .eq('id', authData.user.id)

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Account created successfully! Please check your email to verify your account.' },
      { status: 201 }
    )

  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}