"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-br from-[#2F44AD] to-[#2B9698] py-12 sm:py-16 px-6 sm:px-10 lg:px-24 border-t border-white/10 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-16 relative z-10"
      >
        
        {/* Contact Info List */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {/* Email */}
          <a href="mailto:bookngo@gmail.com" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <Mail size={18} />
            </div>
            <span className="text-sm sm:text-base font-light tracking-wide">bookngo@gmail.com</span>
          </a>

          {/* Phone */}
          <a href="tel:+639175843695" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <Phone size={18} />
            </div>
            <span className="text-sm sm:text-base font-light tracking-wide">+63 917 584 3695</span>
          </a>

          {/* Location */}
          <div className="flex items-center gap-3 text-white/90 group">
            <div className="p-2 bg-white/10 rounded-full">
              <MapPin size={18} />
            </div>
            <span className="text-sm sm:text-base font-light tracking-wide">San Pablo City, Laguna</span>
          </div>
        </div>

        {/* Brand / Copyright */}
        <div className="flex flex-col items-center sm:items-end gap-2 pr-2">
          <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">BookNGo</h3>
          <p className="text-white/60 text-xs sm:text-sm font-light mt-1">
            &copy; {year} All rights reserved.
          </p>
        </div>

      </motion.div>
    </footer>
  );
};

export default Footer;
