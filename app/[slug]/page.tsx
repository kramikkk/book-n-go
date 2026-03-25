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

  const businessName   = settings.business_name  || slug.replace(/-/g, " ")
  const welcomeMessage = settings.welcome_message || "Sign in or create an account to book an appointment."
  const logoSrc        = settings.logo_url        || "/BNGLogo.png"

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden">
      {/* Left panel — gradient driven by --slug-gradient CSS var */}
      <div
        className="relative hidden md:flex md:w-[55%] flex-col items-center justify-center px-12 py-16"
        style={{ background: "var(--slug-gradient)" }}
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
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 md:w-[45%]">
        {/* Mobile-only header */}
        <div className="mb-8 flex flex-col items-center gap-2 md:hidden">
          <Image
            src={logoSrc}
            alt={businessName}
            width={52}
            height={52}
            className="rounded-2xl object-cover"
          />
          <span className="text-lg font-bold capitalize">{businessName}</span>
        </div>

        <SlugAuthForms slug={slug} />

        <p className="absolute bottom-6 text-xs text-muted-foreground">Powered by BookNGo</p>
      </div>
    </div>
  )
}
