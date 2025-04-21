"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Send } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { SocialIcons } from "@/components/social-icons"
import { AnimatedProfilePhoto } from "@/components/animated-profile-photo"
import { EasterEgg } from "@/components/easter-egg"

export function AnimatedHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      className="grid gap-12 md:grid-cols-2 md:gap-16 items-center min-h-[calc(100vh-8rem)] px-4 sm:px-6 md:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex flex-col justify-center space-y-10" variants={itemVariants}>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 theme-text-transition leading-tight">
              Rasendriya Khansa 
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight theme-text-transition">
              Jolankarfyan
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-6"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base sm:text-lg md:text-xl text-muted-foreground theme-text-transition">
            <span className="whitespace-nowrap">Student College</span>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <span className="text-primary whitespace-nowrap">Project Management Enthusiast</span>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <span className="text-primary font-medium whitespace-nowrap">Design & Programming Enthusiast</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
          >
            <Link href="#portfolio">
              See My Stuff ! <Send className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <motion.div
            className="flex items-center justify-center sm:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <SocialIcons iconSize={22} className="gap-6" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
      >
        <EasterEgg>
          <div className="animate-float relative flex items-center justify-center">
            <motion.div
              className="absolute -inset-4 sm:-inset-8 rounded-full blur-3xl bg-primary/20 z-0"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <AnimatedProfilePhoto
              src="/me.jpg"
              alt="Rasendriya Khansa Jolankarfyan"
              className="h-48 w-48 sm:h-64 sm:w-64 md:h-[350px] md:w-[350px] lg:h-[400px] lg:w-[400px] z-10 relative object-cover rounded-full border-4 border-primary/30"
            />
          </div>
        </EasterEgg>
      </motion.div>
    </motion.div>
  )
}