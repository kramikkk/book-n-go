"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { CalendarRange, Clock, Bell, CreditCard } from "lucide-react";

const features = [
  {
    icon: <CalendarRange size={32} strokeWidth={1.5} />,
    title: "Smart Scheduling",
    description: "Book individual or recurring sessions seamlessly through our intelligent matching system."
  },
  {
    icon: <Clock size={32} strokeWidth={1.5} />,
    title: "Real-time Availability",
    description: "Instantly see precise open slots in real-time. No more double-booking or scheduling conflicts."
  },
  {
    icon: <Bell size={32} strokeWidth={1.5} />,
    title: "Automated Reminders",
    description: "Reduce no-shows with automated, timely email and SMS notifications designed to keep you updated."
  },
  {
    icon: <CreditCard size={32} strokeWidth={1.5} />,
    title: "Seamless Payments",
    description: "Accept and process payments securely in seconds, directly from inside the booking flow."
  }
];

const FeaturesSection = () => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24, duration: 0.6 } }
  };

  return (
    <section id="features" className="scroll-mt-24 bg-[#EEF5F4] py-24 sm:py-32 px-6 sm:px-10 lg:px-24">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F44AD] tracking-tight relative inline-block">
            Why Choose BookNGo
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "60px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 h-[3px] bg-gradient-to-r from-[#2B9698] to-[#2F44AD] rounded-full"
            />
          </h2>
          <p className="mt-10 text-gray-500 text-lg sm:text-xl font-light max-w-2xl mx-auto">
            Everything you need to effortlessly manage your time, clients, and payments in one beautifully unified platform.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[2rem] p-8 sm:p-10 text-center flex flex-col items-center hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(47,68,173,0.1)] transition-all duration-300 group cursor-default shadow-sm"
            >
              <div className="p-4 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl text-[#3FB09C] group-hover:bg-[#2B9698] group-hover:text-white transition-all duration-300 mb-6 group-hover:-rotate-3 group-hover:shadow-[0_8px_16px_rgba(43,150,152,0.2)]">
                {feature.icon}
              </div>
              <h3 className="text-[1.35rem] font-semibold text-[#2F44AD] mb-4 group-hover:text-[#2B9698] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500/90 font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;
