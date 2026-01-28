"use client"

import { useState, useEffect } from "react"

interface AnimatedDogProps {
  mood: "happy" | "sad" | "excited" | "sleepy" | "neutral"
  isInteracting: boolean
  message?: string
}

export function AnimatedDog({ mood, isInteracting, message }: AnimatedDogProps) {
  const [currentAnimation, setCurrentAnimation] = useState("idle")
  const [eyeState, setEyeState] = useState("open")
  const [tailWag, setTailWag] = useState(false)

  useEffect(() => {
    // Animation based on mood
    switch (mood) {
      case "happy":
        setCurrentAnimation("bounce")
        setTailWag(true)
        setEyeState("happy")
        break
      case "excited":
        setCurrentAnimation("jump")
        setTailWag(true)
        setEyeState("excited")
        break
      case "sad":
        setCurrentAnimation("droop")
        setTailWag(false)
        setEyeState("sad")
        break
      case "sleepy":
        setCurrentAnimation("sleepy")
        setTailWag(false)
        setEyeState("sleepy")
        break
      default:
        setCurrentAnimation("idle")
        setTailWag(false)
        setEyeState("open")
    }
  }, [mood])

  useEffect(() => {
    if (isInteracting) {
      setCurrentAnimation("attention")
      setTailWag(true)
      setTimeout(() => {
        setCurrentAnimation("idle")
        setTailWag(false)
      }, 2000)
    }
  }, [isInteracting])

  const getDogBody = () => {
    const baseClasses = "transition-all duration-500 ease-in-out"
    const animationClasses = {
      idle: "transform-none",
      bounce: "animate-bounce",
      jump: "animate-pulse",
      droop: "transform translate-y-2",
      sleepy: "transform scale-95 opacity-80",
      attention: "transform scale-105",
    }

    return `${baseClasses} ${animationClasses[currentAnimation as keyof typeof animationClasses]}`
  }

  const getEyes = () => {
    switch (eyeState) {
      case "happy":
        return "^  ^"
      case "excited":
        return "★  ★"
      case "sad":
        return "•  •"
      case "sleepy":
        return "-  -"
      default:
        return "●  ●"
    }
  }

  const getMouth = () => {
    switch (mood) {
      case "happy":
      case "excited":
        return "ᵕ"
      case "sad":
        return "︵"
      case "sleepy":
        return "o"
      default:
        return "‿"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Dog Container */}
      <div className={getDogBody()}>
        <div className="relative">
          {/* Dog Body */}
          <div className="w-32 h-24 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full relative shadow-lg">
            {/* Dog Head */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full relative shadow-md">
                {/* Ears */}
                <div className="absolute -top-2 left-2 w-6 h-8 bg-amber-300 rounded-full transform -rotate-12 shadow-sm"></div>
                <div className="absolute -top-2 right-2 w-6 h-8 bg-amber-300 rounded-full transform rotate-12 shadow-sm"></div>

                {/* Eyes */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                  <div className="text-lg font-bold text-gray-800 tracking-wider">{getEyes()}</div>
                </div>

                {/* Nose */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>

                {/* Mouth */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                  <div className="text-lg text-gray-800">{getMouth()}</div>
                </div>
              </div>
            </div>

            {/* Tail */}
            <div
              className={`absolute -right-4 top-4 w-8 h-3 bg-amber-300 rounded-full transform origin-left ${tailWag ? "animate-pulse" : ""}`}
            >
              <div
                className={`w-full h-full bg-amber-400 rounded-full transform ${tailWag ? "animate-bounce" : ""}`}
              ></div>
            </div>

            {/* Legs */}
            <div className="absolute -bottom-4 left-4 w-3 h-8 bg-amber-300 rounded-full"></div>
            <div className="absolute -bottom-4 left-10 w-3 h-8 bg-amber-300 rounded-full"></div>
            <div className="absolute -bottom-4 right-10 w-3 h-8 bg-amber-300 rounded-full"></div>
            <div className="absolute -bottom-4 right-4 w-3 h-8 bg-amber-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="mt-6 relative">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
            <p className="text-sm text-gray-700 text-center">{message}</p>
            {/* Speech bubble arrow */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-white border-l-2 border-t-2 border-gray-200 transform rotate-45"></div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            mood === "happy"
              ? "bg-green-500"
              : mood === "excited"
                ? "bg-yellow-500"
                : mood === "sad"
                  ? "bg-blue-500"
                  : mood === "sleepy"
                    ? "bg-purple-500"
                    : "bg-gray-400"
          }`}
        ></div>
        <span className="text-sm text-gray-600 capitalize">{mood}</span>
      </div>
    </div>
  )
}
