// components/FAQSection.tsx
import React from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How do I make a reservation?",
    answer:
      "Simply select your desired service, choose a date and time, and fill in your details. You will receive an instant confirmation once your booking is complete.",
  },
  {
    question: "Can I cancel or reschedule my appointment?",
    answer:
      "Yes! You can cancel or reschedule through the link provided in your confirmation email. Please check our cancellation policy for specific deadlines.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Yes, it helps you manage multiple appointments, track your booking history, and receive personalized notifications.",
  },
  {
    question: "Can I book multiple services at the same time?",
    answer:
      "Yes! Our system allows you to select multiple services and schedule them together if your chosen time slots are available.",
  },
  {
    question: "What happens if I arrive late for my appointment?",
    answer:
      "If you arrive late, we will do our best to accommodate you. However, your session may be shortened depending on availability.",
  },
  {
    question: "Who do I contact for support?",
    answer:
      "For assistance, contact our support team via email at support@yourdomain.com or call us at +63 XXX XXX XXXX.",
  },
];

const FAQSection = () => {
  return (
    <section id="faqs" className="bg-[#EEF5F4] py-16 sm:py-20 lg:py-24 px-4 sm:px-10 lg:px-24">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2F44AD] text-center mb-12 lg:mb-16">
        FAQs
      </h2>

      {/* FAQ Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-md">
            <h3 className="font-semibold text-[#2F44AD] mb-2 text-sm sm:text-base lg:text-base">
              {index + 1}. {item.question}
            </h3>
            <p className="text-[#3EAD9B] text-xs sm:text-sm lg:text-sm leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;