"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReactionGame() {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "clicking" | "results">("waiting")
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (gameState === "waiting") {
      startGame()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [gameState])

  const startGame = () => {
    setGameState("ready")

    // Random delay between 1-3 seconds
    const delay = Math.floor(Math.random() * 2000) + 1000

    timerRef.current = setTimeout(() => {
      setGameState("clicking")
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "ready") {
      // Clicked too early!
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      setGameState("results")
      setReactionTime(-1) // Indicates too early
    } else if (gameState === "clicking") {
      // Good click, calculate reaction time
      const endTime = Date.now()
      const time = endTime - startTime
      setReactionTime(time)

      // Update best time
      if (bestTime === null || time < bestTime) {
        setBestTime(time)
      }

      setGameState("results")
    }
  }

  const resetGame = () => {
    setGameState("waiting")
    setReactionTime(null)
  }

  return (
    <div className="flex flex-col items-center">
      {gameState === "ready" && (
        <motion.div
          className="w-full h-24 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={handleClick}
        >
          <p className="text-center text-sm text-amber-800 dark:text-amber-200">Wait for green...</p>
        </motion.div>
      )}

      {gameState === "clicking" && (
        <motion.div
          className="w-full h-24 bg-green-500 rounded-lg flex items-center justify-center cursor-pointer"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
        >
          <Zap className="h-8 w-8 text-white" />
        </motion.div>
      )}

      {gameState === "results" && (
        <div className="text-center">
          {reactionTime === -1 ? (
            <p className="text-sm font-medium text-red-500 mb-2">Too early! Try again.</p>
          ) : (
            <>
              <p className="text-sm mb-1">Your reaction time:</p>
              <p className="text-xl font-bold mb-1">{reactionTime}ms</p>
              {bestTime !== null && <p className="text-xs text-muted-foreground mb-2">Best: {bestTime}ms</p>}
            </>
          )}

          <Button size="sm" onClick={resetGame}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
