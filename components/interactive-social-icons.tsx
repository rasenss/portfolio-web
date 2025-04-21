"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Linkedin, Instagram, Mail, Code, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import confetti from "canvas-confetti"

interface InteractiveSocialIconsProps {
  className?: string
  iconSize?: number
  showLabels?: boolean
  footer?: boolean
}

export function InteractiveSocialIcons({
  className,
  iconSize = 20,
  showLabels = false,
  footer = false,
}: InteractiveSocialIconsProps) {
  const [activeEasterEgg, setActiveEasterEgg] = useState<string | null>(null)
  const [codeSequence, setCodeSequence] = useState<string[]>([])
  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [sparkleCount, setSparkleCount] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameScore, setGameScore] = useState(0)
  const [gameTimeLeft, setGameTimeLeft] = useState(10)
  const [highScore, setHighScore] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  // Reset Easter egg after a delay
  useEffect(() => {
    if (activeEasterEgg) {
      const timer = setTimeout(() => {
        setActiveEasterEgg(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [activeEasterEgg])

  // Handle code sequence for GitHub Easter egg
  useEffect(() => {
    if (codeSequence.length === 10) {
      setSecretUnlocked(true)

      // Create confetti effect
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }

      setTimeout(() => {
        setCodeSequence([])
        setSecretUnlocked(false)
      }, 5000)
    }
  }, [codeSequence])

  // Game timer
  useEffect(() => {
    if (gameActive && gameTimeLeft > 0) {
      const timer = setTimeout(() => {
        setGameTimeLeft((prev) => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (gameActive && gameTimeLeft === 0) {
      setGameActive(false)
      if (gameScore > highScore) {
        setHighScore(gameScore)
      }
    }
  }, [gameActive, gameTimeLeft, gameScore, highScore])

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/rasendriya-khansa/",
      color: "hover:text-[#0077B5]",
      easterEgg: "network",
      onInteraction: () => {
        // LinkedIn network visualization Easter egg
        setActiveEasterEgg("linkedin")
      },
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/rasenss",
      color: "hover:text-[#333]",
      easterEgg: "code",
      onInteraction: () => {
        // GitHub code sequence Easter egg
        setActiveEasterEgg("github")
        setCodeSequence((prev) => [...prev, Math.floor(Math.random() * 2).toString()])
      },
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/rasendkhansa",
      color: "hover:text-[#E1306C]",
      easterEgg: "game",
      onInteraction: () => {
        // Instagram click game Easter egg
        if (!gameActive) {
          setGameActive(true)
          setGameScore(0)
          setGameTimeLeft(10)
        } else {
          setGameScore((prev) => prev + 1)
        }
      },
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:rasuen27@gmail.com",
      color: "hover:text-primary",
      easterEgg: "message",
      onInteraction: () => {
        // Email message Easter egg
        setActiveEasterEgg("email")
      },
    },
  ]

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className={cn("flex items-center", footer ? "gap-4" : "gap-4")}>
        {socialLinks.map((social) => (
          <div key={social.name} className="relative">
            <Link
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "transition-all duration-200 theme-text-transition flex items-center gap-2",
                social.color,
                "group",
              )}
              aria-label={social.name}
              onClick={(e) => {
                if (social.onInteraction) {
                  e.preventDefault()
                  social.onInteraction()
                }
              }}
            >
              <div className="relative">
                <social.icon size={iconSize} className="transition-transform duration-300 group-hover:scale-110" />
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  style={{ opacity: 0.7 }}
                />
              </div>
              {showLabels && <span className="text-sm font-medium">{social.name}</span>}
            </Link>
          </div>
        ))}
      </div>

      {/* Easter Egg Displays */}
      <AnimatePresence>
        {activeEasterEgg === "linkedin" && (
          <motion.div
            className="absolute -top-32 left-0 right-0 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-primary/20 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-center">
              <h4 className="text-sm font-medium mb-2">Your Professional Network</h4>
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-8 bg-[#0077B5] rounded-full"
                    initial={{ height: 8 }}
                    animate={{ height: Math.random() * 24 + 8 }}
                    transition={{
                      duration: 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs mt-2 text-muted-foreground">Connections growing every day!</p>
            </div>
          </motion.div>
        )}

        {activeEasterEgg === "github" && (
          <motion.div
            className="absolute -top-32 left-0 right-0 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-primary/20 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-center">
              <h4 className="text-sm font-medium mb-2">Secret Code Sequence</h4>
              <div className="flex justify-center space-x-1 mb-2">
                {codeSequence.map((digit, i) => (
                  <motion.div
                    key={i}
                    className={`w-4 h-4 rounded-full ${digit === "0" ? "bg-green-500" : "bg-blue-500"}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
                {Array.from({ length: 10 - codeSequence.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700" />
                ))}
              </div>
              {secretUnlocked ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500 font-medium flex items-center justify-center"
                >
                  <Code className="mr-1 h-4 w-4" /> Code Unlocked! <Zap className="ml-1 h-4 w-4" />
                </motion.div>
              ) : (
                <p className="text-xs text-muted-foreground">Keep clicking to unlock the secret...</p>
              )}
            </div>
          </motion.div>
        )}

        {activeEasterEgg === "twitter" && (
          <motion.div
            className="absolute -top-32 left-0 right-0 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-primary/20 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-center">
              <h4 className="text-sm font-medium mb-2">Sparkle Generator</h4>
              <div className="relative h-16 flex items-center justify-center">
                {Array.from({ length: Math.min(sparkleCount, 20) }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 100,
                      y: (Math.random() - 0.5) * 60,
                      scale: Math.random() * 0.5 + 0.5,
                      opacity: 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="text-[#1DA1F2]" size={16} />
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {sparkleCount} sparkles generated! Keep clicking for more...
              </p>
            </div>
          </motion.div>
        )}

        {activeEasterEgg === "email" && (
          <motion.div
            className="absolute -top-32 left-0 right-0 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-primary/20 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-center">
              <h4 className="text-sm font-medium mb-2">Secret Message</h4>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-primary italic"
              >
                "Thanks for exploring my portfolio! I'd love to hear from you."
              </motion.div>
              <motion.div
                className="mt-2 flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
              >
                <Mail className="text-primary h-5 w-5" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {gameActive && (
          <motion.div
            className="absolute -top-40 left-0 right-0 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-primary/20 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-center">
              <h4 className="text-sm font-medium mb-2">Speed Clicker!</h4>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Score: {gameScore}</span>
                <span className="text-sm">Time: {gameTimeLeft}s</span>
              </div>
              <motion.button
                className="w-full py-2 bg-[#E1306C] hover:bg-[#C13584] text-white rounded-md transition-colors"
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault()
                  setGameScore((prev) => prev + 1)
                }}
              >
                Click Me Fast!
              </motion.button>
              <p className="text-xs mt-2 text-muted-foreground">High Score: {highScore}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
