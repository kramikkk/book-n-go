import { redirect } from "next/navigation"
import { requireClient } from "@/lib/supabase/server"
import { BookingsClient } from "./bookings-client"

const BookingsPage = async () => {
  const { error, supabase, user } = await requireClient()
  if (error) redirect("/")

  const { data, error: dbError } = await supabase
    .from("bookings")
    .select(`
      id, reference_number, name, contact, date,
      time_start, time_end, type, status, created_at,
      services ( label )
    `)
    .eq("client_id", user!.id)
    .order("date", { ascending: false })
    .order("time_start", { ascending: false })

  const bookings = dbError ? [] : (data ?? [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6">
          <BookingsClient initialBookings={bookings} />
        </div>
      </div>
    </div>
  )
}

export default BookingsPage
