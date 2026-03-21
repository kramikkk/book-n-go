// components/Footer.tsx
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-r from-[#2B9698] to-[#2F44AD] py-8 sm:py-10 px-6 sm:px-10 lg:px-24">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-16">
        
        {/* Email */}
        <div className="flex items-center gap-2 text-white text-sm sm:text-base">
          <Mail size={18} className="shrink-0 opacity-90" />
          <span>bookngo@gmail.com</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 text-white text-sm sm:text-base">
          <Phone size={18} className="shrink-0 opacity-90" />
          <span>+639175843695</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-white text-sm sm:text-base">
          <MapPin size={18} className="shrink-0 opacity-90" />
          <span>San Pablo City, Laguna</span>
        </div>

      </div>
      <p className="text-center text-white/60 text-xs mt-6">
        &copy; {year} BookNGo. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
