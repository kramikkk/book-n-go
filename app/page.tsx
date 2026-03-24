"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Login from "@/components/landing/login"
import Navbar from "@/components/landing/nav-bar"
import FeatureCards from "@/components/landing/feature-cards";
import FeaturesSection from "@/components/landing/features-section";
import Faqs from "@/components/landing/faqs";
import AboutUs from "@/components/landing/about-us";
import Footer from "@/components/landing/footer";

const Page = () => {
  return (
    <div className="relative min-h-screen bg-[#EEF5F4] overflow-hidden">
      <Navbar />

      {/* MAIN CONTENT */}
      <div>
        
        {/* HERO SECTION */}
        <div
          id="home"
          className="relative w-full min-h-screen bg-gradient-to-br from-[#2F44AD] to-[#2B9698] flex flex-col pt-24 pb-32">
          
          {/* Subtle animated background orbs for depth */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0">
            <motion.div 
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute top-10 left-[20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ y: [0, 30, 0], x: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 right-[10%] w-80 h-80 bg-[#3FB09C]/20 rounded-full blur-3xl"
            />
          </div>

          {/* MAIN HERO CONTENT (Grid / Flex) */}
          <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center justify-between relative z-10 gap-12 mt-12 lg:mt-0">
            
            {/* Left Column: Hero Text */}
            <div className="flex flex-col flex-1 w-full items-start max-w-2xl text-left sm:text-center lg:text-left mx-auto lg:mx-0">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-white w-full"
              >
                <h2 className="text-[2.5rem] sm:text-5xl md:text-[54px] lg:text-[64px] font-extrabold leading-[1.1] tracking-tight">
                  Book your perfect <br />
                  <span className="text-[#3FB09C] inline-block drop-shadow-sm">Appointment</span> <br />
                  in seconds
                </h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-6 text-lg sm:text-xl md:text-2xl opacity-90 font-light max-w-xl sm:mx-auto lg:mx-0"
                >
                  Experience seamless scheduling with our modern reservation system.
                </motion.p>
              </motion.div>

              {/* FEATURE CARDS (Desktop only inside this col) */}
              <div className="mt-12 w-full hidden lg:flex justify-start">
                <FeatureCards />
              </div>
            </div>

            {/* Right Column: Login */}
            <div className="flex flex-col items-center lg:items-end w-full max-w-sm lg:shrink-0 relative z-20 mx-auto lg:mx-0 mt-2 lg:mt-0 xl:mr-10">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                className="w-full"
              >
                <Login />
              </motion.div>
            </div>

          </div>

          {/* WAVE SHAPE */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0 pointer-events-none h-[120px] sm:h-[180px] lg:h-[240px]">
            <svg
              className="relative block w-[200%] h-full"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <motion.path
                animate={{
                  x: [0, -720],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                fill="#EEF5F4"
                fillOpacity="0.5"
                d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,186.7C672,160,768,128,864,138.7C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0V160Z"
              />
              <motion.path
                animate={{
                  x: [-720, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                fill="#EEF5F4"
                d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,186.7C672,160,768,128,864,138.7C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0V160Z"
              />
            </svg>
          </div>
        </div>

        {/* DETAILED FEATURES SECTION */}
        <FeaturesSection />

        {/* FAQ SECTION */}
        <div className="relative z-20">
          <Faqs />
          <AboutUs />
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default Page;