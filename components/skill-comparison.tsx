"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SkillComparisonProps {
  skills: {
    name: string
    percentage: number
    color?: string
  }[]
}

export function SkillComparison({ skills }: SkillComparisonProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const toggleSkill = (skillName: string) => {
    setIsAnimating(true)
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((name) => name !== skillName))
    } else {
      if (selectedSkills.length < 3) {
        setSelectedSkills([...selectedSkills, skillName])
      } else {
        setSelectedSkills([...selectedSkills.slice(1), skillName])
      }
    }

    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  const filteredSkills = skills.filter((skill) => selectedSkills.includes(skill.name))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Button
            key={skill.name}
            variant={selectedSkills.includes(skill.name) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleSkill(skill.name)}
            className={cn(
              "transition-all",
              selectedSkills.includes(skill.name) && "ring-2 ring-primary/50"
            )}
          >
            {skill.name}
          </Button>
        ))}
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        {selectedSkills.length === 0 ? (
          <p className="text-center text-muted-foreground">Select skills to compare</p>
        ) : (
          <div className="space-y-6">
            {filteredSkills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="font-medium">{skill.name}</span>
                  <span>{skill.percentage}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${skill.color || "bg-primary"} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.percentage}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}