"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function MemoryGame() {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [gameState, setGameState] = useState<"idle" | "showing" | "input" | "success" | "failure">("idle")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [level, setLevel] = useState(1)

  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"]

  useEffect(() => {
    if (gameState === "idle") {
      startGame()
    }
  }, [gameState])

  useEffect(() => {
    if (gameState === "showing" && currentIndex < sequence.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
      }, 600)

      return () => clearTimeout(timer)
    } else if (gameState === "showing" && currentIndex >= sequence.length) {
      setTimeout(() => {
        setGameState("input")
        setCurrentIndex(0)
      }, 300)
    }
  }, [gameState, currentIndex, sequence])

  useEffect(() => {
    // Check if player's sequence matches the game sequence
    if (gameState === "input" && playerSequence.length > 0) {
      const lastIndex = playerSequence.length - 1

      if (playerSequence[lastIndex] !== sequence[lastIndex]) {
        // Wrong input
        setGameState("failure")
        return
      }

      if (playerSequence.length === sequence.length) {
        // Completed the sequence successfully
        setGameState("success")
      }
    }
  }, [playerSequence, gameState, sequence])

  const startGame = () => {
    // Generate initial sequence
    const newSequence = [...sequence]
    newSequence.push(Math.floor(Math.random() * 4))

    setSequence(newSequence)
    setPlayerSequence([])
    setCurrentIndex(0)
    setGameState("showing")
  }

  const nextLevel = () => {
    setLevel(level + 1)
    setGameState("idle")
  }

  const resetGame = () => {
    setSequence([])
    setPlayerSequence([])
    setLevel(1)
    setGameState("idle")
  }

  const handleTileClick = (index: number) => {
    if (gameState !== "input") return

    setPlayerSequence([...playerSequence, index])
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-center">
        <p className="text-xs text-muted-foreground">Level: {level}</p>
        <p className="text-xs">
          {gameState === "showing" && "Watch the pattern..."}
          {gameState === "input" && "Repeat the pattern!"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {colors.map((color, index) => (
          <motion.button
            key={index}
            className={`w-12 h-12 rounded-lg ${color} opacity-70`}
            whileTap={{ scale: 0.95 }}
            animate={{
              opacity:
                gameState === "showing" && currentIndex < sequence.length && sequence[currentIndex] === index ? 1 : 0.7,
              scale:
                gameState === "showing" && currentIndex < sequence.length && sequence[currentIndex] === index ? 1.1 : 1,
            }}
            onClick={() => handleTileClick(index)}
          />
        ))}
      </div>

      {(gameState === "success" || gameState === "failure") && (
        <div className="flex gap-2">
          {gameState === "success" && (
            <Button onClick={nextLevel} size="sm" variant="default">
              Next Level
            </Button>
          )}
          <Button onClick={resetGame} size="sm" variant={gameState === "failure" ? "default" : "outline"}>
            {gameState === "failure" ? "Try Again" : "Restart"}
          </Button>
        </div>
      )}
    </div>
  )
}
