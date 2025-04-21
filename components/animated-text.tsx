"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
  delay?: number
  duration?: number
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
}

export function AnimatedText({
  text,
  className = "",
  once = true,
  delay = 0,
  duration = 0.05,
  tag = "span",
}: AnimatedTextProps) {
  const [isInView, setIsInView] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(true)

  useEffect(() => {
    setIsInView(true)

    if (once) {
      const timer = setTimeout(
        () => {
          setShouldAnimate(false)
        },
        text.length * duration * 1000 + 500 + delay,
      )

      return () => clearTimeout(timer)
    }
  }, [once, text.length, duration, delay])

  const words = text.split(" ")

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: duration, delayChildren: delay * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  const Tag = tag

  return (
    <motion.div
      className="overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={container}
    >
      <Tag className={className}>
        {words.map((word, index) => (
          <motion.span key={index} className="inline-block" variants={child}>
            {word}{" "}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  )
}
