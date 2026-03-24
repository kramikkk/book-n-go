"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
      "Contact your service provider directly for support.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="scroll-mt-24 bg-white py-20 sm:py-24 lg:py-32 px-6 sm:px-10 lg:px-24">
      {/* Title */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F44AD] text-center mb-12 lg:mb-16 tracking-tight"
      >
        Frequently Asked Questions
      </motion.h2>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index} 
            className="bg-gray-50/80 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none transition-colors hover:bg-white/80"
            >
              <h3 className="font-semibold text-[#2F44AD] text-[15px] sm:text-[17px]">
                {item.question}
              </h3>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="text-[#3FB09C] w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
            </button>
            
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-[#2B9698] text-[14px] sm:text-[15px] leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;