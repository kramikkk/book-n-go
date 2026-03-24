"use client";

import React from "react";
import { Zap, Shield, TrendingUp } from "lucide-react";
import { motion, Variants } from "framer-motion";

const FeatureCards = () => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-wrap justify-start gap-4 sm:gap-6 z-20 w-full"
    >
      
      {/* Card 1 */}
      <motion.div 
        variants={item}
        whileHover={{ y: -6, scale: 1.02 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-4 min-w-[200px] flex items-center gap-4 transition-all duration-300 hover:bg-white/20 hover:border-white/40 cursor-pointer group flex-1 max-w-[240px]"
      >
        <div className="p-2 bg-white/10 rounded-xl group-hover:bg-[#3FB09C]/20 transition-colors shrink-0">
          <Zap size={24} color="#3FB09C" className="drop-shadow-sm" />
        </div>
        <div className="flex flex-col text-left">
          <h3 className="font-semibold text-white text-[15px] leading-tight">
            Instant Booking
          </h3>
          <p className="text-white/80 text-[13px] mt-0.5 font-light">
            Book in seconds.
          </p>
        </div>
      </motion.div>

      {/* Card 2 */}
      <motion.div 
        variants={item}
        whileHover={{ y: -6, scale: 1.02 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-4 min-w-[200px] flex items-center gap-4 transition-all duration-300 hover:bg-white/20 hover:border-white/40 cursor-pointer group flex-1 max-w-[240px]"
      >
        <div className="p-2 bg-white/10 rounded-xl group-hover:bg-[#2F44AD]/30 transition-colors shrink-0">
          <Shield size={24} color="#E8F1F2" className="drop-shadow-sm" />
        </div>
        <div className="flex flex-col text-left">
          <h3 className="font-semibold text-white text-[15px] leading-tight">
            Secure & Safe
          </h3>
          <p className="text-white/80 text-[13px] mt-0.5 font-light">
            End-to-end security.
          </p>
        </div>
      </motion.div>

      {/* Card 3 */}
      <motion.div 
        variants={item}
        whileHover={{ y: -6, scale: 1.02 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-4 min-w-[200px] flex items-center gap-4 transition-all duration-300 hover:bg-white/20 hover:border-white/40 cursor-pointer group flex-1 max-w-[240px]"
      >
        <div className="p-2 bg-white/10 rounded-xl group-hover:bg-[#DCE55F]/20 transition-colors shrink-0">
          <TrendingUp size={24} color="#DCE55F" className="drop-shadow-sm" />
        </div>
        <div className="flex flex-col text-left">
          <h3 className="font-semibold text-white text-[15px] leading-tight">
            Best Rates
          </h3>
          <p className="text-white/80 text-[13px] mt-0.5 font-light">
            Competitive pricing.
          </p>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default FeatureCards;
