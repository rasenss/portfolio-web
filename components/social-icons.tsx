"use client"

import Link from "next/link"
import { Github, Linkedin, Instagram, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialIconsProps {
  className?: string
  iconSize?: number
  showLabels?: boolean
}

export function SocialIcons({ className, iconSize = 20, showLabels = false }: SocialIconsProps) {
  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/rasendriya-khansa/",
      color: "hover:text-[#0077B5]",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/rasenss",
      color: "hover:text-[#333]",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/rasendkhansa",
      color: "hover:text-[#E1306C]",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:rasuen27@gmail.com",
      color: "hover:text-primary",
    },
  ]

  return (
    <div
      className={cn(
        showLabels
          ? "flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          : "flex flex-row flex-wrap items-center gap-4 sm:gap-6",
        className
      )}
    >
      {socialLinks.map((social) => (
        <Link
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "transition-colors duration-200 theme-text-transition flex items-center gap-2",
            social.color,
            showLabels ? "w-full sm:w-auto" : ""
          )}
          aria-label={social.name}
        >
          <social.icon size={iconSize} />
          {showLabels && <span className="text-sm font-medium">{social.name}</span>}
        </Link>
      ))}
    </div>
  )
}