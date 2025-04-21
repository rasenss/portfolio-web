"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedSubtitleProps {
  phrases: string[]
  className?: string
  delay?: number
}

export function AnimatedSubtitle({ phrases, className = "", delay = 0.5 }: AnimatedSubtitleProps) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    setIsInView(true)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.p className={className} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={container}>
      {phrases.map((phrase, index) => (
        <motion.span key={index} className="inline-block" variants={item}>
          {phrase}
          {index < phrases.length - 1 && (
            <motion.span
              className="mx-2 inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 + index * 0.12 }}
            >
              |
            </motion.span>
          )}
        </motion.span>
      ))}
    </motion.p>
  )
}
