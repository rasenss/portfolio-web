"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Sparkles, Code, Zap, Smile } from "lucide-react"

interface EasterEggProps {
  children: React.ReactNode
}

export function EasterEgg({ children }: EasterEggProps) {
  const [konamiActivated, setKonamiActivated] = useState(false)
  const [secretClicks, setSecretClicks] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [eggType, setEggType] = useState<"konami" | "click" | null>(null)

  // Konami code sequence: ↑ ↑ ↓ ↓ ← → ← → B A
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ]
  const [konamiSequence, setKonamiSequence] = useState<string[]>([])

  // Handle key presses for Konami code
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.code

      // Add the key to the sequence
      const newSequence = [...konamiSequence, key]

      // Check if the sequence matches the Konami code so far
      const isMatch = newSequence.every((k, i) => i >= konamiCode.length || k === konamiCode[i])

      if (!isMatch) {
        // Reset if the sequence doesn't match
        setKonamiSequence([])
        return
      }

      setKonamiSequence(newSequence)

      // Check if the full Konami code has been entered
      if (newSequence.length === konamiCode.length && isMatch) {
        triggerEasterEgg("konami")
        setKonamiSequence([])
      }
    },
    [konamiSequence],
  )

  // Handle secret clicks on the profile photo
  const handleSecretClick = () => {
    setSecretClicks((prev) => {
      const newCount = prev + 1

      // Show hint after 3 clicks
      if (newCount === 3) {
        setShowHint(true)
        setTimeout(() => setShowHint(false), 3000)
      }

      // Activate Easter egg after 7 clicks
      if (newCount === 7) {
        triggerEasterEgg("click")
        return 0
      }

      return newCount
    })
  }

  // Trigger the Easter egg animation and effects
  const triggerEasterEgg = (type: "konami" | "click") => {
    setEggType(type)
    setKonamiActivated(true)

    // Launch confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
    })

    // Reset after animation completes
    setTimeout(() => {
      setKonamiActivated(false)
      setEggType(null)
    }, 5000)
  }

  // Set up event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className="relative" onClick={handleSecretClick}>
      {/* Easter egg content */}
      <AnimatePresence>
        {konamiActivated && (
          <motion.div
            key="easter-egg-modal"
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />

            <motion.div
              className="relative bg-background/80 backdrop-blur-md p-6 rounded-lg border border-primary/30 shadow-xl max-w-md text-center pointer-events-none"
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div
                className="text-5xl mb-4 flex justify-center"
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1, repeat: 2 }}
              >
                {eggType === "konami" ? (
                  <Code className="text-primary h-16 w-16" />
                ) : (
                  <Sparkles className="text-amber-500 h-16 w-16" />
                )}
              </motion.div>

              <motion.h3
                className="text-2xl font-bold mb-2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                {eggType === "konami" ? "Konami Code Activated!" : "You Found a Secret!"}
              </motion.h3>

              <p className="text-muted-foreground mb-4">
                {eggType === "konami"
                  ? "You've unlocked the legendary code! Nice keyboard skills."
                  : "Seven clicks reveal the magic! You're quite persistent."}
              </p>

              <div className="flex justify-center gap-4">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Zap className="h-8 w-8 text-amber-500" />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, -5, 0, 5, 0],
                  }}
                  transition={{ duration: 2, delay: 0.3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Smile className="h-8 w-8 text-green-500" />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ duration: 2, delay: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Sparkles className="h-8 w-8 text-blue-500" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Hint tooltip */}
        {showHint && (
          <motion.div
            key="easter-egg-hint"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-primary/20 whitespace-nowrap z-50 pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            Keep clicking... something magical might happen!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render children */}
      {children}
    </div>
  )
}