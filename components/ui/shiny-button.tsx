"use client"

import React from "react"
import { motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

const animationProps: MotionProps = {
  whileTap: { scale: 0.98 },
}

interface ShinyButtonProps
  extends
  Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
  MotionProps {
  children: React.ReactNode
  className?: string
}

export const ShinyButton = React.forwardRef<
  HTMLDivElement,
  ShinyButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-lg border px-6 py-2 font-medium backdrop-blur-xl transition-all duration-300 ease-in-out hover:shadow-md",
        "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
        className
      )}
      {...animationProps}
      {...props}
    >
      <span
        className="relative z-20 block size-full text-sm tracking-wide text-zinc-800 dark:text-zinc-100 transition-colors duration-300"
      >
        {children}
      </span>

      {/* Shimmer Beam Effect */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        initial={{ x: "-150%" }}
        animate={{ x: "300%" }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.5
        }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
          transform: "skewX(-25deg)",
        }}
      />
    </motion.div>
  )
})

ShinyButton.displayName = "ShinyButton"
