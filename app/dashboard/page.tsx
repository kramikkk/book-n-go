"use client";

import { useState } from "react";
import { Menu, UserCircle2, ChevronLeft, ChevronRight, Calendar, CalendarCheck, Clock, User, X, Check } from "lucide-react";
import Image from "next/image";
import Details, { BookingDetails } from "@/components/Details";
import Receipt from "@/components/Receipt";

const TIME_SLOTS = [
  "9:00 am",  "10:00 am",
  "11:00 am", "12:00 pm",
  "1:00 pm",  "2:00 pm",
  "3:00 pm",  "4:00 pm",
  "5:00 pm",  "6:00 pm",
];

const BOOKED_DAYS: number[] = [];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("book");
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [capturedDate, setCapturedDate] = useState("");
  const [capturedTime, setCapturedTime] = useState("");

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const rows = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

  const isCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const getDayStatus = (day: number) => {
    if (BOOKED_DAYS.includes(day)) return "booked";
    // Past days in current month are unavailable
    if (isCurrentMonth && day < today.getDate()) return "unavailable";
    // Past months entirely unavailable
    if (
      viewYear < today.getFullYear() ||
      (viewYear === today.getFullYear() && viewMonth < today.getMonth())
    )
      return "unavailable";
    return "available";
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-[#2F44AD] to-[#2B9698] overflow-hidden">

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-52 bg-white shadow-2xl z-50 flex flex-col py-6 px-4 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Image src="/bookngo_logo.png" alt="BookNGo" width={36} height={36} />
            <span className="font-bold text-lg bg-gradient-to-r from-[#2B9698] to-[#2F44AD] text-transparent bg-clip-text">
              BookNGo
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {[
            { key: "book", label: "Book Appointment", icon: <Calendar size={17} /> },
            { key: "mybooking", label: "My Booking", icon: <CalendarCheck size={17} /> },
            { key: "history", label: "History", icon: <Clock size={17} /> },
            { key: "profile", label: "Profile", icon: <User size={17} /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeNav === key
                  ? "bg-[#2B9698]/15 text-[#2B9698]"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span className={activeNav === key ? "text-[#2B9698]" : "text-gray-400"}>
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* White Header */}
      <header className="relative bg-white flex items-center justify-between px-6 py-4 shadow-none z-30">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
          <Menu size={28} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-bold text-[#2F44AD] tracking-wide whitespace-nowrap">
          Book an Appointment
        </h1>
        <div className="flex items-center gap-2 text-right">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-gray-800">Jasmine Macalintal</p>
            <p className="text-xs text-gray-500">jag***********@gmail.com</p>
          </div>
          <UserCircle2 size={42} className="text-[#2B9698]" />
        </div>
      </header>

      {/* Gradient band + wave */}
      <div className="relative bg-gradient-to-br from-[#2F44AD] to-[#2B9698]">
        <div className="py-6 flex flex-col items-center gap-6">
          <p className="text-white/80 text-sm">Complete the steps below to schedule your visit</p>

          {/* Step Indicator */}
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {step > 1 ? <Check size={22} /> : "1"}
              </div>
              <span className="text-white text-xs mt-1">Date &amp; Time</span>
            </div>
            <div className={`w-16 h-0.5 mb-5 ${step > 1 ? "bg-white" : "bg-white/40"}`} />
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${step >= 2 ? "bg-teal-500 shadow-md" : "bg-white/20 border-2 border-white/50"}`}>
                {step > 2 ? <Check size={22} /> : "2"}
              </div>
              <span className="text-white text-xs mt-1">Details</span>
            </div>
            <div className={`w-16 h-0.5 mb-5 ${step > 2 ? "bg-white" : "bg-white/40"}`} />
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${step === 3 ? "bg-teal-500 shadow-md" : "bg-white/20 border-2 border-white/50"}`}>
                3
              </div>
              <span className="text-white text-xs mt-1">Receipt</span>
            </div>
          </div>
        </div>

        {/* Wave */}
        <svg className="w-full block" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EEF5F4" d="M0,192L80,176C160,160,320,128,480,133.3C640,139,800,181,960,208C1120,235,1280,245,1360,250.7L1440,256L1440,320L0,320Z" />
        </svg>
      </div>

      {/* Light content area */}
      <div className="flex flex-col items-center px-4 pb-10 bg-[#EEF5F4]">
        {step === 1 ? (
          <>
        {/* Card — pulled up over the wave */}
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl -mt-70 relative z-10 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#2F44AD] font-semibold text-base">Select Date</h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <button onClick={prevMonth} className="hover:text-teal-600"><ChevronLeft size={16} /></button>
                  <span className="font-medium text-gray-700">{monthLabel}</span>
                  <button onClick={nextMonth} className="hover:text-teal-600"><ChevronRight size={16} /></button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-[#2B9698] py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-y-1">
                {Array.from({ length: rows * 7 }).map((_, idx) => {
                  const day = idx - firstDayOfWeek + 1;
                  const isValid = day >= 1 && day <= daysInMonth;
                  const status = isValid ? getDayStatus(day) : null;
                  const isSelected = isValid && selectedDay === day;

                  return (
                    <button
                      key={idx}
                      disabled={!isValid || status === "unavailable" || status === "booked"}
                      onClick={() => isValid && status === "available" && setSelectedDay(day)}
                      className={[
                        "mx-auto w-9 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center",
                        !isValid ? "invisible" : "",
                        isCurrentMonth && day === today.getDate() && !isSelected ? "ring-2 ring-teal-400" : "",
                        status === "available" && !isSelected ? "bg-teal-500 text-white hover:bg-teal-600 cursor-pointer" : "",
                        status === "available" && isSelected ? "bg-teal-700 text-white ring-2 ring-teal-400" : "",
                        status === "booked" ? "bg-red-100 text-red-400 cursor-not-allowed" : "",
                        status === "unavailable" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "",
                      ].filter(Boolean).join(" ")}
                    >
                      {isValid ? day : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200" />

            {/* Time slots + Legend */}
            <div className="flex flex-col gap-4 md:w-48">
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={[
                      "py-2 px-1 rounded-lg border text-xs font-medium transition-all",
                      selectedTime === slot
                        ? "bg-teal-500 text-white border-teal-500"
                        : "border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600",
                    ].join(" ")}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-teal-500 inline-block" />
                  Available
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  Booked
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" />
                  Unavailable
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={() => {
            setCapturedDate(
              new Date(viewYear, viewMonth, selectedDay ?? 1).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            );
            setCapturedTime(selectedTime ?? "");
            setStep(2);
          }}
          className="mt-6 mb-4 px-16 py-3 rounded-full text-white font-semibold text-sm shadow-md transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(to right, #2B9698, #2F44AD)" }}
        >
          Continue to details
        </button>
          </>
        ) : step === 2 ? (
          <div className="-mt-60 relative z-10 w-full max-w-3xl">
            <Details
              onBack={() => setStep(1)}
              onConfirm={(data) => { setBookingDetails(data); setStep(3); }}
            />
          </div>
        ) : bookingDetails ? (
          <div className="-mt-60 relative z-10 w-full max-w-3xl">
            <Receipt
              fullName={bookingDetails.fullName}
              email={bookingDetails.email}
              phone={bookingDetails.phone}
              bookingDate={capturedDate}
              bookingTime={capturedTime}
              onBack={() => setStep(2)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

