"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"

interface SkillStatisticsProps {
  stats: {
    label: string
    value: number
    suffix?: string
    color?: string
    url?: string
  }[]
}

export function SkillStatistics({ stats }: SkillStatisticsProps) {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      className="flex flex-wrap justify-center gap-8 w-full"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } },
      }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="bg-muted/30 rounded-lg px-10 py-8 text-center flex flex-col items-center min-w-[180px]"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
          }}
        >
          {stat.url ? (
            <a
              href={stat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl sm:text-4xl font-bold mb-2 hover:underline"
              style={{ color: stat.color || "var(--color-primary)" }}
            >
              <Counter from={0} to={stat.value} duration={2} delay={index * 0.1} />
              {stat.suffix}
            </a>
          ) : (
            <motion.div
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{ color: stat.color || "var(--color-primary)" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.5, delay: index * 0.1 + 0.3 },
                    }
                  : {}
              }
            >
              <Counter from={0} to={stat.value} duration={2} delay={index * 0.1} />
              {stat.suffix}
            </motion.div>
          )}
          <p className="text-base sm:text-lg text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

interface CounterProps {
  from: number
  to: number
  duration?: number
  delay?: number
}

function Counter({ from, to, duration = 2, delay = 0 }: CounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(nodeRef, { once: true })

  useEffect(() => {
    if (!inView || !nodeRef.current) return

    let startTime: number
    let requestId: number
    let currentValue = from

    const totalFrames = duration * 60
    const increment = (to - from) / totalFrames

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      currentValue = from + (to - from) * progress

      if (nodeRef.current) {
        nodeRef.current.textContent = Math.round(currentValue).toString()
      }

      if (progress < 1) {
        requestId = requestAnimationFrame(updateCounter)
      }
    }

    setTimeout(() => {
      requestId = requestAnimationFrame(updateCounter)
    }, delay * 1000)

    return () => {
      cancelAnimationFrame(requestId)
    }
  }, [from, to, duration, delay, inView])

  return <span ref={nodeRef}>{from}</span>
}