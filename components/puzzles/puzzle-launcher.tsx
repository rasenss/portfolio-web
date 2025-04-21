"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Code, BrainCircuit, Sigma, Puzzle } from "lucide-react"
import { cn } from "@/lib/utils"
import { MathPuzzle } from "./math-puzzle"
import { PatternPuzzle } from "./pattern-puzzle"
import { CodePuzzle } from "./code-puzzle"
import { LogicPuzzle } from "./logic-puzzle"

interface PuzzleLauncherProps {
  className?: string
}

export function PuzzleLauncher({ className }: PuzzleLauncherProps) {
  const [activePuzzle, setActivePuzzle] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(true)
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Hide hint after 5 seconds
  setTimeout(() => {
    setShowHint(false)
  }, 5000)

  const puzzles = [
    {
      id: "math",
      name: "Math Challenge",
      icon: Calculator,
      color: "text-amber-500 hover:text-amber-400",
      description: "Solve a mathematical puzzle",
    },
    {
      id: "pattern",
      name: "Pattern Recognition",
      icon: BrainCircuit,
      color: "text-purple-500 hover:text-purple-400",
      description: "Find the pattern in this sequence",
    },
    {
      id: "code",
      name: "Code Challenge",
      icon: Code,
      color: "text-blue-500 hover:text-blue-400",
      description: "Fix the code to solve the puzzle",
    },
    {
      id: "logic",
      name: "Logic Puzzle",
      icon: Puzzle,
      color: "text-green-500 hover:text-green-400",
      description: "Test your logical reasoning",
    },
    {
      id: "secret",
      name: "Secret Challenge",
      icon: Sigma,
      color: "text-pink-500 hover:text-pink-400",
      description: "Unlock this special challenge",
    },
  ]

  const handlePuzzleSolved = (puzzleId: string) => {
    if (!solvedPuzzles.includes(puzzleId)) {
      setSolvedPuzzles([...solvedPuzzles, puzzleId])
    }
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs border border-primary/20 whitespace-nowrap z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            Try these puzzles! 🧩
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle icons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {puzzles.map((puzzle) => (
          <motion.button
            key={puzzle.id}
            className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border p-1.5 transition-all",
              puzzle.color,
              activePuzzle === puzzle.id ? "ring-2 ring-primary" : "hover:scale-110",
              solvedPuzzles.includes(puzzle.id) && "bg-primary/10",
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePuzzle(activePuzzle === puzzle.id ? null : puzzle.id)}
            aria-label={puzzle.name}
          >
            <puzzle.icon size={16} />

            {/* Solved indicator */}
            {solvedPuzzles.includes(puzzle.id) && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Puzzle container */}
      <AnimatePresence mode="wait">
        {activePuzzle && (
          <motion.div
            className={cn(
              "absolute z-50 bg-background border border-border rounded-lg shadow-lg overflow-hidden",
              "right-0 bottom-12 w-[90vw] max-w-xs sm:w-[320px] sm:max-w-sm"
            )}
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{puzzles.find((p) => p.id === activePuzzle)?.name}</h3>
                <button
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setActivePuzzle(null)}
                >
                  Close
                </button>
              </div>

              {activePuzzle === "math" && <MathPuzzle onSolved={() => handlePuzzleSolved("math")} />}
              {activePuzzle === "pattern" && <PatternPuzzle onSolved={() => handlePuzzleSolved("pattern")} />}
              {activePuzzle === "code" && <CodePuzzle onSolved={() => handlePuzzleSolved("code")} />}
              {activePuzzle === "logic" && <LogicPuzzle onSolved={() => handlePuzzleSolved("logic")} />}
              {activePuzzle === "secret" &&
                (solvedPuzzles.length >= 3 ? (
                  <MathPuzzle difficulty="hard" onSolved={() => handlePuzzleSolved("secret")} />
                ) : (
                  <div className="text-center p-3">
                    <p className="text-sm mb-2">This challenge is locked!</p>
                    <p className="text-xs text-muted-foreground">Solve at least 3 other puzzles to unlock.</p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}