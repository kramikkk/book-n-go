import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function POST(request: Request) {
  console.log("/api/bookings POST hit");
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    // 1. Format the Date
    let safeDate = body.date;
    try {
      safeDate = new Date(body.date).toISOString().split('T')[0];
    } catch (e) {
      console.warn("Could not parse date:", body.date);
    }

    // 2. Format time_start
    let safeTimeStart = body.startTime;
    if (safeTimeStart && safeTimeStart.includes('-')) {
      safeTimeStart = safeTimeStart.split('-')[0].trim();
    }

    // 3. Format time_end
    let safeTimeEnd = body.endTime;
    if (safeTimeEnd && safeTimeEnd.includes('-')) {
      safeTimeEnd = safeTimeEnd.split('-')[0].trim();
    }

    // 4. Insert
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          name: body.name,
          contact: body.phone,
          date: safeDate,
          time_start: safeTimeStart,
          time_end: safeTimeEnd,
          service_id: body.serviceId,
          type: body.type,
          status: "Pending",       
        }
      ])
      .select();

    if (error) {
      console.error("Database Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}