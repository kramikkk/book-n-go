"use client";

import { useState } from "react";
import { UserCircle2, Mail, Phone, FileText } from "lucide-react";

export interface BookingDetails {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

interface DetailsProps {
  onBack: () => void;
  onConfirm: (data: BookingDetails) => void;
}

export default function Details({ onBack, onConfirm }: DetailsProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full p-8">
      <h2 className="text-[#2F44AD] font-bold text-base mb-6">Enter your details</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left — form fields */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <span className="bg-[#2B9698] rounded-md p-1 text-white flex items-center">
                <UserCircle2 size={14} />
              </span>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <span className="bg-[#2B9698] rounded-md p-1 text-white flex items-center">
                <Mail size={14} />
              </span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <span className="bg-[#2B9698] rounded-md p-1 text-white flex items-center">
                <Phone size={14} />
              </span>
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
            />
          </div>
        </div>

        {/* Right — notes */}
        <div className="flex-1 flex flex-col">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <span className="bg-[#2B9698] rounded-md p-1 text-white flex items-center">
              <FileText size={14} />
            </span>
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 resize-none min-h-[180px]"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-12 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => onConfirm({ fullName, email, phone, notes })}
          className="px-10 py-2.5 rounded-full text-white font-semibold text-sm shadow-md transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(to right, #2B9698, #2F44AD)" }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
