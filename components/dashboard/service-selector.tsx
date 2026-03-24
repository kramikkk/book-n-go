"use client"

import { cn } from "@/lib/utils"
import { type ServiceOption } from "@/lib/services-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCalendarEvent, IconClipboardList } from "@tabler/icons-react"

interface ServiceSelectorProps {
  bookingType: "Appointment" | "Reservation"
  services: ServiceOption[]
  value: string | null
  onChange: (id: string) => void
}

export function ServiceSelector({ bookingType, services, value, onChange }: ServiceSelectorProps) {
  const Icon = bookingType === "Appointment" ? IconCalendarEvent : IconClipboardList
  const title = bookingType === "Appointment" ? "Reason for Appointment" : "Type of Reservation"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4 text-blue-500" />
          <span className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">
            {title}
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select the service you need for your {bookingType.toLowerCase()}.
        </p>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No services configured yet. Contact the admin.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onChange(service.id)}
                aria-pressed={value === service.id}
                className={cn(
                  "flex flex-col gap-0.5 rounded-lg border p-3 text-left transition-all",
                  value === service.id
                    ? "border-[#3A79C3] bg-[#3A79C3]/10 ring-1 ring-[#3A79C3]"
                    : "hover:border-[#3A79C3]/50 hover:bg-[#3A79C3]/5"
                )}
              >
                <span className={cn("text-sm font-medium", value === service.id && "text-[#3A79C3]")}>
                  {service.label}
                </span>
                {service.description && (
                  <span className="text-xs text-muted-foreground">{service.description}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
