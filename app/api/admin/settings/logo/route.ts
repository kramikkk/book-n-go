import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ─── POST /api/admin/settings/logo ───────────────────────────────────────────
// Uploads a new business logo and optionally updates the business name.
// Accepts multipart/form-data.
//
// Form fields:
//   logo          File     (required) — JPG, PNG, or GIF, max 2MB
//   business_name string   (optional) — updates business name at the same time
//
// Response 200:
//   { message: string, logo_url: string }

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const MAX_SIZE      = 2 * 1024 * 1024 // 2MB

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const formData     = await request.formData()
    const file         = formData.get('logo') as File | null
    const businessName = formData.get('business_name') as string | null

    // ── Validate file ──
    if (!file) {
      return NextResponse.json({ error: 'No logo file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG and GIF files are allowed' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB' },
        { status: 400 }
      )
    }

    // ── Upload to Supabase Storage ──
    // Each admin gets their own folder: logos/{admin_id}/logo.{ext}
    const fileExt  = file.name.split('.').pop()
    const fileName = `${user.id}/logo.${fileExt}`
    const buffer   = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true, // overwrite previous logo
      })

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload logo' },
        { status: 500 }
      )
    }

    // ── Get the public URL ──
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName)

    // ── Update settings row ──
    // Always update logo_url; also update business_name if it was provided
    const updates: Record<string, string> = { logo_url: publicUrl }
    if (businessName && businessName.trim().length > 0) {
      updates.business_name = businessName.trim()
    }

    const { error: settingsError } = await supabase
      .from('settings')
      .update(updates)
      .eq('admin_id', user.id)

    if (settingsError) {
      return NextResponse.json(
        { error: 'Logo uploaded but failed to update settings' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Logo updated successfully', logo_url: publicUrl },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/settings/logo ─────────────────────────────────────────
// Removes the business logo and clears logo_url in settings.
//
// Response 200:
//   { message: string }

export async function DELETE() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Try to remove all common extensions — we don't know which one was uploaded
    const extensions = ['jpg', 'jpeg', 'png', 'gif']
    const paths = extensions.map((ext) => `${user.id}/logo.${ext}`)

    await supabase.storage.from('logos').remove(paths)

    // Clear logo_url in settings regardless of whether a file existed
    const { error: settingsError } = await supabase
      .from('settings')
      .update({ logo_url: null })
      .eq('admin_id', user.id)

    if (settingsError) {
      return NextResponse.json(
        { error: 'Failed to clear logo from settings' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Logo removed successfully' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
