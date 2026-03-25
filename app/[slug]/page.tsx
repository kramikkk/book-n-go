import { notFound } from "next/navigation"
import Image from "next/image"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { SlugAuthForms } from "@/components/landing/slug-auth-forms"

const colorMap: Record<string, { from: string; to: string }> = {
  blue:   { from: "#3B82F6", to: "#1D4ED8" },
  indigo: { from: "#6366F1", to: "#4338CA" },
  purple: { from: "#A855F7", to: "#7C3AED" },
  rose:   { from: "#F43F5E", to: "#BE123C" },
  orange: { from: "#F97316", to: "#C2410C" },
  green:  { from: "#22C55E", to: "#15803D" },
  teal:   { from: "#14B8A6", to: "#0F766E" },
}

export default async function BusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: settings } = await supabase
    .from("settings")
    .select("business_name, logo_url, welcome_message, primary_color")
    .eq("slug", slug)
    .maybeSingle()

  if (!settings) notFound()

  const businessName   = settings.business_name  || slug.replace(/-/g, " ")
  const welcomeMessage = settings.welcome_message || "Sign in or create an account to book an appointment."
  const colors         = colorMap[settings.primary_color ?? ""] ?? colorMap.blue
  const logoSrc        = settings.logo_url || "/BNGLogo.png"

  const gradientBg = `linear-gradient(135deg, ${colors.from}, ${colors.to})`

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden">
      {/* Left panel — hidden on mobile */}
      <div
        className="relative hidden md:flex md:w-[55%] flex-col items-center justify-center px-12 py-16"
        style={{ background: gradientBg }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -right-12 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <Image
            src={logoSrc}
            alt={businessName}
            width={80}
            height={80}
            className="rounded-2xl object-cover shadow-lg"
          />
          <h1 className="text-4xl font-bold text-white capitalize leading-tight">
            {businessName}
          </h1>
          <p className="max-w-sm text-white/80 text-base leading-relaxed">
            {welcomeMessage}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 md:w-[45%]">
        {/* Mobile-only header */}
        <div className="mb-8 flex flex-col items-center gap-2 md:hidden">
          <Image
            src={logoSrc}
            alt={businessName}
            width={52}
            height={52}
            className="rounded-2xl object-cover"
          />
          <span className="text-lg font-bold text-gray-800 capitalize">{businessName}</span>
        </div>

        <SlugAuthForms
          slug={slug}
          colorsFrom={colors.from}
          colorsTo={colors.to}
          gradientBg={gradientBg}
        />

        <p className="absolute bottom-6 text-xs text-gray-400">Powered by BookNGo</p>
      </div>
    </div>
  )
}
