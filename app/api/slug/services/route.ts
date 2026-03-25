import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server-admin"

// ─── GET /api/slug/services?slug=... ─────────────────────────────────────────
// Public endpoint that returns services for a business by slug.
// Used by the customer book-now page.
//
// Response 200:
//   {
//     services: {
//       appointment: ServiceOption[],
//       reservation: ServiceOption[],
//     }
//   }

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("client_id")
      .eq("slug", slug)
      .single()

    if (settingsError || !settings) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("services")
      .select("id, type, label, description, sort_order")
      .eq("client_id", settings.client_id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }

    const services = {
      appointment: (data ?? []).filter((s) => s.type === "appointment"),
      reservation: (data ?? []).filter((s) => s.type === "reservation"),
    }

    return NextResponse.json({ services }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
