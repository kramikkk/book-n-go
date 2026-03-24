"use client"

import * as React from "react"
import { DEFAULT_SERVICES, getServicesConfig, saveServicesConfig, type ServiceOption, type ServicesConfig } from "@/lib/services-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconCalendarEvent, IconClipboardList, IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react"

type Tab = "appointment" | "reservation"

export function ServicesManager() {
  const [config, setConfig] = React.useState<ServicesConfig>(DEFAULT_SERVICES)
  const [tab, setTab] = React.useState<Tab>("appointment")
  const [newLabel, setNewLabel] = React.useState("")
  const [newDesc, setNewDesc] = React.useState("")
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    setConfig(getServicesConfig())
  }, [])

  const services = config[tab]

  const handleAdd = () => {
    const label = newLabel.trim()
    if (!label) return
    const id = label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const option: ServiceOption = { id: `${id}-${Date.now()}`, label, ...(newDesc.trim() ? { description: newDesc.trim() } : {}) }
    setConfig((prev) => ({ ...prev, [tab]: [...prev[tab], option] }))
    setNewLabel("")
    setNewDesc("")
  }

  const handleRemove = (id: string) => {
    setConfig((prev) => ({ ...prev, [tab]: prev[tab].filter((s) => s.id !== id) }))
  }

  const handleLabelChange = (id: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [tab]: prev[tab].map((s) => (s.id === id ? { ...s, label: value } : s)),
    }))
  }

  const handleDescChange = (id: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [tab]: prev[tab].map((s) => (s.id === id ? { ...s, description: value } : s)),
    }))
  }

  const handleSave = () => {
    saveServicesConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setConfig(DEFAULT_SERVICES)
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
          {services.length === 0 && (
            <p className="py-2 text-center text-sm text-muted-foreground">No services yet. Add one below.</p>
          )}
          {services.map((service) => (
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
            disabled={!newLabel.trim()}
            className="gap-1.5"
          >
            <IconPlus className="size-3.5" />
            Add Service
          </Button>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Reset to defaults
          </button>
          <Button
            size="sm"
            onClick={handleSave}
            className={saved ? "bg-green-600 hover:bg-green-600" : "bg-[#3A79C3] hover:bg-[#3164a8]"}
          >
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
