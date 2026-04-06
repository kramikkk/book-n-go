"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IconPalette } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Moon, Sun, Monitor } from "lucide-react"
import { getSlugColors } from "@/lib/slug-theme"

const colorSchemes = [
  { value: "blue",   label: "Blue",   hex: "#3B82F6" },
  { value: "indigo", label: "Indigo", hex: "#6366F1" },
  { value: "purple", label: "Purple", hex: "#A855F7" },
  { value: "rose",   label: "Rose",   hex: "#F43F5E" },
  { value: "orange", label: "Orange", hex: "#F97316" },
  { value: "green",  label: "Green",  hex: "#22C55E" },
  { value: "teal",   label: "Teal",   hex: "#14B8A6" },
]

const themeOptions = [
  { value: "light",  label: "Light",  icon: Sun },
  { value: "dark",   label: "Dark",   icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

const schema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  colorScheme: z.enum(["blue", "indigo", "purple", "rose", "orange", "green", "teal"]),
})

type FormValues = z.infer<typeof schema>

export const ChangeTheme = ({
  primaryColor = "blue",
  theme = "system",
}: {
  primaryColor?: string
  theme?: string
}) => {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validColor = colorSchemes.some((c) => c.value === primaryColor)
    ? (primaryColor as FormValues["colorScheme"])
    : "blue"

  const validTheme = themeOptions.some((t) => t.value === theme)
    ? (theme as FormValues["theme"])
    : "system"

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { theme: validTheme, colorScheme: validColor },
  })

  const watchedColor = form.watch("colorScheme")
  const watchedTheme = form.watch("theme")
  const previewColors = getSlugColors(watchedColor)
  const previewGradient = `linear-gradient(135deg, ${previewColors.primary}, ${previewColors.dark})`

  const isSubmitting = submitState === "loading"

  const onSubmit = async (values: FormValues) => {
    setSubmitState("loading")
    setErrorMessage(null)
    try {
      const res = await fetch("/api/client/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primary_color: values.colorScheme, theme: values.theme }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? "Failed to save theme")
      }
      setSubmitState("success")
      form.reset(values)
    } catch (err) {
      setSubmitState("error")
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconPalette className="size-4 text-blue-500" />
          <h1 className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">
            Theme & Appearance
          </h1>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize the look of your customer-facing booking page.
        </p>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <CardContent className="flex flex-1 flex-col gap-5">

            {/* Live preview strip */}
            <div className="overflow-hidden rounded-xl border">
              {/* Gradient header preview */}
              <div
                className="h-12 w-full transition-all duration-300"
                style={{ background: previewGradient }}
              />
              {/* Mock page preview */}
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-3 text-xs transition-colors duration-300",
                  watchedTheme === "dark"
                    ? "bg-zinc-900 text-zinc-200"
                    : "bg-white text-zinc-700"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-5 rounded-full"
                    style={{ background: previewGradient }}
                  />
                  <span className="font-medium">Your Business</span>
                </div>
                <div
                  className="rounded-md px-2.5 py-1 text-[10px] font-semibold text-white"
                  style={{ background: previewGradient }}
                >
                  Book Now
                </div>
              </div>
              <div
                className={cn(
                  "px-4 pb-3 pt-1 transition-colors duration-300",
                  watchedTheme === "dark" ? "bg-zinc-900" : "bg-white"
                )}
              >
                <div className={cn("h-2 w-3/4 rounded-full", watchedTheme === "dark" ? "bg-zinc-700" : "bg-zinc-100")} />
                <div className={cn("mt-1.5 h-2 w-1/2 rounded-full", watchedTheme === "dark" ? "bg-zinc-800" : "bg-zinc-50")} />
              </div>
            </div>

            {/* Theme Mode */}
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Mode</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {themeOptions.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-medium transition-all",
                            field.value === value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-muted-foreground"
                          )}
                        >
                          <Icon className="size-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Primary Color */}
            <FormField
              control={form.control}
              name="colorScheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Color</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-7 gap-2">
                      {colorSchemes.map(({ value, label, hex }) => {
                        const colors = getSlugColors(value)
                        const gradient = `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`
                        return (
                          <button
                            key={value}
                            type="button"
                            title={label}
                            onClick={() => field.onChange(value)}
                            className={cn(
                              "group flex flex-col items-center gap-1.5",
                            )}
                          >
                            <span
                              className={cn(
                                "block size-8 rounded-full transition-all duration-200 ring-offset-2",
                                field.value === value
                                  ? "ring-2 scale-110"
                                  : "hover:scale-105 opacity-70 hover:opacity-100"
                              )}
                              style={{
                                background: gradient,
                                // @ts-ignore
                                "--tw-ring-color": hex,
                              }}
                            />
                            <span className={cn(
                              "text-[9px] font-medium transition-colors",
                              field.value === value ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feedback */}
            {submitState === "success" && (
              <p className="text-sm text-green-600 font-medium">Theme saved — your booking page is updated.</p>
            )}
            {submitState === "error" && (
              <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
            )}

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { form.reset(); setSubmitState("idle") }}
              disabled={!form.formState.isDirty || isSubmitting}
              className={!form.formState.isDirty ? "pointer-events-none opacity-0" : ""}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isSubmitting}
              className={!form.formState.isDirty ? "pointer-events-none opacity-0" : ""}
            >
              {isSubmitting ? "Applying…" : "Apply Theme"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
