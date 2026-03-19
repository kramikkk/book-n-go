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

// Extension is derived from the validated MIME type, NOT from the filename,
// so a user can't spoof the extension by naming their file e.g. "evil.php".
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/gif':  'gif',
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user)                                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' },    { status: 403 })

    const formData     = await request.formData()
    const file         = formData.get('logo') as File | null
    const businessName = formData.get('business_name') as string | null

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

    const fileExt  = MIME_TO_EXT[file.type]
    const fileName = `${user.id}/logo.${fileExt}`
    const buffer   = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName)

    const updates: Record<string, string> = { logo_url: publicUrl }
    if (businessName && businessName.trim().length > 0) {
      updates.business_name = businessName.trim()
    }

    const { error: settingsError } = await supabase
      .from('settings')
      .upsert({ admin_id: user.id, ...updates }, { onConflict: 'admin_id' })

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
    if (!user)                                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.app_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' },    { status: 403 })

    // FIX: derive paths from MIME_TO_EXT instead of a hand-written extensions
    // list. The old list included 'jpeg' which was never written by the upload
    // (which always uses 'jpg'), and would silently diverge if MIME_TO_EXT
    // were ever updated.
    const paths = Object.values(MIME_TO_EXT).map((ext) => `${user.id}/logo.${ext}`)
    await supabase.storage.from('logos').remove(paths)

    const { error: settingsError } = await supabase
      .from('settings')
      .upsert({ admin_id: user.id, logo_url: null }, { onConflict: 'admin_id' })

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
