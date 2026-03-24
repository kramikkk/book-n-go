"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScrollEvent = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScrollEvent)
    
    const sections = ["home", "features", "faqs", "about"]
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

    return () => {
      window.removeEventListener("scroll", handleScrollEvent)
      observers.forEach((o) => o.disconnect())
    }
  }, [])

  const handleScroll = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setActiveSection(id)
    }
  }

  const navItems = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "faqs", label: "FAQs" },
    { id: "about", label: "About Us" },
  ]

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full h-20 flex items-center justify-between px-6 sm:px-10 lg:px-16 fixed top-0 left-0 z-50 transition-all duration-300 ${
        (scrolled || isMenuOpen) ? "bg-white shadow-sm border-b border-gray-100" : "bg-transparent"
      }`}
    >
      {/* LEFT SIDE (Logo + Title) */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleScroll("home")}>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <Image 
            src="/bookngo_logo.png" 
            alt="BookNGo Logo" 
            width={60} 
            height={60} 
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 drop-shadow-md"
          />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`font-bold text-2xl sm:text-3xl lg:text-[32px] tracking-tight transition-colors duration-300 ${
            (scrolled || isMenuOpen) ? "text-[#2F44AD]" : "text-white drop-shadow-sm"
          }`}
        >
          BookNGo
        </motion.h1>
      </div>

      {/* DESKTOP MENU */}
      <div className={`hidden md:flex items-center gap-8 font-medium transition-colors duration-300 ${scrolled ? "text-gray-800" : "text-white/90"}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScroll(item.id)}
            className={`relative pb-1 text-[15px] transition-colors ${
              scrolled ? "hover:text-[#2B9698]" : "hover:text-white"
            }`}
          >
            {item.label}
            {activeSection === item.id && (
              <motion.div
                layoutId="navbar-underline"
                className={`absolute left-0 right-0 bottom-0 h-[2px] rounded-full ${
                  scrolled ? "bg-gradient-to-r from-[#2B9698] to-[#2F44AD]" : "bg-white"
                }`}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* MOBILE MENU TOGGLE */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2 transition-colors duration-300 ${scrolled ? "text-[#2F44AD]" : "text-white"}`}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { height: "auto", opacity: 1, display: "block" } : { height: 0, opacity: 0, transitionEnd: { display: "none" } }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`absolute top-20 left-0 w-full overflow-hidden md:hidden bg-white backdrop-blur-xl border-b border-gray-100 shadow-xl z-40`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleScroll(item.id)
                setIsMenuOpen(false)
              }}
              className={`text-left text-lg font-medium transition-colors ${
                activeSection === item.id ? "text-[#2F44AD]" : "text-gray-600 hover:text-[#2B9698]"
              }`}
            >
              {item.label}
            </button>
          ))}
          {/* Mobile Login Option */}
          <button
            onClick={() => {
              handleScroll("home")
              setIsMenuOpen(false)
            }}
            className="text-left text-lg font-semibold text-[#3FB09C] pt-2 border-t border-gray-50 hover:text-[#2B9698] transition-colors"
          >
            Login
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Navbar