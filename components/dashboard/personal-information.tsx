"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUser } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s\-(). ]{7,20}$/, "Invalid phone number"),
})

type FormValues = z.infer<typeof schema>

type Profile = {
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
}

export const PersonalInformation = ({
  profile,
  onSubmit: onSubmitProp,
  formId,
}: {
  profile?: Profile | null
  onSubmit?: (values: FormValues) => void
  formId?: string
}) => {
  const [saveError, setSaveError] = React.useState("")
  const [saveSuccess, setSaveSuccess] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName:  profile?.first_name  ?? "",
      middleName: profile?.middle_name ?? "",
      lastName:   profile?.last_name   ?? "",
      email:      profile?.email       ?? "",
      phone:      profile?.phone       ?? "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setSaveError("")
    setSaveSuccess(false)

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name:  values.firstName,
        middle_name: values.middleName || null,
        last_name:   values.lastName,
        email:       values.email,
        phone:       values.phone,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setSaveError(data.error || "Failed to save profile")
      return
    }

    setSaveSuccess(true)
    form.reset(values)
    onSubmitProp?.(values)
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUser className="size-4 text-[var(--slug-primary)]" />
          <h1 className="slug-gradient-text text-base font-bold">
            Personal Information
          </h1>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your contact details used for bookings.
        </p>
      </CardHeader>
      <Form {...form}>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <CardContent className="flex flex-1 flex-col gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Full Name</p>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Book" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="N" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Go" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Contact Information</p>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="BookNGo@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+63 912 345 6789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {saveError   && <p className="text-sm text-red-500">{saveError}</p>}
            {saveSuccess && <p className="text-sm text-green-600">Profile saved successfully.</p>}
          </CardContent>

          {!formId && (
            <CardFooter className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => { form.reset(); setSaveError(""); setSaveSuccess(false) }}
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
          )}
        </form>
      </Form>
    </Card>
  )
}
