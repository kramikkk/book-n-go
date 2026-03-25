import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const ref = searchParams.get("ref");
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }
    if (!phone && !ref) {
      return NextResponse.json({ error: "phone or ref required" }, { status: 400 });
    }

    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("client_id")
      .eq("slug", slug)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    let query = supabase
      .from("bookings")
      .select("*, services(label)")
      .eq("client_id", settings.client_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (ref) {
      query = supabase
        .from("bookings")
        .select("*, services(label)")
        .eq("client_id", settings.client_id)
        .eq("reference_number", ref)
        .maybeSingle();
    } else {
      query = supabase
        .from("bookings")
        .select("*, services(label)")
        .eq("client_id", settings.client_id)
        .eq("contact", phone!)
        .eq("status", "Pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
