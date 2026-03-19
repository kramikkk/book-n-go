"use client";

import Image from "next/image";

interface ReceiptProps {
  fullName: string;
  email: string;
  phone: string;
  bookingDate: string;
  bookingTime: string;
  onBack: () => void;
}

export default function Receipt({
  fullName,
  email,
  phone,
  bookingDate,
  bookingTime,
  onBack,
}: ReceiptProps) {
  const today = new Date();
  const confirmationDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full p-8">
      {/* Header row */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Image src="/bookngo_logo.png" alt="BookNGo" width={36} height={36} />
          <span className="font-bold text-lg bg-gradient-to-r from-[#2B9698] to-[#2F44AD] text-transparent bg-clip-text">
            BookNGo
          </span>
        </div>
        <p className="text-sm text-gray-500">Date: {confirmationDate}</p>
      </div>

      {/* Body */}
      <div className="mt-6 flex flex-col gap-6 text-sm text-gray-700">
        {/* Billed to */}
        <div>
          <p className="font-bold mb-1">Billed to:</p>
          <p>{fullName}</p>
          <p>{email}</p>
          <p>{phone}</p>
        </div>

        {/* Booking Details */}
        <div>
          <p className="font-bold mb-1">Booking Details:</p>
          <p>Date: {bookingDate}</p>
          <p>Time: {bookingTime}</p>
          <p>Duration: 3 hours</p>
          <p>Location: San Pablo City</p>
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={onBack}
          className="px-24 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all"
        >
          Back
        </button>
      </div>
    </div>
  );
}
