"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Tab } from "@headlessui/react"
import { cn } from "@/lib/utils"
import { ExternalLink, Github, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import OptimizedPortfolioItem from "./optimized-portfolio-item"

interface PortfolioItem {
  id: number
  title: string
  category: string
  image: string
  description?: string
  liveUrl?: string
  repoUrl?: string
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Mobile Apps Design",
    category: "mobile",
    image: "/img/Mobile-Design/HealtyApp-Design/COVER.png",
    description: "Health tracking mobile application with intuitive interface and data visualization.",
    liveUrl: "https://www.figma.com/community/file/1347842363347325628/healty-apps-mobile-apps",
  },
  {
    id: 2,
    title: "Simple Design Poster",
    category: "poster",
    image: "/img/Poster-Design/event-poster.png",
    description: "Minimalist poster design with focus on typography and visual hierarchy.",
  },
  {
    id: 3,
    title: "Logo",
    category: "logo",
    image: "/img/Logo/BnW-Logo.png",
    description: "Brand identity design with versatile logo applications.",
  },
  {
    id: 4,
    title: "Mobile Apps Design",
    category: "mobile",
    image: "/img/Mobile-Design/Login-Page-Design/cover-login.png",
    description: "A Login Page Mobile design focusing on user experience and modern interface elements.",
    liveUrl: "https://www.figma.com/community/file/1352653945260305149/login-page",
  },
  {
    id: 5,
    title: "Data Series 11.0 Carousel",
    category: "social",
    image: "/img/Linkedin-Post/Data-Series-11.0.png",
    description: "Data visualization poster series for health metrics and analytics.",
    liveUrl: "https://behance.net/rasendriya/h-app-data",
  },
  {
    id: 6,
    title: "Digital Skill Fair 23.0",
    category: "social",
    image: "/img/Linkedin-Post/Digital-Skill-fair-23.0.png",
    description: "Event poster design for digital skills fair with modern typography.",
    liveUrl: "https://behance.net/rasendriya/skill-fair",
  },
  {
    id: 7,
    title: "Product Series 3.0",
    category: "social",
    image: "/img/Linkedin-Post/Product-Series-Fair-3.0.png",
    description: "Product showcase poster series with clean layout and visual hierarchy.",
    liveUrl: "https://behance.net/rasendriya/product-series",
  },
  {
    id: 8,
    title: "Simple Logo",
    category: "logo",
    image: "/img/Logo/BnW-2.png",
    description: "Minimalist logo design focusing on simplicity and brand recognition.",
  },
  {
    id: 9,
    title: "Tech Logo",
    category: "logo",
    image: "/img/Logo/TechXperience-Logo.png",
    description: "Technology-focused logo design with modern elements and dynamic shapes.",
  },
  {
    id: 10,
    title: "Hiking Logo Group",
    category: "logo",
    image: "/img/Logo/logo2.jpg",
    description: "Collection of outdoor and adventure themed logo designs for hiking groups.",
    liveUrl: "https://dribbble.com/rasendriya/hiking-logos",
  },
  {
    id: 11,
    title: "Menu List Design",
    category: "simple",
    image: "/img/Simple-Design/Menu.png",
    description: "Restaurant menu UI design with focus on readability and visual appeal.",
  },
  {
    id: 12,
    title: "Event Poster",
    category: "poster",
    image: "/img/Poster-Design/instagram-poster.png",
    description: "Dynamic event poster design with bold typography and engaging visuals.",
  },
]

const categories = [
  { id: "all", name: "All" },
  { id: "mobile", name: "Mobile Apps" },
  { id: "logo", name: "Logo" },
  { id: "poster", name: "Poster" },
  { id: "social", name: "Social Media" },
  { id: "simple", name: "Simple Design" },
]

// Preload images for better performance
const preloadImage = (src: string) => {
  if (typeof window !== "undefined") {
    const img = new Image()
    img.src = src
    img.crossOrigin = "anonymous"
  }
}

export function EnhancedPortfolioGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const imgRef = useRef<HTMLImageElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isAnimating, setIsAnimating] = useState(false)

  // Memoize filtered items to prevent unnecessary recalculations
  const filteredItems = useMemo(
    () =>
      selectedCategory === "all" ? portfolioItems : portfolioItems.filter((item) => item.category === selectedCategory),
    [selectedCategory],
  )

  // Handle URL hash for direct navigation to portfolio section
  useEffect(() => {
    setMounted(true)

    // Preload images for better performance
    portfolioItems.forEach((item) => {
      preloadImage(item.image)
    })
  }, [])

  // Optimize the item click handler
  const handleItemClick = useCallback((item: PortfolioItem) => {
    setSelectedItem(item)
    setIsOpen(true)
    setImageLoaded(false)
  }, [])

  // Optimize the image load handler
  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    setImageSize({
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
    setImageLoaded(true)
  }, [])

  // Optimize category change handler
  const handleCategoryChange = useCallback(
    (category: string) => {
      if (category === selectedCategory) return

      setIsAnimating(true)
      setSelectedCategory(category)

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    },
    [selectedCategory],
  )

  // Wait for client-side rendering
  if (!mounted) return null

  return (
    <div className="mt-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Tab.Group>
          <Tab.List className="flex flex-wrap justify-center gap-2 rounded-xl p-1 mb-2">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Tab
                  className={({ selected }) =>
                    cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-all focus:outline-none theme-transition",
                      selected
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )
                  }
                  onClick={() => handleCategoryChange(category.id)}
                  disabled={isAnimating}
                >
                  {category.name}
                </Tab>
              </motion.div>
            ))}
          </Tab.List>
        </Tab.Group>
      </motion.div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredItems.map((item, index) => (
              <OptimizedPortfolioItem
                key={item.id}
                id={item.id}
                title={item.title}
                category={item.category}
                image={item.image}
                onClick={() => handleItemClick(item)}
                index={index}
                prefersReducedMotion={!!prefersReducedMotion}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn(
            "theme-transition p-0 overflow-hidden rounded-lg",
            "w-auto max-w-[min(600px,90vw)] max-h-[80vh]",
          )}
        >
          {selectedItem && (
            <motion.div
              className="flex flex-col h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 border-b">
                <div>
                  <DialogTitle className="theme-text-transition text-base">{selectedItem.title}</DialogTitle>
                  <DialogDescription className="theme-text-transition text-xs">
                    {selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}
                  </DialogDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full mt-2 sm:mt-0" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <div className="overflow-auto flex-1 max-h-[calc(80vh-8rem)]">
                <motion.div
                  className="relative flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    ref={imgRef}
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.title}
                    className="max-w-full max-h-[50vh] object-contain"
                    onLoad={handleImageLoad}
                  />
                </motion.div>

                <motion.div
                  className="p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <p className="text-sm text-muted-foreground theme-text-transition">
                    {selectedItem.description || "No description available."}
                  </p>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-4">
                    {selectedItem.liveUrl && (
                      <Button asChild variant="default" size="sm">
                        <a href={selectedItem.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Live
                        </a>
                      </Button>
                    )}
                    {selectedItem.repoUrl && (
                      <Button asChild variant="outline" size="sm">
                        <a href={selectedItem.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          View Repository
                        </a>
                      </Button>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}