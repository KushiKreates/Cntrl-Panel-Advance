/**
 * Loader components
 * Copyright (c) 2025-present, Nadhi.dev
 */

"use client"

import { cn } from "@/lib/utils"

interface LoadingProps {
  variant?: "spinner" | "dots" | "pulse" | "bars" | "skeleton" | "orbit" | "wave" | "grid"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  text?: string
}

export function Loading({ variant = "spinner", size = "md", className, text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  }

  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return (
          <div
            className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-primary", sizeClasses[size])}
          />
        )

      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-primary animate-bounce",
                  size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-5 h-5",
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )

      case "pulse":
        return <div className={cn("rounded-full bg-primary animate-pulse", sizeClasses[size])} />

      case "bars":
        return (
          <div className="flex items-end space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-primary animate-pulse",
                  size === "sm" ? "w-1 h-4" : size === "md" ? "w-1.5 h-6" : size === "lg" ? "w-2 h-8" : "w-3 h-10",
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.8s",
                }}
              />
            ))}
          </div>
        )

      case "skeleton":
        return (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded-full w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded-full w-5/6"></div>
          </div>
        )

      case "orbit":
        return (
          <div className={cn("relative", sizeClasses[size])}>
            <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <div
              className="absolute inset-2 rounded-full border-2 border-primary/50 border-b-transparent animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
            ></div>
          </div>
        )

      case "wave":
        return (
          <div className="flex items-center space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-primary rounded-full animate-bounce",
                  size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-5 h-5",
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1.4s",
                }}
              />
            ))}
          </div>
        )

      case "grid":
        return (
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "bg-primary rounded animate-pulse",
                  size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-5 h-5",
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1.2s",
                }}
              />
            ))}
          </div>
        )

      default:
        return (
          <div
            className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-primary", sizeClasses[size])}
          />
        )
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {renderLoader()}
      {text && <p className={cn("text-muted-foreground font-medium animate-pulse", textSizes[size])}>{text}</p>}
    </div>
  )
}

// Specialized loading components for specific use cases
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
        <Loading variant="orbit" size="lg" text={text} />
      </div>
    </div>
  )
}

export function ButtonLoader({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  return <Loading variant="spinner" size={size} className="text-current" />
}

export function CardLoader() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-300 h-12 w-12"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  )
}

export function TableLoader({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header */}
      <div className="flex space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-gray-300 rounded flex-1"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="h-3 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  )
}

