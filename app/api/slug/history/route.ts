import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const slug = searchParams.get("slug");

    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("admin_id")
      .eq("slug", slug)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("contact", phone)
      .eq("admin_id", settings.admin_id)
      .order("date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
