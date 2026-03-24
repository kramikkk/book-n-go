"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { BookingReceipt, type BookingReceiptData } from "@/components/booking-receipt"
import { IconCalendarOff } from "@tabler/icons-react"
import { getUserProfile } from "@/lib/user-profile"

function parseReceiptData(params: URLSearchParams): BookingReceiptData | null {
  const ref = params.get("ref")
  const issuedAtRaw = params.get("issuedAt")
  const dateRaw = params.get("date")
  const startTime = params.get("startTime")
  const endTime = params.get("endTime")
  const name = params.get("name")
  const email = params.get("email")
  const phone = params.get("phone")

  if (!ref || !issuedAtRaw || !dateRaw || !startTime || !endTime || !name || !email || !phone) {
    return null
  }

  const issuedAt = new Date(issuedAtRaw)
  const date = new Date(dateRaw)
  if (isNaN(issuedAt.getTime()) || isNaN(date.getTime())) return null

  const duration = params.get("duration") || null
  const bookingType = params.get("bookingType") || "Appointment"
  const service = params.get("service") || undefined

  return {
    bookingRef: ref,
    issuedAt,
    date,
    startTime,
    endTime,
    duration,
    location: "Main Branch",
    bookingType,
    service,
    fullName: name,
    email,
    phone,
  }
}

export default function MyBookingPage() {
  const searchParams = useSearchParams()
  const [data, setData] = React.useState<BookingReceiptData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // First try URL params (coming from book-now flow)
    const fromParams = parseReceiptData(searchParams)
    if (fromParams) {
      setData(fromParams)
      setLoading(false)
      return
    }

    // Fallback: fetch latest pending booking from Supabase
    const profile = getUserProfile()
    if (!profile?.phone) {
      setLoading(false)
      return
    }

    fetch(`/api/slug/my-booking?phone=${encodeURIComponent(profile.phone)}`)
      .then((res) => res.json())
      .then(({ data: booking }) => {
        if (!booking) return

        const profile = getUserProfile()
        const mapped: BookingReceiptData = {
          bookingRef: booking.id,
          issuedAt: new Date(booking.created_at),
          date: new Date(booking.date),
          startTime: booking.time_start,
          endTime: booking.time_end,
          duration: null,
          location: "Main Branch",
          bookingType: booking.type,
          service: booking.service_id || undefined,
          fullName: booking.name,
          email: profile?.email ?? "",
          phone: booking.contact,
        }
        setData(mapped)
      })
      .catch((err) => console.error("Failed to fetch booking:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Loading your booking...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
          <IconCalendarOff className="size-10 opacity-40" />
          <p className="text-sm">No active booking found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <BookingReceipt data={data} />
      </div>
    </div>
  )
}