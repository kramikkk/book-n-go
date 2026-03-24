"use client"

import * as React from "react"
import { useParams, useSearchParams } from "next/navigation"
import { BookingReceipt, type BookingReceiptData } from "@/components/booking-receipt"
import { IconCalendarOff } from "@tabler/icons-react"
import { getUserProfile } from "@/lib/user-profile"

export default function MyBookingPage() {
  const { slug } = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const [data, setData] = React.useState<BookingReceiptData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const ref = searchParams.get("ref")

    // Path 1: ref in URL (coming from book-now flow after 3.2 fix)
    if (ref) {
      fetch(`/api/slug/my-booking?ref=${encodeURIComponent(ref)}&slug=${encodeURIComponent(slug)}`)
        .then((res) => res.json())
        .then(({ data: booking }) => {
          if (!booking) return
          setData(bookingToReceiptData(booking))
        })
        .catch((err) => console.error("Failed to fetch booking by ref:", err))
        .finally(() => setLoading(false))
      return
    }

    // Path 2: phone fallback (direct navigation to /my-booking)
    const profile = getUserProfile()
    if (!profile?.phone) {
      setLoading(false)
      return
    }

    fetch(`/api/slug/my-booking?phone=${encodeURIComponent(profile.phone)}&slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then(({ data: booking }) => {
        if (!booking) return
        // Pass profile.email as fallback since it's not stored in the booking row
        setData(bookingToReceiptData(booking, profile.email))
      })
      .catch((err) => console.error("Failed to fetch booking:", err))
      .finally(() => setLoading(false))
  }, [slug, searchParams])

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bookingToReceiptData(booking: any, fallbackEmail?: string): BookingReceiptData {
  // Parse date as local time (not UTC) to avoid off-by-one in UTC- timezones
  const dateStr: string = booking.date ?? ""
  const date = new Date(dateStr + "T00:00:00")

  // services join returns { label: string } or null
  const serviceLabel: string | undefined =
    booking.services?.label ?? undefined

  return {
    bookingRef: booking.reference_number ?? booking.id,
    issuedAt: new Date(booking.created_at),
    date,
    startTime: booking.time_start,
    endTime: booking.time_end,
    duration: null,
    location: "Main Branch",
    bookingType: booking.type,
    service: serviceLabel,
    fullName: booking.name,
    email: fallbackEmail ?? "",
    phone: booking.contact,
  }
}
