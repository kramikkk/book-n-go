"use client"
import { useState } from "react"
import { BookingsTable } from "@/components/bookings-table"
import { toast } from "sonner"

export function BookingsClient({ initialBookings }: { initialBookings: unknown[] }) {
  const [bookings, setBookings] = useState(initialBookings)

  const handleStatusChange = async (id: string, status: 'Completed' | 'Canceled') => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      toast.error('Failed to update booking status')
      return
    }
    setBookings((prev) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prev.map((b: any) => b.id === id ? { ...b, status } : b)
    )
    toast.success(`Booking marked as ${status}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BookingsTable bookings={bookings as any[]} onStatusChange={handleStatusChange} />
}
