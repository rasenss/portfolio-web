"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full" disabled>
        <span className="sr-only">Toggle theme</span>
        <Sun className="h-5 w-5 text-muted-foreground" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 rounded-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-300" />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
