import { z } from "zod"

export type ServiceOption = {
  id: string
  label: string
  description?: string
}

export type ServicesConfig = {
  appointment: ServiceOption[]
  reservation: ServiceOption[]
}

export const DEFAULT_SERVICES: ServicesConfig = {
  appointment: [
    { id: "checkup", label: "Check-up", description: "Routine health or wellness examination" },
    { id: "consultation", label: "Consultation", description: "One-on-one professional consultation" },
    { id: "follow-up", label: "Follow-up Visit", description: "Follow-up on a previous appointment" },
    { id: "meeting", label: "Meeting", description: "Business or team meeting" },
  ],
  reservation: [
    { id: "room", label: "Room", description: "Private room booking" },
    { id: "conference", label: "Conference Hall", description: "Meeting and conference space" },
    { id: "event-place", label: "Event Place", description: "Large event or function venue" },
    { id: "table", label: "Table", description: "Dining or workspace table" },
  ],
}

const serviceOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
})

const servicesConfigSchema = z.object({
  appointment: z.array(serviceOptionSchema).optional(),
  reservation: z.array(serviceOptionSchema).optional(),
})

const STORAGE_KEY = "bng_services_config"

export function getServicesConfig(): ServicesConfig {
  if (typeof window === "undefined") return DEFAULT_SERVICES
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_SERVICES
    const parsed = servicesConfigSchema.safeParse(JSON.parse(stored))
    if (!parsed.success) {
      localStorage.removeItem(STORAGE_KEY)
      return DEFAULT_SERVICES
    }
    return {
      appointment: parsed.data.appointment ?? DEFAULT_SERVICES.appointment,
      reservation: parsed.data.reservation ?? DEFAULT_SERVICES.reservation,
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return DEFAULT_SERVICES
  }
}

export function saveServicesConfig(config: ServicesConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}
