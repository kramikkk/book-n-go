"use client"
import { useState } from "react"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { toast } from "sonner"

export function BookingsClient({ initialBookings }: { initialBookings: unknown[] }) {
  const [bookings, setBookings] = useState(initialBookings)

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/client/bookings/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Failed to delete booking')
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setBookings((prev) => prev.filter((b: any) => b.id !== id))
    toast.success('Booking deleted')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BookingsTable bookings={bookings as any[]} onDelete={handleDelete} />
}
