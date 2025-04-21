"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export function CodeTypingGame() {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready")
  const [currentCode, setCurrentCode] = useState("")
  const [userInput, setUserInput] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const codeSamples = [
    "const greeting = 'Hello World';",
    "function add(a, b) { return a + b; }",
    "const items = [1, 2, 3].map(x => x * 2);",
    "import React from 'react';",
    "const [count, setCount] = useState(0);",
    "useEffect(() => { console.log('mounted') });",
    "<div className='container'>Content</div>",
    "export default function App() { return <div />; }",
    "const data = await fetch('/api/users');",
    "const { name, age } = person;",
  ]

  useEffect(() => {
    if (gameState === "playing") {
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

  useEffect(() => {
    // Focus the input when game starts
    if (gameState === "playing" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameState])

  useEffect(() => {
    // Check if user completed the current code
    if (gameState === "playing" && userInput === currentCode) {
      setScore(score + 1)
      nextCode()
    }
  }, [userInput, currentCode, gameState, score])

  const startGame = () => {
    setGameState("playing")
    setTimeLeft(30)
    setScore(0)
    setUserInput("")
    nextCode()
  }

  const nextCode = () => {
    // Get a random code sample that's different from the current one
    let newCode
    do {
      newCode = codeSamples[Math.floor(Math.random() * codeSamples.length)]
    } while (newCode === currentCode && codeSamples.length > 1)

    setCurrentCode(newCode)
    setUserInput("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const endGame = () => {
    setGameState("finished")
    if (score > highScore) {
      setHighScore(score)
    }
  }

  return (
    <div className="flex flex-col">
      {gameState === "ready" && (
        <div className="text-center mb-4">
          <p className="mb-2">Type the code as fast as you can!</p>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className="flex justify-between mb-2 text-sm">
            <div>Score: {score}</div>
            <div>Time: {timeLeft}s</div>
          </div>

          <div className="p-3 bg-muted rounded-md mb-3 font-mono text-sm overflow-x-auto">{currentCode}</div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md mb-3 font-mono text-sm"
            placeholder="Type here..."
            autoComplete="off"
          />

          <Button variant="outline" size="sm" onClick={endGame}>
            End Game
          </Button>
        </>
      )}

      {gameState === "finished" && (
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Game Over!</p>
          <p className="mb-4">
            Your score: <span className="font-bold">{score}</span>
            {highScore > 0 && <span className="text-sm text-muted-foreground ml-2">(Best: {highScore})</span>}
          </p>
          <Button onClick={startGame}>Play Again</Button>
        </div>
      )}
    </div>
  )
}
