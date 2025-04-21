"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface SkillBarProps {
  skill: string
  percentage: number
}

export function SkillBar({ skill, percentage }: SkillBarProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  useEffect(() => {
    if (inView) {
      controls.start({
        width: `${percentage}%`,
        transition: { duration: 1.2, ease: "easeOut" },
      })
    }
  }, [controls, inView, percentage])

  return (
    <motion.div
      className="space-y-3"
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium theme-text-transition">{skill}</span>
        <motion.span
          className="text-base font-medium theme-text-transition"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {percentage}%
        </motion.span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted theme-bg-transition">
        <motion.div
          className="h-full bg-primary theme-transition rounded-full"
          initial={{ width: 0 }}
          animate={controls}
        />
      </div>
    </motion.div>
  )
}
