"use client"

import { useState, useEffect, useCallback } from "react"
import { useReducedMotion } from "framer-motion"

export function useOptimizedAnimations() {
  const prefersReducedMotion = useReducedMotion()
  const [isLowPowerMode, setIsLowPowerMode] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)

  // Detect low-end devices based on memory and CPU cores
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      // Check for device memory API
      const memory = (navigator as any).deviceMemory
      if (memory && memory < 4) {
        setIsLowEndDevice(true)
      }

      // Check for hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency
      if (cores && cores < 4) {
        setIsLowEndDevice(true)
      }

      // Check for battery API to detect low power mode
      if ("getBattery" in navigator) {
        ;(navigator as any).getBattery().then((battery: any) => {
          if (battery.level < 0.2 && !battery.charging) {
            setIsLowPowerMode(true)
          }

          // Listen for battery changes
          battery.addEventListener("levelchange", () => {
            setIsLowPowerMode(battery.level < 0.2 && !battery.charging)
          })

          battery.addEventListener("chargingchange", () => {
            setIsLowPowerMode(battery.level < 0.2 && !battery.charging)
          })
        })
      }
    }
  }, [])

  // Determine if we should use reduced animations
  const shouldReduceAnimations = prefersReducedMotion || isLowPowerMode || isLowEndDevice

  // Get appropriate animation duration based on device capabilities
  const getAnimationDuration = useCallback(
    (defaultDuration: number, minDuration = 0.1) => {
      if (prefersReducedMotion) return minDuration
      if (isLowEndDevice) return Math.max(defaultDuration * 0.5, minDuration)
      if (isLowPowerMode) return Math.max(defaultDuration * 0.7, minDuration)
      return defaultDuration
    },
    [prefersReducedMotion, isLowEndDevice, isLowPowerMode],
  )

  // Helper for staggered animations
  const getStaggerDelay = useCallback(
    (index: number, baseDelay = 0.05, maxDelay = 0.3) => {
      if (shouldReduceAnimations) return 0
      return Math.min(baseDelay * index, maxDelay)
    },
    [shouldReduceAnimations],
  )

  return {
    shouldReduceAnimations,
    getAnimationDuration,
    getStaggerDelay,
    isLowPowerMode,
    isLowEndDevice,
  }
}
