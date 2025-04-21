"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export function ColorMatchGame() {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentColors, setCurrentColors] = useState<{
    name: string
    displayColor: string
    textColor: string
    match: boolean
  }>({ name: "", displayColor: "", textColor: "", match: false })

  const colorOptions = [
    { name: "Red", color: "text-red-500" },
    { name: "Blue", color: "text-blue-500" },
    { name: "Green", color: "text-green-500" },
    { name: "Yellow", color: "text-yellow-500" },
    { name: "Purple", color: "text-purple-500" },
    { name: "Orange", color: "text-orange-500" },
  ]

  useEffect(() => {
    if (gameState === "playing") {
      generateNewRound()

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setGameState("finished")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameState])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setRounds(0)
    setTimeLeft(30)
  }

  const generateNewRound = () => {
    // Select a random color name
    const nameIndex = Math.floor(Math.random() * colorOptions.length)
    const colorName = colorOptions[nameIndex].name

    // Select a random display color (may or may not match the name)
    const displayIndex = Math.floor(Math.random() * colorOptions.length)
    const displayColor = colorOptions[displayIndex].color

    // Decide if this should be a matching pair (50% chance)
    const shouldMatch = Math.random() > 0.5

    // If it should match, make the display color match the name
    const finalDisplayColor = shouldMatch ? colorOptions[nameIndex].color : displayColor

    setCurrentColors({
      name: colorName,
      displayColor: finalDisplayColor,
      textColor: colorOptions[Math.floor(Math.random() * colorOptions.length)].color,
      match: shouldMatch,
    })

    setRounds(rounds + 1)
  }

  const handleAnswer = (userAnswer: boolean) => {
    // Check if user's answer is correct
    if (userAnswer === currentColors.match) {
      setScore(score + 1)
    }

    generateNewRound()
  }

  const endGame = () => {
    setGameState("finished")
    if (score > highScore) {
      setHighScore(score)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {gameState === "ready" && (
        <div className="text-center mb-4">
          <p className="mb-2">Does the color match the word?</p>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className="flex justify-between w-full mb-4 text-sm">
            <div>
              Score: {score}/{rounds}
            </div>
            <div>Time: {timeLeft}s</div>
          </div>

          <div className="mb-6 text-center">
            <p className="text-sm mb-2">Does the color match the word?</p>
            <motion.div
              className={`text-3xl font-bold mb-6 ${currentColors.displayColor}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              key={rounds}
            >
              {currentColors.name}
            </motion.div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                className="w-20 flex items-center justify-center"
                onClick={() => handleAnswer(true)}
              >
                <Check className="mr-1 h-4 w-4" /> Yes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-20 flex items-center justify-center"
                onClick={() => handleAnswer(false)}
              >
                <X className="mr-1 h-4 w-4" /> No
              </Button>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={endGame}>
            End Game
          </Button>
        </>
      )}

      {gameState === "finished" && (
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Game Over!</p>
          <p className="mb-4">
            Your score:{" "}
            <span className="font-bold">
              {score}/{rounds}
            </span>
            {highScore > 0 && <span className="text-sm text-muted-foreground ml-2">(Best: {highScore})</span>}
          </p>
          <Button onClick={startGame}>Play Again</Button>
        </div>
      )}
    </div>
  )
}
