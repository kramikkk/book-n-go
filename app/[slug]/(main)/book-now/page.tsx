"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { BookingCalendar } from "@/components/booking-calendar"
import { BookingSteps } from "@/components/booking-steps"
import { ServiceSelector } from "@/components/service-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { TIME_SLOTS } from "@/lib/booking-constants"
import { MOCK_BOOKED_DATES, MOCK_BOOKED_SLOTS } from "@/lib/mock-data"
import { DEFAULT_SERVICES, getServicesConfig, type ServicesConfig } from "@/lib/services-config"
import { getUserProfile, type UserProfile } from "@/lib/user-profile"
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCalendarEvent,
  IconClipboardList,
  IconClock,
  IconHourglass,
  IconMail,
  IconMapPin,
  IconPhone,
  IconTag,
  IconUser,
  IconUserExclamation,
} from "@tabler/icons-react"

type BookingData = {
  date: Date | undefined
  startTime: string | null
  endTime: string | null
  bookingType: "Appointment" | "Reservation"
}

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { bookingFormSchema, type BookingFormData } from "@/lib/schemas"

export default function BookNowPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [step, setStep] = React.useState(1)
  const [calendarKey, setCalendarKey] = React.useState(0)
  const [servicesConfig, setServicesConfig] = React.useState<ServicesConfig>(DEFAULT_SERVICES)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingType: "Appointment",
      startTime: "",
      endTime: "",
      service: "",
      fullName: "",
      email: "",
      phone: "",
    },
  })

  const formDate = form.watch("date")
  const formStartTime = form.watch("startTime")
  const formEndTime = form.watch("endTime")
  const formBookingType = form.watch("bookingType")
  const formService = form.watch("service")

  React.useEffect(() => {
    setServicesConfig(getServicesConfig())
    const p = getUserProfile()
    setProfile(p)
    if (p) {
      form.setValue("fullName", [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" "))
      form.setValue("email", p.email)
      form.setValue("phone", p.phone)
    }
  }, [form])

  // Reset selected service when booking type changes
  React.useEffect(() => {
    form.setValue("service", "")
  }, [formBookingType, form])

  const services = servicesConfig[formBookingType === "Appointment" ? "appointment" : "reservation"]

  const selectedServiceLabel = React.useMemo(
    () => services.find((s) => s.id === formService)?.label ?? null,
    [services, formService]
  )

  const fullName = profile
    ? [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ")
    : ""

  const duration = React.useMemo(() => {
    if (!formStartTime || !formEndTime) return null
    const diff = TIME_SLOTS.indexOf(formEndTime) - TIME_SLOTS.indexOf(formStartTime)
    return diff > 0 ? `${diff} hour${diff > 1 ? "s" : ""}` : null
  }, [formStartTime, formEndTime])

  const handleContinueStep1 = async () => {
    const valid = await form.trigger(["date", "startTime", "endTime"])
    if (valid) setStep(2)
  }

  const handleContinueStep2 = async () => {
    const valid = await form.trigger(["service"])
    if (valid) setStep(3)
  }

  const onSubmit = (data: BookingFormData) => {
    if (!profile) return
    const params = new URLSearchParams({
      ref: `BNG-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
      issuedAt: new Date().toISOString(),
      date: data.date.toISOString(),
      startTime: data.startTime,
      endTime: data.endTime,
      ...(duration ? { duration } : {}),
      bookingType: data.bookingType,
      ...(selectedServiceLabel ? { service: selectedServiceLabel } : {}),
      name: data.fullName,
      email: data.email,
      phone: data.phone,
    })
    router.push(`/${slug}/my-booking?${params.toString()}`)
  }

  const handleReset = () => {
    setCalendarKey((k) => k + 1)
    setStep(1)
    form.reset()
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-6">
      <Form {...form}>
        <div className="flex w-full max-w-4xl flex-col gap-6">
          <BookingSteps current={step} />

          {/* Step 1 — Date, Time & Booking Type */}
          {step === 1 && (
            <BookingCalendar
              date={formDate}
              startTime={formStartTime || null}
              endTime={formEndTime || null}
              bookingType={formBookingType}
              bookedSlots={MOCK_BOOKED_SLOTS}
              fullyBookedDates={MOCK_BOOKED_DATES}
              onDateChange={(date) => {
                if (date) form.setValue("date", date, { shouldValidate: true })
              }}
              onStartTimeChange={(startTime) => form.setValue("startTime", startTime || "", { shouldValidate: true })}
              onEndTimeChange={(endTime) => form.setValue("endTime", endTime || "", { shouldValidate: true })}
              onBookingTypeChange={(bookingType) => form.setValue("bookingType", bookingType, { shouldValidate: true })}
            />
          )}

          {/* Step 2 — Service selection + profile preview */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <ServiceSelector
                bookingType={formBookingType}
                services={services}
                value={formService || null}
                onChange={(svc) => form.setValue("service", svc, { shouldValidate: true })}
              />

              {/* Profile summary */}
              {profile ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconUser className="size-4 text-blue-500" />
                      <span className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">
                        Personal Details
                      </span>
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Auto-filled from your profile.
                      </p>
                      <Link
                        href={`/${slug}/profile`}
                        className="text-xs text-[#3A79C3] underline-offset-4 hover:underline"
                      >
                        Edit profile
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 px-6 pb-4 pt-0">
                    <div className="flex flex-col divide-y rounded-lg border">
                      <div className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <IconUser className="size-4 shrink-0 text-[#3A79C3]" />
                        <span className="text-muted-foreground">Name</span>
                        <span className="ml-auto font-medium">{fullName}</span>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <IconMail className="size-4 shrink-0 text-[#3A79C3]" />
                        <span className="text-muted-foreground">Email</span>
                        <span className="ml-auto font-medium">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <IconPhone className="size-4 shrink-0 text-[#3A79C3]" />
                        <span className="text-muted-foreground">Phone</span>
                        <span className="ml-auto font-medium">{profile.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                  <CardContent className="flex items-start gap-3 px-6 py-4">
                    <IconUserExclamation className="mt-0.5 size-5 shrink-0 text-amber-500" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Profile incomplete
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Please fill in your personal information before booking.
                      </p>
                      <Link
                        href={`/${slug}/profile`}
                        className="mt-1 text-xs font-medium text-amber-800 underline underline-offset-4 dark:text-amber-300"
                      >
                        Go to Profile →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3 — Summary */}
          {step === 3 && profile && (
            <Card className="gap-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconCalendar className="size-4 text-blue-500" />
                  <span className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">
                    Review Your Booking
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Please confirm your details below.</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 px-6 pt-0 pb-6">

                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {formBookingType === "Appointment" ? "Appointment" : "Reservation"}
                  </p>
                  <div className="flex flex-col divide-y rounded-lg border">
                    <div className="flex items-center gap-3 px-4 py-3 text-sm">
                      <IconCalendar className="size-4 shrink-0 text-[#3A79C3]" />
                      <span className="text-muted-foreground">Date</span>
                      <span className="ml-auto font-semibold">
                        {formDate?.toLocaleDateString("default", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-sm">
                      <IconClock className="size-4 shrink-0 text-[#3A79C3]" />
                      <span className="text-muted-foreground">Time</span>
                      <span className="ml-auto font-semibold">{formStartTime} – {formEndTime}</span>
                    </div>
                    {duration && (
                      <div className="flex items-center gap-3 px-4 py-3 text-sm">
                        <IconHourglass className="size-4 shrink-0 text-[#3A79C3]" />
                        <span className="text-muted-foreground">Duration</span>
                        <span className="ml-auto font-semibold">{duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 px-4 py-3 text-sm">
                      <IconMapPin className="size-4 shrink-0 text-[#3A79C3]" />
                      <span className="text-muted-foreground">Location</span>
                      <span className="ml-auto font-semibold">Main Branch</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-sm">
                      {formBookingType === "Appointment"
                        ? <IconCalendarEvent className="size-4 shrink-0 text-[#3A79C3]" />
                        : <IconClipboardList className="size-4 shrink-0 text-[#3A79C3]" />}
                      <span className="text-muted-foreground">Type</span>
                      <span className="ml-auto font-semibold">{formBookingType}</span>
                    </div>
                    {selectedServiceLabel && (
                      <div className="flex items-center gap-3 px-4 py-3 text-sm">
                        <IconTag className="size-4 shrink-0 text-[#3A79C3]" />
                        <span className="text-muted-foreground">Service</span>
                        <span className="ml-auto font-semibold">{selectedServiceLabel}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-dashed" />

                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Booking As</p>
                  <div className="flex flex-col divide-y rounded-lg border">
                    <div className="flex items-center gap-3 px-4 py-3 text-sm">
                      <IconUser className="size-4 shrink-0 text-[#3A79C3]" />
                      <span className="text-muted-foreground">Name</span>
                      <span className="ml-auto font-semibold">{fullName}</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-sm">
                      <IconMail className="size-4 shrink-0 text-[#3A79C3]" />
                      <span className="text-muted-foreground">Email</span>
                      <span className="ml-auto font-semibold">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-sm">
                      <IconPhone className="size-4 shrink-0 text-[#3A79C3]" />
                      <span className="text-muted-foreground">Phone</span>
                      <span className="ml-auto font-semibold">{profile.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-center gap-3">
            {(step === 2 || step === 3) && (
              <Button variant="outline" className="gap-2" onClick={() => setStep((s) => s - 1)}>
                <IconArrowLeft className="size-4" />
                Back
              </Button>
            )}
            {step === 1 && (
              <>
                {(formDate || formStartTime) && (
                  <Button variant="outline" className="gap-2" onClick={handleReset}>
                    Reset
                  </Button>
                )}
                <Button
                  className="gap-2 bg-[#3A79C3] hover:bg-[#3164a8]"
                  onClick={handleContinueStep1}
                >
                  Continue
                  <IconArrowRight className="size-4" />
                </Button>
              </>
            )}
            {step === 2 && (
              <Button
                className="gap-2 bg-[#3A79C3] hover:bg-[#3164a8]"
                disabled={!profile}
                onClick={handleContinueStep2}
              >
                Continue
                <IconArrowRight className="size-4" />
              </Button>
            )}
            {step === 3 && (
              <Button className="gap-2 bg-[#3A79C3] hover:bg-[#3164a8]" onClick={form.handleSubmit(onSubmit)}>
                Confirm Booking
                <IconArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  )
}
