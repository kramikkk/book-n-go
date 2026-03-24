import { z } from "zod"

export type UserProfile = {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phone: string
}

const userProfileSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
})

const STORAGE_KEY = "bng_user_profile"

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = userProfileSchema.safeParse(JSON.parse(stored))
    if (!parsed.success) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const d = parsed.data
    return {
      firstName: d.firstName ?? "",
      middleName: d.middleName,
      lastName: d.lastName ?? "",
      email: d.email ?? "",
      phone: d.phone ?? "",
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}
