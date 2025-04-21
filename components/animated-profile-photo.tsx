"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedProfilePhotoProps {
  src: string
  alt: string
  className?: string
}

export function AnimatedProfilePhoto({ src, alt, className }: AnimatedProfilePhotoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Simulate a small delay to make the animation more noticeable
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-full border-4 border-primary theme-border-transition cursor-pointer",
        className,
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isLoaded ? 1 : 0,
        scale: isLoaded ? (isHovered ? 1.05 : 1) : 0.9,
        rotate: isLoaded ? 0 : -5,
      }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
        scale: {
          duration: isHovered ? 0.4 : 0.7,
          ease: "easeOut",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-full w-full">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500"
          priority
          sizes="(max-width: 768px) 100vw, 300px"
        />

        {/* Overlay effect on hover */}
        <motion.div
          className="absolute inset-0 bg-primary/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Subtle glow effect */}
        <motion.div
          className="absolute -inset-1 rounded-full blur-md"
          style={{
            background: `radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)`,
            opacity: 0.4,
            zIndex: -1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.6 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )
}
