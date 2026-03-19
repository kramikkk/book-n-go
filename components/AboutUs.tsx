// components/AboutUs.tsx
import React from "react";

const AboutUs = () => {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-28 px-6 sm:px-10 lg:px-24"
    >
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2F44AD] text-center mb-8 sm:mb-12">
        About Us
      </h2>

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed space-y-4 sm:space-y-6">
        <p>
          Welcome to BookNGo! Our mission is to make scheduling appointments
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
    </section>
  );
};

export default AboutUs;