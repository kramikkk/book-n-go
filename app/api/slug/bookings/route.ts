import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("client_id")
      .eq("slug", slug)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const clientId = settings.client_id;

    // Validate serviceId belongs to this client (if provided)
    if (body.serviceId) {
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .select("id")
        .eq("id", body.serviceId)
        .eq("client_id", clientId)
        .maybeSingle();

      if (serviceError || !service) {
        return NextResponse.json({ error: "Invalid service" }, { status: 400 });
      }
    }

    let safeDate = body.date;
    try {
      safeDate = new Date(body.date).toISOString().split('T')[0];
    } catch {
      // keep original if parse fails
    }

    let safeTimeStart = body.startTime;
    if (safeTimeStart?.includes('-')) {
      safeTimeStart = safeTimeStart.split('-')[0].trim();
    }

    let safeTimeEnd = body.endTime;
    if (safeTimeEnd?.includes('-')) {
      safeTimeEnd = safeTimeEnd.split('-')[0].trim();
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([{
        client_id: clientId,
        reference_number: body.ref,
        name: body.name,
        contact: body.phone,
        date: safeDate,
        time_start: safeTimeStart,
        time_end: safeTimeEnd,
        service_id: body.serviceId,
        type: body.type,
        status: "Pending",
      }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
