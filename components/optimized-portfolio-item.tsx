"use client"

import { memo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface PortfolioItemProps {
  id: number
  title: string
  category: string
  image: string
  onClick: () => void
  index: number
  prefersReducedMotion: boolean
}

function OptimizedPortfolioItem({
  id,
  title,
  category,
  image,
  onClick,
  index,
  prefersReducedMotion,
}: PortfolioItemProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md cursor-pointer theme-transition"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : 0.4,
        delay: prefersReducedMotion ? 0 : 0.05 * (index % 4),
      }}
      layout
      layoutId={`portfolio-item-${id}`}
    >
      <div className="aspect-square relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 8} // Prioritize loading the first 8 images
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
          <div className="text-center p-4">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-white/80 mt-2">Click to view details</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default memo(OptimizedPortfolioItem)
