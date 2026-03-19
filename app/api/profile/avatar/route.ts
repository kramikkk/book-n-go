import { createClient } from '@/lib/supabase/server'
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

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (profileError) {
      return NextResponse.json(
        { error: 'Image uploaded but failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Avatar updated successfully', avatar_url: publicUrl },
      { status: 200 }
    )
  } catch {
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

const DEFAULT_AVATAR = 'default-avatar.png'

export async function DELETE() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 })
    }

    // Remove every possible extension — we derive paths from MIME_TO_EXT so
    // this list stays in sync if new types are ever added.
    const paths = Object.values(MIME_TO_EXT).map((ext) => `${user.id}/avatar.${ext}`)
    const { error: storageError } = await supabase.storage.from('avatars').remove(paths)
    if (storageError) {
      // Non-fatal: the DB will still be reset to default. Log for cleanup.
      console.warn('[avatar delete] storage cleanup failed:', storageError.message)
    }

    // Reset profile back to the default avatar regardless of whether the
    // storage delete found anything — the important thing is the DB is clean.
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ avatar_url: DEFAULT_AVATAR })
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
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
