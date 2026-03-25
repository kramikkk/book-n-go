"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { slugCssVars } from "@/lib/slug-theme"

export function SlugThemeWrapper({
  theme,
  primaryColor,
  children,
}: {
  theme: "light" | "dark" | "system"
  primaryColor: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (theme === "dark") {
      el.classList.add("dark")
      return
    }

    if (theme === "light") {
      el.classList.remove("dark")
      return
    }

    // system — follow OS preference with stable listener reference
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => el.classList.toggle("dark", e.matches)
    el.classList.toggle("dark", mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  return (
    <div
      ref={ref}
      data-slug-theme=""
      className={`bg-background text-foreground${theme === "dark" ? " dark" : ""}`}
      style={slugCssVars(primaryColor) as React.CSSProperties}
    >
      {children}
    </div>
  )
}
