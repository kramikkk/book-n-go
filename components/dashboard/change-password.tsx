"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IconLock } from "@tabler/icons-react"
import { Eye, EyeOff } from "lucide-react"
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

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof schema>

export const ChangePassword = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const [show, setShow] = React.useState({ current: false, new: false, confirm: false })

  const onSubmit = async (values: FormValues) => {
    setError("")
    setSuccess(false)

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Failed to update password")
      return
    }

    setSuccess(true)
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconLock className="size-4 text-[var(--slug-primary)]" />
          <h1 className="slug-gradient-text text-base font-bold">
            Change Password
          </h1>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Make sure your new password is at least 8 characters.
        </p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={show.current ? "text" : "password"} placeholder="Enter current password" className="pr-10" {...field} />
                      <button type="button" onClick={() => setShow((s) => ({ ...s, current: !s.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={show.new ? "text" : "password"} placeholder="Enter new password" className="pr-10" {...field} />
                      <button type="button" onClick={() => setShow((s) => ({ ...s, new: !s.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={show.confirm ? "text" : "password"} placeholder="Confirm new password" className="pr-10" {...field} />
                      <button type="button" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error   && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">Password updated successfully.</p>}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-4">
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
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              className={!form.formState.isDirty ? "pointer-events-none opacity-0" : ""}
            >
              {form.formState.isSubmitting ? "Updating…" : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
