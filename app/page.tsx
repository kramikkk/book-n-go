"use client";
import { useState } from "react";
import Login from "@/components/login"
import Navbar from "@/components/Navbar"
import FeatureCards from "@/components/FeatureCards";
import Faqs from "@/components/Faqs";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";


const Page = () => {
  const [mobileShowLogin, setMobileShowLogin] = useState(false);
  return (
    <div className="relative min-h-screen bg-[#EEF5F4]">
      <Navbar onMobileLogin={() => setMobileShowLogin(true)} />

      {/* MOBILE LOGIN VIEW - shown when Login is tapped on small screens */}
      {mobileShowLogin && (
        <div className="md:hidden min-h-screen bg-gradient-to-br from-[#2F44AD] to-[#2B9698] pt-20">
          <Login />
        </div>
      )}

      {/* MAIN CONTENT — hidden on mobile when login view is active */}
      <div className={mobileShowLogin ? "hidden md:block" : ""}>
        {/* HERO SECTION */}
        <div
          id="home"
          className="relative w-full min-h-screen bg-gradient-to-br from-[#2F44AD] to-[#2B9698] flex items-start pt-30 sm:pt-30 md:pt-20 lg:pt-40">
          {/* HERO TEXT */}
          <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24">
            <div className="text-white max-w-md md:max-w-lg text-left sm:text-center md:text-left">
              <h2 className="text-4xl sm:text-5xl md:text-[40px] lg:text-[48px] font-semibold leading-tight">
                Book your perfect <br />
                <span className="text-[#3FB09C]">Appointment</span> <br />
                in seconds
              </h2>
              <p className="mt-4 text-base sm:text-lg opacity-90 lg:whitespace-nowrap">
                Experience seamless scheduling with our modern reservation system.
              </p>
            </div>
          </div>

          {/* FEATURE CARDS */}
          <FeatureCards />
        </div>

        {/* Login Section — desktop only */}
        <div className="hidden md:block pr-3 relative z-10" style={{ marginTop: '-700px' }}>
          <Login />
          {/* WAVE SHAPE */}
          <svg
            className="absolute bottom-0 left-0 w-full z-0 pointer-events-none"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#EEF5F4"
              d="M0,192L80,176C160,160,320,128,480,133.3C640,139,800,181,960,208C1120,235,1280,245,1360,250.7L1440,256L1440,320L0,320Z"
            />
          </svg>
        </div>

        {/* FAQ SECTION */}
        <Faqs />
        {/* ABOUT US SECTION */}
        <AboutUs />
        {/* FOOTER */}
        <Footer />
      </div>
      </div>
      
  );
};

export default Page;