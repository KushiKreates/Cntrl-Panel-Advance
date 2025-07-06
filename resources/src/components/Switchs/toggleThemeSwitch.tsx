"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToggleThemeSwitchProps {
  variant?: "default" | "icon-only" | "premium"
  className?: string
}

export function ToggleThemeSwitch({ variant = "default", className }: ToggleThemeSwitchProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Get initial theme preference from localStorage
    const darkModePreference = localStorage.getItem("dark-mode") === "true"
    setIsDarkMode(darkModePreference)

    // Apply theme based on preference
    if (darkModePreference) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem("dark-mode", newDarkMode.toString())

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Premium variant with enhanced styling
  if (variant === "premium") {
    return (
      <div
        className={cn("relative group", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {/* Background glow effect */}
          <div
            className={cn(
              "absolute inset-0 rounded-full blur-md transition-all duration-500",
              isDarkMode
                ? "bg-gradient-to-r from-purple-500/20 to-blue-600/20"
                : "bg-gradient-to-r from-amber-500/20 to-orange-600/20",
              isHovered ? "scale-110 opacity-100" : "scale-100 opacity-0",
            )}
          />

          {/* Main switch container */}
          <div
            className={cn(
              "relative flex items-center justify-between w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 border",
              isDarkMode
                ? "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 shadow-lg shadow-purple-500/10"
                : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg shadow-amber-500/10",
              isHovered && "scale-105",
            )}
            onClick={toggleTheme}
          >
            {/* Background icons */}
            <Sun
              className={cn(
                "h-3 w-3 absolute left-2 transition-all duration-300",
                isDarkMode ? "text-slate-600 opacity-50" : "text-amber-500 opacity-100",
              )}
            />
            <Moon
              className={cn(
                "h-3 w-3 absolute right-2 transition-all duration-300",
                isDarkMode ? "text-purple-400 opacity-100" : "text-slate-400 opacity-50",
              )}
            />

            {/* Animated thumb */}
            <div
              className={cn(
                "relative w-6 h-6 rounded-full transition-all duration-300 ease-out flex items-center justify-center shadow-lg",
                isDarkMode
                  ? "translate-x-8 bg-gradient-to-br from-purple-500 to-blue-600 shadow-purple-500/30"
                  : "translate-x-0 bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30",
                isHovered && "shadow-xl",
              )}
            >
              {/* Thumb icon */}
              {isDarkMode ? (
                <Moon className="h-3 w-3 text-white drop-shadow-sm" />
              ) : (
                <Sun className="h-3 w-3 text-white drop-shadow-sm" />
              )}

              {/* Sparkle effect */}
              <Sparkles
                className={cn(
                  "absolute h-2 w-2 text-white/60 transition-all duration-300",
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50",
                  isDarkMode ? "-top-1 -right-1" : "-top-1 -left-1",
                )}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Enhanced icon-only variant
  if (variant === "icon-only") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn(
          "h-9 w-9 rounded-full transition-all duration-300 relative group overflow-hidden",
          "hover:scale-105 active:scale-95",
          isDarkMode
            ? "hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20"
            : "hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20",
          className,
        )}
        aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
      >
        {/* Background gradient */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100",
            isDarkMode
              ? "bg-gradient-to-br from-purple-500/5 to-blue-500/5"
              : "bg-gradient-to-br from-amber-500/5 to-orange-500/5",
          )}
        />

        {/* Icon with rotation animation */}
        <div className="relative transition-transform duration-300 group-hover:rotate-12">
          {isDarkMode ? <Moon className="h-4 w-4 text-purple-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
        </div>

        {/* Subtle sparkle */}
        <Sparkles
          className={cn(
            "absolute top-1 right-1 h-2 w-2 transition-all duration-300",
            "opacity-0 group-hover:opacity-60 scale-50 group-hover:scale-100",
            isDarkMode ? "text-purple-300" : "text-amber-400",
          )}
        />
      </Button>
    )
  }

  // Enhanced default variant
  return (
    <div className={cn("flex items-center space-x-4 group", className)}>
      <div className="relative">
        {/* Custom enhanced switch */}
        <div
          className={cn(
            "relative flex items-center w-12 h-6 rounded-full p-0.5 cursor-pointer transition-all duration-300 border",
            isDarkMode
              ? "bg-gradient-to-r from-slate-700 to-slate-800 border-slate-600"
              : "bg-gradient-to-r from-gray-200 to-gray-300 border-gray-300",
            "hover:scale-105 active:scale-95",
          )}
          onClick={toggleTheme}
        >
          {/* Switch thumb with icon */}
          <div
            className={cn(
              "w-5 h-5 rounded-full transition-all duration-300 ease-out flex items-center justify-center shadow-md",
              isDarkMode
                ? "translate-x-6 bg-gradient-to-br from-purple-500 to-blue-600"
                : "translate-x-0 bg-gradient-to-br from-amber-400 to-orange-500",
            )}
          >
            {isDarkMode ? <Moon className="h-2.5 w-2.5 text-white" /> : <Sun className="h-2.5 w-2.5 text-white" />}
          </div>
        </div>
      </div>

      {/* Enhanced status icon */}
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
          isDarkMode ? "bg-purple-500/10 text-purple-400" : "bg-amber-500/10 text-amber-500",
          "group-hover:scale-110",
        )}
      >
        {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </div>
    </div>
  )
}

export default ToggleThemeSwitch
