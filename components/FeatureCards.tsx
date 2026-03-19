// components/FeatureCards.tsx
import React from "react";
import { Zap, Shield, TrendingUp } from "lucide-react";

const FeatureCards = () => {
  return (
    <div className="absolute left-0 right-0 lg:left-24 lg:right-auto top-[350px] sm:top-[380px] md:top-[400px] lg:top-[400px] flex justify-center lg:justify-start gap-4 sm:gap-4 md:gap-6 lg:gap-6 px-4 sm:px-6 md:px-0 lg:px-0">
      
      {/* Card 1 */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-2 sm:p-3 md:p-3 lg:p-3 min-w-[150px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] relative flex flex-col justify-center">
        <Zap
          size={30}
          className="absolute left-3 sm:left-4 md:left-3 lg:left-5 top-1/2 -translate-y-1/2"
          color="#3FB09C"
        />
        <h3 className="font-semibold text-white text-right text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15px] pr-1 sm:pr-2 md:pr-1 lg:pr-3">
          Instant Booking
        </h3>
        <p className="text-right text-white/80 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[13px] pr-4 sm:pr-2 md:pr-4 lg:pr-6">
          Book in seconds.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-2 sm:p-3 md:p-3 lg:p-3 min-w-[150px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] relative flex flex-col justify-center">
        <Shield
          size={30}
          className="absolute left-3 sm:left-4 md:left-3 lg:left-5 top-1/2 -translate-y-1/2"
          color="#2F3EAE"
        />
        <h3 className="font-semibold text-white text-right text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15px] pr-2 sm:pr-3 md:pr-5 lg:pr-7">
          Secure & Safe
        </h3>
        <p className="text-right text-white/80 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[13px] pr-2 sm:pr-4 md:pr-4 lg:pr-6">
          Book in seconds.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-2 sm:p-3 md:p-3 lg:p-3 min-w-[150px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] relative flex flex-col justify-center">
        <TrendingUp
          size={30}
          color="#DCE55F"
          className="absolute left-3 sm:left-4 md:left-3 lg:left-5 top-1/2 -translate-y-1/2"
        />
        <h3 className="font-semibold text-white text-right text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15px] pr-7 sm:pr-3 md:pr-12 lg:pr-14">
          Best Rates
        </h3>
        <p className="text-right text-white/80 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[13px] pr-0.25 sm:pr-4 md:pr-1 lg:pr-3">
          Competitive pricing.
        </p>
      </div>

    </div>
  );
};

export default FeatureCards;
