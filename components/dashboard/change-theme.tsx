"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { IconPalette } from "@tabler/icons-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Moon, Sun, Monitor } from "lucide-react"

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

export const ChangeTheme = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      theme: "system",
      colorScheme: "blue",
    },
  })

  const onSubmit = (values: FormValues) => {
    console.log(values)
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
          Personalize the look and feel of your booking page for customers.
        </p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <CardContent className="flex flex-1 flex-col gap-6">

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

            {/* Color Scheme */}
            <FormField
              control={form.control}
              name="colorScheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {colorSchemes.map(({ value, label, hex }) => (
                        <button
                          key={value}
                          type="button"
                          title={label}
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                            field.value === value
                              ? "border-primary ring-2 ring-primary ring-offset-2"
                              : "border-border hover:border-muted-foreground"
                          )}
                        >
                          <span className="size-3 rounded-full" style={{ backgroundColor: hex }} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset()}
              disabled={!form.formState.isDirty}
              className={!form.formState.isDirty ? "pointer-events-none opacity-0" : ""}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isDirty}
              className={!form.formState.isDirty ? "pointer-events-none opacity-0" : ""}
            >
              Apply Theme
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
