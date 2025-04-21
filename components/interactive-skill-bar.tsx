"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { Info, ChevronRight } from "lucide-react"

interface InteractiveSkillBarProps {
  skill: string
  percentage: number
  color?: string
  description?: string
  projects?: { name: string; url?: string }[]
}

export function InteractiveSkillBar({
  skill,
  percentage,
  color = "bg-primary",
  description,
  projects = [],
}: InteractiveSkillBarProps) {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false })
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animate when in view
  useEffect(() => {
    if (inView) {
      setIsAnimating(true)
      controls
        .start({
          width: `${percentage}%`,
          transition: { duration: 1.2, ease: "easeOut" },
        })
        .then(() => {
          setIsAnimating(false)
        })
    } else {
      controls.start({ width: "0%" })
    }
  }, [controls, inView, percentage])

  // Generate a pulsing effect when hovered
  const pulseVariants = {
    hover: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
    initial: {
      scale: 1,
    },
  }

  // Animate percentage counter
  const counterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.8,
      },
    },
  }

  // Animate skill name
  const skillNameVariants = {
    hover: {
      color: "var(--color-primary)",
      transition: { duration: 0.3 },
    },
    initial: {
      color: "var(--color-text)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="space-y-3"
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={pulseVariants}
    >
      <div className="flex justify-between mb-1 items-center">
        <motion.span
          className="text-base font-medium theme-text-transition flex items-center gap-2 cursor-pointer"
          variants={skillNameVariants}
          animate={isHovered ? "hover" : "initial"}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {skill}
          {(description || projects.length > 0) && (
            <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronRight className="h-4 w-4" />
            </motion.span>
          )}
        </motion.span>
        <motion.div
          className="flex items-center gap-2"
          variants={counterVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.span
            className="text-base font-medium theme-text-transition"
            animate={{
              opacity: isAnimating ? [0, 0.5, 1] : 1,
              scale: isAnimating ? [0.9, 1.1, 1] : 1,
            }}
            transition={{ duration: 1.2 }}
          >
            {percentage}%
          </motion.span>
          {description && (
            <motion.div className="relative" whileHover={{ scale: 1.1 }}>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" onMouseEnter={() => setIsHovered(true)} />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted theme-bg-transition">
        <motion.div
          className={`h-full ${color} theme-transition rounded-full`}
          initial={{ width: 0 }}
          animate={controls}
        />

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute top-0 left-0 h-full w-full opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`,
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["100% 0%", "0% 0%", "100% 0%"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
        />
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1 px-2 bg-muted/50 rounded-md mt-1">
              {description && <p className="text-sm text-muted-foreground mb-2">{description}</p>}

              {projects.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium">Related Projects:</p>
                  <ul className="space-y-1">
                    {projects.map((project, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <ChevronRight className="h-3 w-3 mr-1 text-primary" />
                        {project.url ? (
                          <a
                            href={project.url}
                            className="text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {project.name}
                          </a>
                        ) : (
                          <span>{project.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
