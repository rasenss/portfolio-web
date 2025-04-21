"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface CodePuzzleProps {
  onSolved: () => void
}

export function CodePuzzle({ onSolved }: CodePuzzleProps) {
  const [puzzle, setPuzzle] = useState<{
    code: string
    options: string[]
    correctIndex: number
    hint?: string
  }>({ code: "", options: [], correctIndex: 0 })

  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    generatePuzzle()
  }, [])

  const generatePuzzle = () => {
    // Define a set of code puzzles
    const puzzles = [
      {
        code: `function sum(a, b) {
  return ____;
}`,
        options: ["a + b", "a - b", "a * b", "a / b"],
        correctIndex: 0,
        hint: "This function should add two numbers together",
      },
      {
        code: `const colors = ["red", "green", "blue"];
colors.____(item => console.log(item));`,
        options: ["map", "forEach", "filter", "reduce"],
        correctIndex: 1,
        hint: "We want to perform an action for each item in the array",
      },
      {
        code: `const user = {
  name: "John",
  age: 30
};
console.log(____);`,
        options: ["user.name", "user[name]", "user->name", "user::name"],
        correctIndex: 0,
        hint: "How do you access a property of an object in JavaScript?",
      },
      {
        code: `let count = 0;
const increment = () => {
  ____count;
  return count;
};`,
        options: ["++", "--", "**", "//"],
        correctIndex: 0,
        hint: "The function should increase the count by 1",
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
        <p className="text-sm mb-2">Fill in the blank to complete the code:</p>
        <pre className="p-2 bg-muted/50 rounded-md text-xs font-mono overflow-x-auto whitespace-pre">{puzzle.code}</pre>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2 w-full mb-3">
        {puzzle.options.map((option, index) => (
          <motion.button
            key={index}
            className={cn(
              "p-1.5 text-xs font-mono border border-border rounded-md text-center",
              selectedOption === index ? "bg-primary/20 border-primary" : "bg-background",
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
