import React from "react"
import Image from "next/image"
import Link from "next/link"

export default async function BusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f4ff] to-[#e8f7f7] px-4">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Image
          src="/BNGLogo.png"
          alt="BookNGo"
          width={80}
          height={80}
          className="rounded-xl"
        />
        <span className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-4xl font-bold text-transparent">
          BookNGo
        </span>
        <span className="text-sm text-gray-500 capitalize">{slug.replace(/-/g, " ")}</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Welcome</h1>
        <p className="text-center text-gray-500 text-sm">Sign in or create an account to book an appointment.</p>

        {/* Sign In: navigate to /{slug}/book-now with ?login=true to trigger login modal */}
        <Link
          href={`/${slug}/book-now?login=true`}
          className="w-full rounded-lg bg-gradient-to-r from-[#3F51B5] to-[#329A9A] py-3 text-center text-white font-semibold hover:opacity-90 transition"
        >
          Sign In
        </Link>

        {/* Create Account: navigate to /signup */}
        <Link
          href="/signup"
          className="w-full rounded-lg border border-[#3A79C3] py-3 text-center text-[#3A79C3] font-semibold hover:bg-[#f0f4ff] transition"
        >
          Create Account
        </Link>
      </div>
    </div>
  )
}
