"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconCalendarEvent, IconClipboardList, IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react"

type Tab = "appointment" | "reservation"

type Service = {
  id: string
  type: string
  label: string
  description: string | null
  sort_order: number
}

export function ServicesManager() {
  const [services, setServices] = React.useState<Service[]>([])
  const [tab, setTab] = React.useState<Tab>("appointment")
  const [newLabel, setNewLabel] = React.useState("")
  const [newDesc, setNewDesc] = React.useState("")
  const [dirty, setDirty] = React.useState<Set<string>>(new Set())
  const [saving, setSaving] = React.useState(false)
  const [adding, setAdding] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  // Fetch services on mount
  React.useEffect(() => {
    fetch("/api/client/services")
      .then((r) => r.json())
      .then((data) => {
        if (data.services) {
          const all = [...(data.services.appointment ?? []), ...(data.services.reservation ?? [])]
          setServices(all)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const tabServices = services.filter((s) => s.type === tab)

  const handleLabelChange = (id: string, value: string) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, label: value } : s))
    setDirty((prev) => new Set(prev).add(id))
  }

  const handleDescChange = (id: string, value: string) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, description: value } : s))
    setDirty((prev) => new Set(prev).add(id))
  }

  const handleAdd = async () => {
    const label = newLabel.trim()
    if (!label) return
    setAdding(true)
    setError("")

    const res = await fetch("/api/client/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: tab, label, description: newDesc.trim() || null }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Failed to add service")
    } else {
      setServices((prev) => [...prev, data.service])
      setNewLabel("")
      setNewDesc("")
    }
    setAdding(false)
  }

  const handleRemove = async (id: string) => {
    const res = await fetch(`/api/client/services/${id}`, { method: "DELETE" })
    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.id !== id))
      setDirty((prev) => { const next = new Set(prev); next.delete(id); return next })
    } else {
      const data = await res.json()
      setError(data.error || "Failed to delete service")
    }
  }

  const handleSave = async () => {
    if (dirty.size === 0) return
    setSaving(true)
    setError("")
    setSuccess(false)

    const updates = services.filter((s) => dirty.has(s.id))

    const results = await Promise.all(
      updates.map((s) =>
        fetch(`/api/client/services/${s.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: s.label, description: s.description || null }),
        })
      )
    )

    const failed = results.find((r) => !r.ok)
    if (failed) {
      setError("Failed to save some changes")
    } else {
      setDirty(new Set())
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    }
    setSaving(false)
  }

  const tabs: { key: Tab; label: string; Icon: React.ElementType }[] = [
    { key: "appointment", label: "Appointment", Icon: IconCalendarEvent },
    { key: "reservation", label: "Reservation", Icon: IconClipboardList },
  ]

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconClipboardList className="size-4 text-blue-500" />
          <h2 className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">
            Services &amp; Offerings
          </h2>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure the services customers can choose from when booking.
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {tabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Service list */}
        <div className="flex flex-col gap-2">
          {loading && <p className="py-2 text-center text-sm text-muted-foreground">Loading…</p>}
          {!loading && tabServices.length === 0 && (
            <p className="py-2 text-center text-sm text-muted-foreground">No services yet. Add one below.</p>
          )}
          {tabServices.map((service) => (
            <div key={service.id} className="flex items-start gap-2 rounded-lg border p-3">
              <IconGripVertical className="mt-0.5 size-4 shrink-0 cursor-grab text-muted-foreground/50" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Input
                  value={service.label}
                  onChange={(e) => handleLabelChange(service.id, e.target.value)}
                  placeholder="Service name"
                  className="h-8 text-sm font-medium"
                />
                <Input
                  value={service.description ?? ""}
                  onChange={(e) => handleDescChange(service.id, e.target.value)}
                  placeholder="Short description (optional)"
                  className="h-7 text-xs text-muted-foreground"
                />
              </div>
              <button
                onClick={() => handleRemove(service.id)}
                className="mt-0.5 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <IconTrash className="size-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3">
          <p className="text-xs font-medium text-muted-foreground">Add a new service</p>
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Service name"
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Short description (optional)"
            className="h-7 text-xs"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAdd}
            disabled={!newLabel.trim() || adding}
            className="gap-1.5"
          >
            <IconPlus className="size-3.5" />
            {adding ? "Adding…" : "Add Service"}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="mt-auto flex justify-end">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={dirty.size === 0 || saving}
            className={success ? "bg-green-600 hover:bg-green-600" : "bg-[#3A79C3] hover:bg-[#3164a8]"}
          >
            {saving ? "Saving…" : success ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
