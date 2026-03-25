"use client"

import * as React from "react"
import { useRef, useState } from "react"
import { Camera } from "lucide-react"
import { IconBuildingStore } from "@tabler/icons-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const BusinessProfile = ({
  businessName: initialBusinessName = "",
  logoUrl: initialLogoUrl = null,
}: {
  businessName?: string
  logoUrl?: string | null
}) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl)
  const [businessName, setBusinessName] = useState(initialBusinessName)
  const [isDirty, setIsDirty] = useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setIsDirty(true)
  }

  const handleRemove = () => {
    setPreview(null)
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
    setIsDirty(true)
  }

  const handleCancel = () => {
    setPreview(null)
    setFile(null)
    setBusinessName(initialBusinessName)
    if (inputRef.current) inputRef.current.value = ""
    setIsDirty(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const ops: Promise<Response>[] = []

      if (file) {
        const formData = new FormData()
        formData.append('logo', file)
        const res = await fetch('/api/client/settings/logo', { method: 'POST', body: formData })
        if (!res.ok) throw new Error('Failed to upload logo')
        const { logo_url: newUrl } = await res.json()
        setLogoUrl(newUrl)
      } else if (preview === null && isDirty && logoUrl) {
        const res = await fetch('/api/client/settings/logo', { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to remove logo')
        setLogoUrl(null)
      }

      if (businessName.trim() !== initialBusinessName) {
        const res = await fetch('/api/client/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ business_name: businessName.trim() }),
        })
        if (!res.ok) throw new Error('Failed to update business name')
      }

      toast.success('Business profile updated')
      setIsDirty(false)
      setFile(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBuildingStore className="size-4 text-blue-500" />
          <h1 className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">
            Business Profile
          </h1>
        </CardTitle>
        <CardDescription>Upload your business profile to personalize your workspace.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar className="size-20">
              <AvatarImage src={preview ?? logoUrl ?? undefined} />
              <AvatarFallback className="text-2xl">BL</AvatarFallback>
            </Avatar>
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90"
            >
              <Camera className="size-4" />
            </button>
          </div>

          {/* Text & buttons */}
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">Update your business logo</h2>
            <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
            <div className="mt-1 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                Upload Logo
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
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Business Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            placeholder="e.g. Book N Go Salon"
            value={businessName}
            onChange={(e) => { setBusinessName(e.target.value); setIsDirty(true) }}
          />
        </div>
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
