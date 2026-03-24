"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-[#EEF5F4] py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-24"
    >
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F44AD] text-center mb-8 sm:mb-12 tracking-tight relative">
          About Us
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "40px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-[3px] bg-gradient-to-r from-[#2B9698] to-[#2F44AD] rounded-full"
          />
        </h2>

        {/* Content */}
        <div className="text-center text-gray-600 text-[17px] sm:text-[19px] lg:text-[22px] leading-relaxed space-y-6 sm:space-y-8 font-light tracking-wide mt-4">
          <p>
            Welcome to <span className="font-semibold text-[#3FB09C]">BookNGo</span>! Our mission is to make scheduling appointments
            seamless, fast, and secure. We provide a modern reservation system
            designed for your convenience.
          </p>

          <p>
            Our team is dedicated to delivering the best rates and ensuring a
            safe and reliable booking experience. We believe that managing your
            appointments should be easy and stress-free.
          </p>

          <p>
            Whether it’s for business or personal needs, BookNGo is here to
            simplify your scheduling and give you peace of mind.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUs;