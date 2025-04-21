"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { InteractiveSkillBar } from "./interactive-skill-bar"
import { cn } from "@/lib/utils"

interface SkillCategoryProps {
  title: string
  skills: {
    name: string
    percentage: number
    color?: string
    description?: string
    projects?: { name: string; url?: string }[]
  }[]
  defaultOpen?: boolean
}

export function SkillCategory({ title, skills, defaultOpen = false }: SkillCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="border border-border rounded-lg overflow-hidden"
    >
      <motion.div
className={cn(
  "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer gap-2 sm:gap-0",
  isOpen ? "bg-muted" : "bg-background"
)}
onClick={() => setIsOpen(!isOpen)}
>
<h3 className="text-lg font-medium text-foreground">{title}</h3>
  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
    <ChevronDown className="h-5 w-5 text-muted-foreground" />
  </motion.div>
      </motion.div>

      <AnimatePresence initial={false}>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-background"
    >
      <div className="p-4 space-y-6">
        {skills.map((skill, index) => (
          <InteractiveSkillBar
            key={skill.name}
            skill={skill.name}
            percentage={skill.percentage}
            color={skill.color}
            description={skill.description}
            projects={skill.projects}
          />
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.div>
  )
}