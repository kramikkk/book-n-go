"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IconBuildingStore } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be 50 characters or less")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  welcomeMessage: z.string().max(300, "Max 300 characters").optional(),
  seoTitle: z.string().max(60, "Max 60 characters").optional(),
  seoDescription: z.string().max(160, "Max 160 characters").optional(),
})

type FormValues = z.infer<typeof schema>

type Settings = {
  slug: string | null
  welcome_message: string | null
  seo_title: string | null
  seo_description: string | null
}

export const WebsiteConfiguration = ({ settings }: { settings?: Settings | null }) => {
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug:           settings?.slug            ?? "",
      welcomeMessage: settings?.welcome_message ?? "",
      seoTitle:       settings?.seo_title       ?? "",
      seoDescription: settings?.seo_description ?? "",
    },
  })

  const slug = form.watch("slug")

  const onSubmit = async (values: FormValues) => {
    setError("")
    setSuccess(false)

    const res = await fetch("/api/client/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug:                values.slug,
        welcome_message:     values.welcomeMessage  || null,
        seo_title:           values.seoTitle        || null,
        seo_description:     values.seoDescription  || null,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Failed to save settings")
      return
    }

    setSuccess(true)
    form.reset(values)
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBuildingStore className="size-4 text-blue-500" />
          <h1 className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">
            Website Configuration
          </h1>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage your website settings and online presence.
        </p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <CardContent className="flex flex-1 flex-col gap-6">

            {/* Booking Page */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Booking Page</p>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <div className="flex items-center overflow-hidden rounded-md border focus-within:ring-2 focus-within:ring-ring">
                          <span className="border-r bg-muted px-3 py-2 text-sm text-muted-foreground">
                            bookngo.com/
                          </span>
                          <input
                            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                            placeholder="my-business"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your page:{" "}
                        {slug ? (
                          <a
                            href={`/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-700"
                          >
                            bookngo.com/{slug}
                          </a>
                        ) : (
                          <span>bookngo.com/my-business</span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="welcomeMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Welcome Message</FormLabel>
                      <FormControl>
                        <Input placeholder="Welcome! Book your appointment with us today." {...field} />
                      </FormControl>
                      <FormDescription>Shown at the top of your booking page.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SEO */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Search Engine (SEO)</p>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My Business | Book an Appointment" {...field} />
                      </FormControl>
                      <FormDescription>Max 60 characters.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Book your next appointment online, fast and easy." {...field} />
                      </FormControl>
                      <FormDescription>Max 160 characters.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {error   && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">Settings saved successfully.</p>}

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { form.reset(); setError(""); setSuccess(false) }}
              disabled={!form.formState.isDirty}
              className={!form.formState.isDirty ? "pointer-events-none opacity-0" : ""}
            >
              Cancel Changes
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              className={!form.formState.isDirty ? "pointer-events-none opacity-0" : ""}
            >
              {form.formState.isSubmitting ? "Saving…" : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
