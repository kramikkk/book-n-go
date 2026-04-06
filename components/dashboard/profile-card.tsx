"use client"

import * as React from "react"
import { Camera } from "lucide-react"
import { IconPhoto } from "@tabler/icons-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const ProfileCard = ({
  avatarUrl: initialAvatarUrl,
}: {
  avatarUrl?: string | null
}) => {
  const router = useRouter()
  const [preview, setPreview] = React.useState<string | null>(null)
  const [isDirty, setIsDirty] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(initialAvatarUrl ?? null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setIsDirty(true)
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
    setIsDirty(true)
  }

  const handleCancel = () => {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
    setIsDirty(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (preview === null && isDirty) {
        // User removed their avatar
        const res = await fetch('/api/profile/avatar', { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to remove avatar')
        setAvatarUrl(null)
        toast.success('Avatar removed')
      } else if (file) {
        // User uploaded a new file
        const formData = new FormData()
        formData.append('avatar', file)
        const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData })
        if (!res.ok) throw new Error('Failed to upload avatar')
        const { avatar_url: newUrl } = await res.json()
        setAvatarUrl(newUrl)
        toast.success('Avatar updated')
      }
      setIsDirty(false)
      setFile(null)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconPhoto className="size-4 text-[var(--slug-primary)]" />
          <h1 className="slug-gradient-text text-base font-bold">
            Profile Picture
          </h1>
        </CardTitle>
        <CardDescription>Upload a photo to personalize your profile.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar className="size-24">
            <AvatarImage src={preview ?? avatarUrl ?? undefined} />
            <AvatarFallback className="text-2xl">BG</AvatarFallback>
          </Avatar>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90"
          >
            <Camera className="size-4" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold">Update your profile</h2>
          <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
          <div className="mt-1 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              Upload Photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={!preview}
              className={!preview ? "pointer-events-none opacity-0" : ""}
            >
              Remove
            </Button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          disabled={!isDirty}
          className={!isDirty ? "pointer-events-none opacity-0" : ""}
        >
          Cancel Changes
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={!isDirty ? "pointer-events-none opacity-0" : ""}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  )
}
