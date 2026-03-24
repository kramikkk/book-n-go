"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { IconUser } from "@tabler/icons-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { getUserProfile, saveUserProfile } from "@/lib/user-profile"

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

export const PersonalInformation = ({
  onSubmit: onSubmitProp,
  formId,
}: {
  onSubmit?: (values: FormValues) => void
  formId?: string
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  // Load saved profile into form on mount
  React.useEffect(() => {
    const profile = getUserProfile()
    if (profile) form.reset(profile)
  }, [form])

  const onSubmit = (values: FormValues) => {
    saveUserProfile(values)
    onSubmitProp?.(values)
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUser className="size-4 text-blue-500" />
          <h1 className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">
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
          </CardContent>
          {!formId && (
            <CardFooter className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
                disabled={!form.formState.isDirty}
                className={!form.formState.isDirty ? "pointer-events-none opacity-0" : ""}
              >
                Cancel Changes
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isDirty}
                className={!form.formState.isDirty ? "pointer-events-none opacity-0" : ""}
              >
                Save
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  )
}
