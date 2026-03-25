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
    const html = document.documentElement
    if (!el) return

    // Hoist slug CSS variables to <html> so portaled elements (mobile sidebar
    // sheet, dropdowns) can access them outside [data-slug-theme].
    const vars = slugCssVars(primaryColor)
    Object.entries(vars).forEach(([k, v]) => html.style.setProperty(k, v))

    const applyDark = (dark: boolean) => {
      el.classList.toggle("dark", dark)
      html.classList.toggle("dark", dark)
    }

    if (theme === "dark") {
      applyDark(true)
      return
    }

    if (theme === "light") {
      applyDark(false)
      return
    }

    // system — follow OS preference with stable listener reference
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => applyDark(e.matches)
    applyDark(mq.matches)
    mq.addEventListener("change", handler)
    return () => {
      mq.removeEventListener("change", handler)
      html.classList.remove("dark")
    }
  }, [theme, primaryColor])

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
