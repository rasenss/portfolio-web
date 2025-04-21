"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X } from "lucide-react"

interface MathPuzzleProps {
  onSolved: () => void
  difficulty?: "easy" | "medium" | "hard"
}

export function MathPuzzle({ onSolved, difficulty = "easy" }: MathPuzzleProps) {
  const [puzzle, setPuzzle] = useState<{
    question: string
    answer: number
    hint?: string
  }>({ question: "", answer: 0 })
  const [userAnswer, setUserAnswer] = useState("")
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    generatePuzzle()
  }, [difficulty])

  const generatePuzzle = () => {
    let newPuzzle = { question: "", answer: 0, hint: "" }

    switch (difficulty) {
      case "easy":
        // Simple arithmetic or sequence
        const operations = ["+", "-", "×"]
        const operation = operations[Math.floor(Math.random() * operations.length)]
        const num1 = Math.floor(Math.random() * 20) + 1
        const num2 = Math.floor(Math.random() * 10) + 1

        if (operation === "+") {
          newPuzzle = {
            question: `${num1} + ${num2} = ?`,
            answer: num1 + num2,
            hint: "Add the numbers together",
          }
        } else if (operation === "-") {
          newPuzzle = {
            question: `${num1} - ${num2} = ?`,
            answer: num1 - num2,
            hint: "Subtract the second number from the first",
          }
        } else {
          newPuzzle = {
            question: `${num1} × ${num2} = ?`,
            answer: num1 * num2,
            hint: "Multiply the numbers together",
          }
        }
        break

      case "medium":
        // Sequence completion
        const sequences = [
          {
            pattern: [2, 4, 6, 8],
            next: 10,
            hint: "Add 2 to each number",
          },
          {
            pattern: [3, 6, 9, 12],
            next: 15,
            hint: "Multiples of 3",
          },
          {
            pattern: [1, 4, 9, 16],
            next: 25,
            hint: "Square numbers",
          },
          {
            pattern: [1, 1, 2, 3, 5],
            next: 8,
            hint: "Each number is the sum of the two before it",
          },
        ]

        const seq = sequences[Math.floor(Math.random() * sequences.length)]
        newPuzzle = {
          question: `What comes next in this sequence? ${seq.pattern.join(", ")}, ...`,
          answer: seq.next,
          hint: seq.hint,
        }
        break

      case "hard":
        // More complex problems
        const hardProblems = [
          {
            question: "If 3x + 7 = 22, what is the value of x?",
            answer: 5,
            hint: "Subtract 7 from both sides, then divide by 3",
          },
          {
            question: "Find the missing number: 1, 3, 6, 10, 15, ?",
            answer: 21,
            hint: "The differences between consecutive terms form a sequence: 2, 3, 4, 5...",
          },
          {
            question: "If a = 3 and b = 4, what is a² + b²?",
            answer: 25,
            hint: "Square each number and add them together",
          },
          {
            question: "Solve for x: 2^x = 32",
            answer: 5,
            hint: "What power of 2 equals 32?",
          },
        ]

        newPuzzle = hardProblems[Math.floor(Math.random() * hardProblems.length)]
        break
    }

    setPuzzle(newPuzzle)
    setUserAnswer("")
    setResult(null)
    setAttempts(0)
    setShowHint(false)
  }

  const checkAnswer = () => {
    const parsedAnswer = Number.parseFloat(userAnswer)

    if (isNaN(parsedAnswer)) {
      setResult("incorrect")
      setAttempts(attempts + 1)
      return
    }

    if (parsedAnswer === puzzle.answer) {
      setResult("correct")
      onSolved()
    } else {
      setResult("incorrect")
      setAttempts(attempts + 1)

      // Show hint after 2 incorrect attempts
      if (attempts >= 1) {
        setShowHint(true)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value)
    setResult(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mb-3 p-3 bg-muted/50 rounded-md text-center">
        <p className="text-sm font-medium">{puzzle.question}</p>
      </div>

      <div className="w-full mb-3">
        <Input
          type="text"
          value={userAnswer}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter your answer"
          className="text-center"
        />
      </div>

      <div className="flex gap-2 mb-2">
        <Button size="sm" onClick={checkAnswer}>
          Check
        </Button>
        <Button size="sm" variant="outline" onClick={generatePuzzle}>
          New Puzzle
        </Button>
      </div>

      {result && (
        <motion.div
          className={cn(
            "w-full p-2 rounded-md text-center text-sm",
            result === "correct"
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400",
          )}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {result === "correct" ? (
            <div className="flex items-center justify-center">
              <Check className="h-4 w-4 mr-1" /> Correct!
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <X className="h-4 w-4 mr-1" /> Try again
            </div>
          )}
        </motion.div>
      )}

      {showHint && puzzle.hint && (
        <motion.div
          className="w-full mt-2 p-2 bg-blue-500/10 rounded-md text-center text-xs text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Hint: {puzzle.hint}
        </motion.div>
      )}
    </div>
  )
}
