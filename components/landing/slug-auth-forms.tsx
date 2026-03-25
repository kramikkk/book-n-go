"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

type Mode = "signin" | "register"

interface SlugAuthFormsProps {
  slug: string
  colorsFrom: string
  colorsTo: string
  gradientBg: string
}

export function SlugAuthForms({ slug, colorsFrom, colorsTo, gradientBg }: SlugAuthFormsProps) {
  const router = useRouter()
  const [mode, setMode] = React.useState<Mode>("signin")

  // ── Sign-in state ──────────────────────────────────────────────────────────
  const [siEmail, setSiEmail]     = React.useState("")
  const [siPassword, setSiPassword] = React.useState("")
  const [siShowPw, setSiShowPw]   = React.useState(false)
  const [siError, setSiError]     = React.useState("")
  const [siLoading, setSiLoading] = React.useState(false)

  // ── Register state ─────────────────────────────────────────────────────────
  const [regFirst, setRegFirst]       = React.useState("")
  const [regMiddle, setRegMiddle]     = React.useState("")
  const [regLast, setRegLast]         = React.useState("")
  const [regEmail, setRegEmail]       = React.useState("")
  const [regPhone, setRegPhone]       = React.useState("")
  const [regPassword, setRegPassword]       = React.useState("")
  const [regConfirm, setRegConfirm]         = React.useState("")
  const [regShowPw, setRegShowPw]           = React.useState(false)
  const [regShowConfirm, setRegShowConfirm] = React.useState(false)
  const [regError, setRegError]             = React.useState("")
  const [regLoading, setRegLoading]   = React.useState(false)
  const [regSuccess, setRegSuccess]   = React.useState(false)

  const switchTo = (m: Mode) => {
    setSiError("")
    setRegError("")
    setRegSuccess(false)
    setMode(m)
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSiLoading(true)
    setSiError("")

    const res  = await fetch("/api/auth/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email: siEmail, password: siPassword }),
    })
    const data = await res.json()

    if (!res.ok) {
      setSiError(data.error || "Invalid email or password")
      setSiLoading(false)
      return
    }

    if (data.user?.role === "client") {
      setSiError("This portal is for customers only.")
      setSiLoading(false)
      return
    }

    router.push(`/${slug}/book-now`)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegLoading(true)
    setRegError("")

    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match")
      setRegLoading(false)
      return
    }

    const res  = await fetch("/api/auth/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        email:       regEmail,
        password:    regPassword,
        first_name:  regFirst,
        middle_name: regMiddle || undefined,
        last_name:   regLast,
        phone:       regPhone,
      }),
    })
    const data = await res.json()

    if (!res.ok) {
      setRegError(data.error || "Failed to create account")
      setRegLoading(false)
      return
    }

    setRegSuccess(true)
    setRegLoading(false)
    setTimeout(() => switchTo("signin"), 1500)
  }

  // ── Shared input focus style ───────────────────────────────────────────────
  const inputBase =
    "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"

  const btnPrimary: React.CSSProperties = {
    background: gradientBg,
    color: "#fff",
  }

  const btnOutline: React.CSSProperties = {
    borderColor: colorsFrom,
    color: colorsFrom,
  }

  return (
    <div
      className="w-full max-w-sm flex flex-col gap-5"
      style={{ "--brand": colorsFrom } as React.CSSProperties}
    >
      {/* Heading */}
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-sm text-gray-500">
          {mode === "signin"
            ? "Sign in to book your appointment"
            : "Fill in your details to get started"}
        </p>
      </div>

      {/* ── SIGN IN FORM ── */}
      {mode === "signin" && (
        <form onSubmit={handleSignIn} className="flex flex-col gap-3">
          <input
            type="email"
            value={siEmail}
            onChange={(e) => setSiEmail(e.target.value)}
            placeholder="Email address"
            required
            autoComplete="email"
            className={inputBase}
          />

          <div className="relative">
            <input
              type={siShowPw ? "text" : "password"}
              value={siPassword}
              onChange={(e) => setSiPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              className={`${inputBase} pr-10`}
            />
            <button
              type="button"
              onClick={() => setSiShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              tabIndex={-1}
            >
              {siShowPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {siError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{siError}</p>
          )}

          <button
            type="submit"
            disabled={siLoading}
            className="w-full rounded-xl py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
            style={btnPrimary}
          >
            {siLoading ? "Signing in…" : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={() => switchTo("register")}
            className="w-full rounded-xl border py-3 text-sm font-semibold transition hover:bg-gray-50"
            style={btnOutline}
          >
            Create Account
          </button>
        </form>
      )}

      {/* ── REGISTER FORM ── */}
      {mode === "register" && (
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          {regSuccess ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-5 text-center flex flex-col gap-2">
              <p className="text-sm font-semibold text-green-700">Account created!</p>
              <p className="text-xs text-green-600 leading-relaxed">
                Your account is ready. You can sign in now.
              </p>
              <button
                type="button"
                onClick={() => switchTo("signin")}
                className="mt-2 w-full rounded-xl py-2.5 text-sm font-semibold transition hover:opacity-90"
                style={btnPrimary}
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={regFirst}
                  onChange={(e) => setRegFirst(e.target.value)}
                  placeholder="First name"
                  required
                  autoComplete="given-name"
                  className={inputBase}
                />
                <input
                  type="text"
                  value={regLast}
                  onChange={(e) => setRegLast(e.target.value)}
                  placeholder="Last name"
                  required
                  autoComplete="family-name"
                  className={inputBase}
                />
              </div>

              <input
                type="text"
                value={regMiddle}
                onChange={(e) => setRegMiddle(e.target.value)}
                placeholder="Middle name (optional)"
                autoComplete="additional-name"
                className={inputBase}
              />

              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Email address"
                required
                autoComplete="email"
                className={inputBase}
              />

              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="Phone number"
                required
                autoComplete="tel"
                className={inputBase}
              />

              <div className="relative">
                <input
                  type={regShowPw ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password (min 8 characters)"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={`${inputBase} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setRegShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {regShowPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={regShowConfirm ? "text" : "password"}
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="Confirm password"
                  required
                  autoComplete="new-password"
                  className={`${inputBase} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setRegShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {regShowConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {regError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{regError}</p>
              )}

              <button
                type="submit"
                disabled={regLoading}
                className="w-full rounded-xl py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
                style={btnPrimary}
              >
                {regLoading ? "Creating account…" : "Create Account"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={() => switchTo("signin")}
                className="w-full rounded-xl border py-3 text-sm font-semibold transition hover:bg-gray-50"
                style={btnOutline}
              >
                Sign In
              </button>
            </>
          )}
        </form>
      )}
    </div>
  )
}
