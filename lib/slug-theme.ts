export const SLUG_COLORS = {
  blue:   { primary: "#3B82F6", dark: "#1D4ED8" },
  indigo: { primary: "#6366F1", dark: "#4338CA" },
  purple: { primary: "#A855F7", dark: "#7C3AED" },
  rose:   { primary: "#F43F5E", dark: "#BE123C" },
  orange: { primary: "#F97316", dark: "#C2410C" },
  green:  { primary: "#22C55E", dark: "#15803D" },
  teal:   { primary: "#14B8A6", dark: "#0F766E" },
} as const

export type SlugColorKey = keyof typeof SLUG_COLORS

export function getSlugColors(key: string) {
  return SLUG_COLORS[key as SlugColorKey] ?? SLUG_COLORS.blue
}

export function slugCssVars(primaryColor: string): Record<string, string> {
  const c = getSlugColors(primaryColor)
  return {
    "--slug-primary":      c.primary,
    "--slug-primary-dark": c.dark,
    "--slug-gradient":     `linear-gradient(135deg, ${c.primary}, ${c.dark})`,
  }
}
