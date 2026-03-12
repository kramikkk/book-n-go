"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { BookingCalendar } from "@/components/booking-calendar"
import { BookingSteps } from "@/components/booking-steps"
import { ServiceSelector } from "@/components/service-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function BookNowPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [step, setStep] = React.useState(1)
  const [calendarKey, setCalendarKey] = React.useState(0)
  const [bookingData, setBookingData] = React.useState<BookingData>({
    date: undefined, startTime: null, endTime: null, bookingType: "Appointment",
  })
  const [selectedService, setSelectedService] = React.useState<string | null>(null)
  const [servicesConfig, setServicesConfig] = React.useState<ServicesConfig>(DEFAULT_SERVICES)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)

  React.useEffect(() => {
    setServicesConfig(getServicesConfig())
    setProfile(getUserProfile())
  }, [])

  // Reset selected service when booking type changes
  React.useEffect(() => {
    setSelectedService(null)
  }, [bookingData.bookingType])

  const services = servicesConfig[bookingData.bookingType === "Appointment" ? "appointment" : "reservation"]

  const selectedServiceLabel = React.useMemo(
    () => services.find((s) => s.id === selectedService)?.label ?? null,
    [services, selectedService]
  )

  const fullName = profile
    ? [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ")
    : ""

  const duration = React.useMemo(() => {
    if (!bookingData.startTime || !bookingData.endTime) return null
    const diff = TIME_SLOTS.indexOf(bookingData.endTime) - TIME_SLOTS.indexOf(bookingData.startTime)
    return diff > 0 ? `${diff} hour${diff > 1 ? "s" : ""}` : null
  }, [bookingData.startTime, bookingData.endTime])

  const canContinueStep1 = !!bookingData.startTime && !!bookingData.endTime
  const canContinueStep2 = !!selectedService && !!profile

  const handleConfirmBooking = () => {
    if (!bookingData.date || !bookingData.startTime || !bookingData.endTime || !profile) return
    const params = new URLSearchParams({
      ref: `BNG-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
      issuedAt: new Date().toISOString(),
      date: bookingData.date.toISOString(),
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      ...(duration ? { duration } : {}),
      bookingType: bookingData.bookingType,
      ...(selectedServiceLabel ? { service: selectedServiceLabel } : {}),
      name: fullName,
      email: profile.email,
      phone: profile.phone,
    })
    router.push(`/${slug}/my-booking?${params.toString()}`)
  }

  const handleReset = () => {
    setCalendarKey((k) => k + 1)
    setStep(1)
    setBookingData({ date: undefined, startTime: null, endTime: null, bookingType: "Appointment" })
    setSelectedService(null)
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-6">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <BookingSteps current={step} />

        {/* Step 1 — Date, Time & Booking Type */}
        {step === 1 && (
          <BookingCalendar
            date={bookingData.date}
            startTime={bookingData.startTime}
            endTime={bookingData.endTime}
            bookingType={bookingData.bookingType}
            bookedSlots={MOCK_BOOKED_SLOTS}
            fullyBookedDates={MOCK_BOOKED_DATES}
            onDateChange={(date) => setBookingData((prev) => ({ ...prev, date }))}
            onStartTimeChange={(startTime) => setBookingData((prev) => ({ ...prev, startTime }))}
            onEndTimeChange={(endTime) => setBookingData((prev) => ({ ...prev, endTime }))}
            onBookingTypeChange={(bookingType) => setBookingData((prev) => ({ ...prev, bookingType }))}
          />
        )}

        {/* Step 2 — Service selection + profile preview */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <ServiceSelector
              bookingType={bookingData.bookingType}
              services={services}
              value={selectedService}
              onChange={setSelectedService}
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
                  {bookingData.bookingType === "Appointment" ? "Appointment" : "Reservation"}
                </p>
                <div className="flex flex-col divide-y rounded-lg border">
                  <div className="flex items-center gap-3 px-4 py-3 text-sm">
                    <IconCalendar className="size-4 shrink-0 text-[#3A79C3]" />
                    <span className="text-muted-foreground">Date</span>
                    <span className="ml-auto font-semibold">
                      {bookingData.date?.toLocaleDateString("default", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 text-sm">
                    <IconClock className="size-4 shrink-0 text-[#3A79C3]" />
                    <span className="text-muted-foreground">Time</span>
                    <span className="ml-auto font-semibold">{bookingData.startTime} – {bookingData.endTime}</span>
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
                    {bookingData.bookingType === "Appointment"
                      ? <IconCalendarEvent className="size-4 shrink-0 text-[#3A79C3]" />
                      : <IconClipboardList className="size-4 shrink-0 text-[#3A79C3]" />}
                    <span className="text-muted-foreground">Type</span>
                    <span className="ml-auto font-semibold">{bookingData.bookingType}</span>
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
              {(bookingData.date || bookingData.startTime) && (
                <Button variant="outline" className="gap-2" onClick={handleReset}>
                  Reset
                </Button>
              )}
              <Button
                className="gap-2 bg-[#3A79C3] hover:bg-[#3164a8]"
                disabled={!canContinueStep1}
                onClick={() => setStep(2)}
              >
                Continue
                <IconArrowRight className="size-4" />
              </Button>
            </>
          )}
          {step === 2 && (
            <Button
              className="gap-2 bg-[#3A79C3] hover:bg-[#3164a8]"
              disabled={!canContinueStep2}
              onClick={() => setStep(3)}
            >
              Continue
              <IconArrowRight className="size-4" />
            </Button>
          )}
          {step === 3 && (
            <Button className="gap-2 bg-[#3A79C3] hover:bg-[#3164a8]" onClick={handleConfirmBooking}>
              Confirm Booking
              <IconArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
