import { notFound } from "next/navigation"
import Image from "next/image"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { SlugAuthForms } from "@/components/landing/slug-auth-forms"
import type { Metadata } from "next"

function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = createAnonClient()

  const { data: settings } = await supabase
    .from("settings")
    .select("business_name, seo_title, seo_description")
    .eq("slug", slug)
    .maybeSingle()

  const businessName = settings?.business_name || slug.replace(/-/g, " ")
  const title        = settings?.seo_title       || `${businessName} | Book an Appointment`
  const description  = settings?.seo_description || `Book your next appointment with ${businessName} online, fast and easy.`

  return { title, description }
}

export default async function BusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = createAnonClient()
  const { data: settings } = await supabase
    .from("settings")
    .select("business_name, logo_url, welcome_message")
    .eq("slug", slug)
    .maybeSingle()

  if (!settings) notFound()

  const businessName = settings.business_name || slug.replace(/-/g, " ")
  const logoSrc      = settings.logo_url     || "/BNGLogo.png"
  const [rawTitle, rawSubtitle] = (settings.welcome_message ?? "").split("||")
  const landingTitle    = rawTitle?.trim()    || "Elevate your booking experience."
  const landingSubtitle = rawSubtitle?.trim() || "Sign in or create an account to book an appointment."

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden">
      {/* Left panel — Premium Awwwards split-screen aesthetic */}
      <div
        className="relative hidden md:flex md:w-[60%] flex-col justify-between overflow-hidden p-16"
        style={{ background: "var(--slug-gradient)" }}
      >
        {/* Dynamic Abstract Background Geometry */}
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-white/20 mix-blend-overlay blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-[40%] -right-[20%] w-[600px] h-[600px] rounded-full bg-black/20 mix-blend-soft-light blur-[150px] animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-white/10 mix-blend-overlay blur-[100px] animate-bounce" style={{ animationDuration: "10s" }} />

        {/* Premium SVG Noise Texture Overlay */}
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.03] mix-blend-overlay"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {/* Top Logo Area */}
        <div className="relative z-10 flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-1000 delay-100">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl">
            <Image
              src={logoSrc}
              alt={businessName}
              width={48}
              height={48}
              className="rounded-xl object-cover"
            />
          </div>
          <span className="text-3xl font-black tracking-tight text-white/90 drop-shadow-md">
            {businessName}
          </span>
        </div>

        {/* Bottom Typography */}
        <div className="relative z-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="max-w-2xl">
            <h1 className="text-[4.5rem] mb-8 font-black text-white leading-[1] tracking-tighter drop-shadow-2xl">
              {landingTitle}
            </h1>
            <p className="max-w-xl text-white/80 text-2xl leading-relaxed font-medium tracking-tight drop-shadow-md">
              {landingSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 md:w-[40%] shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.15)] z-20">
        <div className="flex w-full flex-col items-center">
          {/* Mobile-only header */}
          <div className="mb-8 flex flex-col items-center gap-2 md:hidden animate-in fade-in zoom-in-95 duration-500">
            <Image
              src={logoSrc}
              alt={businessName}
              width={52}
              height={52}
              className="rounded-2xl object-cover"
            />
              <span className="text-lg font-black capitalize slug-gradient-text">{businessName}</span>
          </div>

          <SlugAuthForms slug={slug} />
        </div>

        <p className="absolute bottom-6 text-xs text-muted-foreground animate-in fade-in duration-1000 delay-700 fill-mode-both">
          Powered by BookNGo
        </p>
      </div>
    </div>
  )
}
