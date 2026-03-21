"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface NavbarProps {
  onMobileLogin?: () => void
}

const Navbar = ({ onMobileLogin }: NavbarProps) => {

  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const sections = ["home", "faqs", "about"]
    const observers: IntersectionObserver[] = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.4 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const handleScroll = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setActiveSection(id)
    }
  }

  return (
    <div className="w-full h-20 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-12 fixed top-0 left-0 z-50">

      {/* LEFT SIDE (Logo + Title) */}
      <div className="flex items-center gap-2 sm:gap-1">
        
        <Image 
          src="/bookngo_logo.png" 
          alt="BookNGo Logo" 
          width={60} 
          height={60} 
          className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
        />

        <h1 className="font-semibold text-2xl sm:text-3xl lg:text-[32px] bg-gradient-to-r from-[#2B9698] to-[#2F44AD] text-transparent bg-clip-text">
          BookNGo
        </h1>

      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
        <button
            onClick={() => handleScroll("home")}
          className={`pb-1 hover:text-[#2F44AD] ${
    activeSection === "home" ? "border-b-2 border-[#2F44AD]" : ""
  }`}
>
          Home
        </button>

        <button
          onClick={() => handleScroll("faqs")}
          className={`pb-1 hover:text-[#2F44AD] ${
        activeSection === "faqs" ? "border-b-2 border-[#2F44AD]" : ""
  }`}
>
          FAQs
        </button>

        <button
          onClick={() => handleScroll("about")}
          className={`pb-1 hover:text-[#2F44AD] ${
        activeSection === "about" ? "border-b-2 border-[#2F44AD]" : ""
  }`}
>
  About Us
</button>
      </div>

      {/* MOBILE LOGIN BUTTON */}
      <button
        onClick={onMobileLogin}
        className="md:hidden font-semibold text-[#3EB09B] hover:underline"
      >
        Login
      </button>

    </div>
  )
}

export default Navbar