"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface LogicPuzzleProps {
  onSolved: () => void
}

export function LogicPuzzle({ onSolved }: LogicPuzzleProps) {
  const [puzzle, setPuzzle] = useState<{
    statements: string[]
    question: string
    options: string[]
    correctIndex: number
    hint?: string
  }>({ statements: [], question: "", options: [], correctIndex: 0 })

  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    generatePuzzle()
  }, [])

  const generatePuzzle = () => {
    // Define a set of logic puzzles
    const puzzles = [
      {
        statements: ["All websites use HTML.", "This portfolio is a website."],
        question: "What can you conclude?",
        options: [
          "This portfolio uses HTML.",
          "This portfolio doesn't use HTML.",
          "Not all websites use HTML.",
          "None of the above.",
        ],
        correctIndex: 0,
        hint: "This is a classic syllogism. If all A are B, and C is A, then C is B.",
      },
      {
        statements: ["Either the website has CSS or it has JavaScript.", "The website does not have CSS."],
        question: "What must be true?",
        options: [
          "The website has JavaScript.",
          "The website doesn't have JavaScript.",
          "The website has neither CSS nor JavaScript.",
          "The website has both CSS and JavaScript.",
        ],
        correctIndex: 0,
        hint: "This is a disjunctive syllogism. If A or B is true, and A is false, then B must be true.",
      },
      {
        statements: ["If a developer knows React, they know JavaScript.", "Alice knows React."],
        question: "What can you conclude about Alice?",
        options: [
          "Alice knows JavaScript.",
          "Alice doesn't know JavaScript.",
          "Alice might know JavaScript.",
          "Nothing can be concluded.",
        ],
        correctIndex: 0,
        hint: "This is modus ponens. If A implies B, and A is true, then B is true.",
      },
      {
        statements: ["All good websites are responsive.", "Some websites with animations are not responsive."],
        question: "What can you conclude?",
        options: [
          "All websites with animations are not good.",

          "Some websites with animations are not good.",
          "No websites with animations are good.",
          "All good websites have animations.",
        ],
        correctIndex: 1,
        hint: "If all A are B, and some C are not B, then some C are not A.",
      },
    ]

    const selectedPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)]
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
      <div className="w-full mb-3">
        <div className="p-2 bg-muted/50 rounded-md mb-2">
          {puzzle.statements.map((statement, index) => (
            <p key={index} className="text-xs mb-1">
              • {statement}
            </p>
          ))}
        </div>
        <p className="text-sm font-medium mb-2">{puzzle.question}</p>
      </div>

      {/* Options */}
      <div className="w-full space-y-2 mb-3">
        {puzzle.options.map((option, index) => (
          <motion.button
            key={index}
            className={cn(
              "w-full p-2 text-xs text-left border border-border rounded-md",
              selectedOption === index ? "bg-primary/20 border-primary" : "bg-background",
            )}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
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
