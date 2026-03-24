import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { TIME_SLOTS } from "@/lib/booking-constants";

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const date = searchParams.get("date"); // optional: YYYY-MM-DD

    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    // Resolve admin_id from slug
    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("admin_id")
      .eq("slug", slug)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const adminId = settings.admin_id;

    // Mode 1: date provided → return booked slots for that date
    if (date) {
      const { data, error } = await supabase
        .from("bookings")
        .select("time_start")
        .eq("admin_id", adminId)
        .eq("date", date)
        .neq("status", "Canceled");

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const bookedSlots = (data ?? []).map((b) => b.time_start).filter(Boolean);
      return NextResponse.json({ bookedSlots }, { status: 200 });
    }

    // Mode 2: no date → return fully booked dates in next 30 days
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const future = new Date(today);
    future.setDate(future.getDate() + 30);
    const futureStr = future.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("bookings")
      .select("date, time_start")
      .eq("admin_id", adminId)
      .neq("status", "Canceled")
      .gte("date", todayStr)
      .lte("date", futureStr);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group booked time_starts by date
    const slotsByDate = new Map<string, Set<string>>();
    for (const row of data ?? []) {
      if (!slotsByDate.has(row.date)) slotsByDate.set(row.date, new Set());
      if (row.time_start) slotsByDate.get(row.date)!.add(row.time_start);
    }

    // A date is "fully booked" when every slot in TIME_SLOTS appears as booked
    const fullyBookedDates: string[] = [];
    for (const [d, slots] of slotsByDate.entries()) {
      if (TIME_SLOTS.every((s) => slots.has(s))) {
        fullyBookedDates.push(d);
      }
    }

    return NextResponse.json({ fullyBookedDates }, { status: 200 });

  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
