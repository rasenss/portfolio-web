"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface PatternPuzzleProps {
  onSolved: () => void
}

export function PatternPuzzle({ onSolved }: PatternPuzzleProps) {
  const [puzzle, setPuzzle] = useState<{
    pattern: string[][]
    options: string[]
    correctIndex: number
    hint?: string
  }>({ pattern: [], options: [], correctIndex: 0 })

  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    generatePuzzle()
  }, [])

  const generatePuzzle = () => {
    // Define a set of visual patterns
    const patterns = [
      {
        // Rotating arrow pattern
        pattern: [
          ["→", "↓", "←"],
          ["↑", "?", "↓"],
          ["→", "↑", "←"],
        ],
        options: ["→", "↓", "←", "↑"],
        correctIndex: 3,
        hint: "Look at how the arrows rotate around the center",
      },
      {
        // Number of sides pattern
        pattern: [
          ["○", "△", "□"],
          ["△", "□", "⬡"],
          ["□", "⬡", "?"],
        ],
        options: ["○", "△", "□", "⬡"],
        correctIndex: 0,
        hint: "Count the number of sides and follow the pattern",
      },
      {
        // Color pattern (represented by letters)
        pattern: [
          ["A", "B", "A"],
          ["B", "A", "B"],
          ["A", "B", "?"],
        ],
        options: ["A", "B", "C", "D"],
        correctIndex: 0,
        hint: "Look at how A and B alternate in each row and column",
      },
      {
        // Size pattern (represented by text)
        pattern: [
          ["S", "M", "L"],
          ["M", "L", "S"],
          ["L", "S", "?"],
        ],
        options: ["S", "M", "L", "XL"],
        correctIndex: 1,
        hint: "Each row follows a specific size sequence",
      },
    ]

    const selectedPuzzle = patterns[Math.floor(Math.random() * patterns.length)]
    setPuzzle(selectedPuzzle)
    setSelectedOption(null)
    setResult(null)
    setAttempts(0)
    setShowHint(false)
  }

  const checkAnswer = () => {
    if (selectedOption === null) return

    if (selectedOption === puzzle.correctIndex) {
      setResult("correct")
      onSolved()
    } else {
      setResult("incorrect")
      setAttempts(attempts + 1)

      // Show hint after 1 incorrect attempt
      if (attempts >= 0) {
        setShowHint(true)
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 text-center">
        <p className="text-sm mb-2">What symbol should replace the question mark?</p>

        {/* Display the pattern grid */}
        <div className="inline-grid grid-cols-3 gap-1 p-2 bg-muted/50 rounded-md">
          {puzzle.pattern.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className="w-8 h-8 flex items-center justify-center border border-border/50 rounded-sm bg-background"
              >
                {cell === "?" ? "?" : cell}
              </div>
            )),
          )}
        </div>
      </div>

      {/* Options */}
      <div className="flex gap-2 mb-3">
        {puzzle.options.map((option, index) => (
          <motion.button
            key={index}
            className={cn(
              "w-8 h-8 flex items-center justify-center border border-border rounded-md",
              selectedOption === index ? "bg-primary/20 border-primary" : "bg-background",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedOption(index)}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <Button size="sm" onClick={checkAnswer} disabled={selectedOption === null}>
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
