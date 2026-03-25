import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server-admin'
import { NextResponse }  from 'next/server'

// ─── POST /api/profile/avatar ─────────────────────────────────────────────────
// Uploads a new avatar image for the currently logged-in user.
// Accepts multipart/form-data.
//
// Form fields:
//   avatar   File   (required) — JPG, PNG, or GIF, max 2 MB
//
// Response 200:
//   { message: string, avatar_url: string }

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'] as const
const MAX_SIZE      = 2 * 1024 * 1024 // 2 MB

// Extension is derived from the validated MIME type, NOT from the filename.
// A user could name their file "evil.php" and get it stored with a dangerous
// extension if we trusted file.name — always use this map instead.
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/gif':  'gif',
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 })
    }

    const formData = await request.formData()
    const file     = formData.get('avatar') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type as typeof ALLOWED_TYPES[number])) {
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
    const fileName = `${user.id}/avatar.${fileExt}`
    const buffer   = await file.arrayBuffer()

    const adminClient = createAdminClient()

    const { error: uploadError } = await adminClient.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('[avatar upload] storage error:', uploadError.message)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = adminClient.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Append cache-busting timestamp so the browser always loads the new image
    // even though the filename stays the same across uploads.
    const avatarUrl = `${publicUrl}?t=${Date.now()}`

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)

    if (profileError) {
      console.error('[avatar upload] profile update failed:', profileError.message)
      return NextResponse.json(
        { error: 'Image uploaded but failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Avatar updated successfully', avatar_url: avatarUrl },
      { status: 200 }
    )
  } catch (err) {
    console.error('[avatar upload] unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ─── DELETE /api/profile/avatar ───────────────────────────────────────────────
// Removes the user's avatar and resets it to the default.
//
// FIX: this endpoint was missing entirely. Without it there was no way for a
// user to revert to the default avatar once they had uploaded one.
//
// Response 200:
//   { message: string }

export async function DELETE() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 })
    }

    const adminClient = createAdminClient()

    const paths = Object.values(MIME_TO_EXT).map((ext) => `${user.id}/avatar.${ext}`)
    const { error: storageError } = await adminClient.storage.from('avatars').remove(paths)
    if (storageError) {
      console.warn('[avatar delete] storage cleanup failed:', storageError.message)
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id)

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to reset avatar' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Avatar removed successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[avatar delete] unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
