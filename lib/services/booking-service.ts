import { createClient } from "../supabase/server";
import { Booking } from "../schemas";

export async function getBookedSlots(date: Date, adminId?: string): Promise<string[]> {
  const supabase = await createClient();
  const dateStr = date.toISOString().split('T')[0];

  let query = supabase
    .from('bookings')
    .select('time_start, time_end')
    .eq('date', dateStr)
    .in('status', ['Pending', 'Confirmed']);

  if (adminId) {
    query = query.eq('admin_id', adminId);
  }

  const { data } = await query;
  if (!data) return [];

  // Basic implementation: just return time_start of booked slots
  return data.map((b: any) => b.time_start);
}

export async function getFullyBookedDates(adminId?: string): Promise<Date[]> {
  // In a real implementation we would group by date and count slots
  return [];
}

export async function getAllBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return [];

  const { data } = await supabase
    .from('bookings')
    .select(`
      id,
      name,
      contact,
      date,
      time_start,
      time_end,
      type,
      status,
      service_id,
      profiles!bookings_customer_id_fkey ( email )
    `)
    .eq('admin_id', user.id)
    .order('date', { ascending: false })
    .order('time_start', { ascending: false });

  if (!data) return [];

  return data.map((b: any) => ({
    id: b.id,
    ref: b.id.substring(0, 8).toUpperCase(),
    name: b.name,
    email: b.profiles[0]?.email || '',
    contact: b.contact,
    date: new Date(b.date),
    timeStart: b.time_start,
    timeEnd: b.time_end,
    type: b.type,
    service: b.service_id ? "Service" : "Service", // In a real app we would join the services table
    status: b.status,
    location: "Main Branch",
  }));
}
