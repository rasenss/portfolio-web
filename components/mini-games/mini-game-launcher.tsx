"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gamepad2, Zap, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReactionGame } from "./reaction-game"
import { MemoryGame } from "./memory-game"

interface MiniGameLauncherProps {
  className?: string
}

export function MiniGameLauncher({ className }: MiniGameLauncherProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Hide hint after 5 seconds
  setTimeout(() => {
    setShowHint(false)
  }, 5000)

  const games = [
    {
      id: "reaction",
      name: "Reaction Test",
      icon: Zap,
      color: "text-amber-500 hover:text-amber-400",
      description: "Test your reaction speed!",
    },
    {
      id: "memory",
      name: "Memory Match",
      icon: Brain,
      color: "text-purple-500 hover:text-purple-400",
      description: "Match the patterns in this memory challenge",
    },
    {
      id: "arcade",
      name: "Mini Arcade",
      icon: Gamepad2,
      color: "text-pink-500 hover:text-pink-400",
      description: "Play a mini arcade game",
    },
  ]

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs border border-primary/20 whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            Try these mini-games!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game icons */}
      <div className="flex items-center justify-center gap-3">
        {games.map((game) => (
          <motion.button
            key={game.id}
            className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border p-1.5 transition-all",
              game.color,
              activeGame === game.id ? "ring-2 ring-primary" : "hover:scale-110",
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveGame(activeGame === game.id ? null : game.id)}
            aria-label={game.name}
          >
            <game.icon size={16} />
          </motion.button>
        ))}
      </div>

      {/* Game container */}
      <AnimatePresence mode="wait">
        {activeGame && (
          <motion.div
            className="absolute bottom-12 right-0 w-[280px] bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{games.find((g) => g.id === activeGame)?.name}</h3>
                <button
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setActiveGame(null)}
                >
                  Close
                </button>
              </div>
              {activeGame === "reaction" && <ReactionGame />}
              {activeGame === "memory" && <MemoryGame />}
              {activeGame === "arcade" && <ReactionGame />} {/* Reuse reaction game for simplicity */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
