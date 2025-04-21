"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, User, FileText, Briefcase, Mail, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MainNavProps {
  activeSection: string
}

export function MainNav({ activeSection }: MainNavProps) {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [localActiveSection, setLocalActiveSection] = useState(activeSection)
  const [isScrolling, setIsScrolling] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { theme } = useTheme()

  // Update local state when prop changes
  useEffect(() => {
    setLocalActiveSection(activeSection)
  }, [activeSection])

  // Handle scroll effect with improved performance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY

      // Update scrolled state for visual effects
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Set scrolling state to true
      setIsScrolling(true)

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Set a timeout to mark scrolling as finished
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150) // Short timeout to ensure responsiveness
    }

    // Use passive: true for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Handle theme changes
  useEffect(() => {
    setMounted(true)
  }, [])

  // Optimized scroll handler with proper cleanup
  const scrollToSection = useCallback((sectionId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    // Immediately update active section for instant visual feedback
    setLocalActiveSection(sectionId)
    setMobileOpen(false)

    const section = document.getElementById(sectionId)
    if (section) {
      // Calculate the scroll position accounting for the fixed header
      const rect = section.getBoundingClientRect()
      const scrollPosition = window.pageYOffset + rect.top - 80

      // Scroll to the exact position
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      })

      // Update URL without page reload
      window.history.pushState(null, "", `#${sectionId}`)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const navItems = [
    { href: "#home", label: "Home", icon: Home },
    { href: "#about", label: "About", icon: User },
    { href: "#skills", label: "Skills", icon: FileText },
    { href: "#resume", label: "Resume", icon: FileText },
    { href: "#portfolio", label: "Portfolio", icon: Briefcase },
    { href: "#contact", label: "Contact", icon: Mail },
  ]

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 theme-transition",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/" className="flex items-center font-bold text-xl text-foreground theme-text-transition">
          <img
          src="/favicon.png" 
          alt="Rasendriya Khansa Jolankarfyan"
          className="h-8 w-8 rounded-full mr-2"
          />
            Rasendriya
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav
          className="hidden md:flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {navItems.map((item, index) => {
            const sectionId = item.href.substring(1)
            const isActive =
              (sectionId === "home" && (localActiveSection === "home" || !localActiveSection)) ||
              sectionId === localActiveSection

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-1.5 rounded-full transition-all duration-150 relative z-10",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                  onClick={(e) => scrollToSection(sectionId, e)}
                  style={{ pointerEvents: "auto" }}
                  aria-label={`Navigate to ${item.label} section`}
                >
                  <item.icon className="mr-1.5 h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            )
          })}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </motion.nav>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <button
            className="ml-2 p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg border-b z-40"
          >
            <div className="flex flex-col px-4 py-4 gap-2">
              {navItems.map((item) => {
                const sectionId = item.href.substring(1)
                const isActive =
                  (sectionId === "home" && (localActiveSection === "home" || !localActiveSection)) ||
                  sectionId === localActiveSection

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg transition-all duration-150",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                    onClick={(e) => scrollToSection(sectionId, e)}
                    aria-label={`Navigate to ${item.label} section`}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}