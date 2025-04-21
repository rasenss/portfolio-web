"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"

export function PixelArtGame() {
  const [grid, setGrid] = useState<string[][]>([])
  const [selectedColor, setSelectedColor] = useState("#3B82F6") // Default blue
  const [isDrawing, setIsDrawing] = useState(false)
  const gridSize = 12 // 12x12 grid

  const colors = [
    "#EF4444", // red
    "#F97316", // orange
    "#F59E0B", // amber
    "#10B981", // emerald
    "#3B82F6", // blue
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#000000", // black
    "#FFFFFF", // white
  ]

  // Initialize empty grid
  useEffect(() => {
    const newGrid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill("transparent"))
    setGrid(newGrid)
  }, [])

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true)
    colorPixel(rowIndex, colIndex)
  }

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isDrawing) {
      colorPixel(rowIndex, colIndex)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const colorPixel = (rowIndex: number, colIndex: number) => {
    const newGrid = [...grid]
    newGrid[rowIndex][colIndex] = selectedColor
    setGrid(newGrid)
  }

  const clearCanvas = () => {
    const newGrid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill("transparent"))
    setGrid(newGrid)
  }

  const downloadImage = () => {
    // Create a canvas element
    const canvas = document.createElement("canvas")
    const pixelSize = 20
    const canvasSize = gridSize * pixelSize

    canvas.width = canvasSize
    canvas.height = canvasSize

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw the pixels
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const color = grid[row][col]
        if (color !== "transparent") {
          ctx.fillStyle = color
          ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize)
        }
      }
    }

    // Create download link
    const link = document.createElement("a")
    link.download = "pixel-art.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="flex flex-col items-center" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="mb-4 flex flex-wrap gap-1 justify-center">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-6 h-6 rounded-full ${selectedColor === color ? "ring-2 ring-primary" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>

      <div
        className="border border-border rounded-md overflow-hidden mb-4"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: 1,
          backgroundColor: "#e5e7eb",
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-5 h-5 cursor-pointer"
              style={{
                backgroundColor: color === "transparent" ? "#f9fafb" : color,
                border: "1px solid #e5e7eb",
              }}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            />
          )),
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={clearCanvas} className="flex items-center">
          <Trash2 className="mr-1 h-4 w-4" /> Clear
        </Button>
        <Button size="sm" onClick={downloadImage} className="flex items-center">
          <Download className="mr-1 h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  )
}
