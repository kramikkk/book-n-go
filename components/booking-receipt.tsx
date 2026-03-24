"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  IconCalendar,
  IconCalendarEvent,
  IconCheck,
  IconClock,
  IconClipboardList,
  IconHash,
  IconHourglass,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPrinter,
  IconReceipt,
  IconTag,
  IconUser,
} from "@tabler/icons-react"

export type BookingReceiptData = {
  bookingRef: string
  issuedAt: Date
  date: Date
  startTime: string
  endTime: string
  duration: string | null
  location: string
  bookingType: string
  service?: string
  fullName: string
  email: string
  phone: string
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pb-1">
      <span className="h-3.5 w-1 rounded-full bg-gradient-to-b from-[#3F51B5] to-[#329A9A]" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{children}</p>
    </div>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b py-2.5 last:border-0">
      <span className="shrink-0 text-[#3A79C3]">{icon}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="ml-auto text-right text-sm font-semibold">{value}</span>
    </div>
  )
}

export function BookingReceipt({ data }: { data: BookingReceiptData }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])

  const TypeIcon = data.bookingType === "Appointment" ? IconCalendarEvent : IconClipboardList

  return (
    <>
      <style>{`
        @page { size: 80mm auto; margin: 5mm; }
        @media print {
          html, body {
            width: 80mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          body > :not(#print-receipt) { display: none !important; }
          #print-receipt {
            display: block !important;
            width: 70mm !important;
          }
        }
      `}</style>

      {mounted && createPortal(
        <div id="print-receipt" style={{ display: "none" }}>
          <div style={{ fontFamily: "'Courier New', Courier, monospace", width: "100%", color: "#000", fontSize: "12px", lineHeight: "1.5" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "4px" }}>BOOK-N-GO</div>
              <div>Main Branch</div>
              <div>123 Booking St., City</div>
              <div>Tel: (02) 8123-4567</div>
            </div>
            <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
            <div style={{ textAlign: "center", fontSize: "10px" }}>
              <div>REF#: {data.bookingRef}</div>
              <div>
                {data.issuedAt.toLocaleDateString("default", { year: "numeric", month: "long", day: "numeric" })}{" "}
                {data.issuedAt.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
            <div style={{ fontWeight: "bold", textAlign: "center", marginBottom: "4px", letterSpacing: "2px", fontSize: "11px" }}>*** {data.bookingType.toUpperCase()} ***</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>DATE</span><span>{data.date.toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>DAY</span><span>{data.date.toLocaleDateString("default", { weekday: "long" })}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>TIME</span><span>{data.startTime} - {data.endTime}</span></div>
            {data.duration && <div style={{ display: "flex", justifyContent: "space-between" }}><span>DURATION</span><span>{data.duration}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>LOCATION</span><span>{data.location}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>TYPE</span><span>{data.bookingType}</span></div>
            {data.service && <div style={{ display: "flex", justifyContent: "space-between" }}><span>SERVICE</span><span>{data.service}</span></div>}
            <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
            <div style={{ fontWeight: "bold", textAlign: "center", marginBottom: "4px", letterSpacing: "2px", fontSize: "11px" }}>*** GUEST INFO ***</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>NAME</span><span>{data.fullName}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>EMAIL</span><span style={{ maxWidth: "160px", wordBreak: "break-all", textAlign: "right" }}>{data.email}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>PHONE</span><span>{data.phone}</span></div>
            <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "13px", letterSpacing: "2px" }}>STATUS: CONFIRMED</div>
            <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
            <div style={{ textAlign: "center", fontSize: "10px", marginTop: "4px" }}>
              <div>Thank you for booking with us!</div>
              <div>Please present this receipt upon arrival.</div>
              <div style={{ marginTop: "8px" }}>================================</div>
              <div>Powered by Book-N-Go</div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <Card className="overflow-hidden">

        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] px-6 py-8 text-white">
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 size-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-6 size-32 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <IconReceipt className="size-4 opacity-70" />
                <span className="text-xs font-semibold uppercase tracking-widest opacity-70">Booking Receipt</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Confirmed!</h2>
                <p className="mt-0.5 text-sm opacity-70">Your appointment has been successfully booked.</p>
              </div>
            </div>
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/30 backdrop-blur-sm">
              <IconCheck className="size-8" stroke={2.5} />
            </div>
          </div>

          {/* chips */}
          <div className="relative mt-5 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm">
              <IconHash className="size-3" />
              <span className="font-mono font-semibold tracking-wider">{data.bookingRef}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs opacity-80 backdrop-blur-sm">
              <IconClock className="size-3" />
              <span>
                Issued {data.issuedAt.toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })} at {data.issuedAt.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              Confirmed
            </div>
          </div>
        </div>

        {/* ── Zigzag tear ── */}
        <div
          className="h-5 w-full"
          style={{
            background: "radial-gradient(circle at 50% 0%, hsl(var(--background)) 70%, transparent 70%) 0 0 / 24px 20px",
            backgroundColor: "hsl(var(--muted) / 0.4)",
          }}
        />

        {/* ── Two-column body ── */}
        <div className="flex flex-col divide-y sm:flex-row sm:divide-x sm:divide-y-0 sm:divide-dashed">

          {/* Appointment Details */}
          <div className="flex flex-1 flex-col gap-4 p-6">
            <SectionLabel>Appointment Details</SectionLabel>
            <div className="flex flex-col">
              <Row icon={<IconCalendar className="size-4" />} label="Date"
                value={data.date.toLocaleDateString("default", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
              />
              <Row icon={<IconClock className="size-4" />} label="Time" value={`${data.startTime} – ${data.endTime}`} />
              {data.duration && <Row icon={<IconHourglass className="size-4" />} label="Duration" value={data.duration} />}
              <Row icon={<IconMapPin className="size-4" />} label="Location" value={data.location} />
              <Row icon={<TypeIcon className="size-4" />} label="Type" value={data.bookingType} />
              {data.service && <Row icon={<IconTag className="size-4" />} label="Service" value={data.service} />}
            </div>
          </div>

          {/* Guest Information */}
          <div className="flex flex-1 flex-col gap-4 p-6">
            <SectionLabel>Guest Information</SectionLabel>
            <div className="flex flex-col">
              <Row icon={<IconUser className="size-4" />} label="Full Name" value={data.fullName} />
              <Row icon={<IconMail className="size-4" />} label="Email" value={data.email} />
              <Row icon={<IconPhone className="size-4" />} label="Phone" value={data.phone} />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between gap-4 border-t bg-muted/30 px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Confirmation sent to{" "}
            <span className="font-medium text-foreground">{data.email}</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="shrink-0 gap-1.5 text-muted-foreground hover:border-[#3A79C3] hover:text-[#3A79C3]"
          >
            <IconPrinter className="size-3.5" />
            Print
          </Button>
        </div>

      </Card>
    </>
  )
}
