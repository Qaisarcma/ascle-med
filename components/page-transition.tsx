"use client"

import { useEffect, useState } from "react"
import { Heart, Smile, Star, Sun, Moon, Sparkles } from "lucide-react"

interface PageTransitionProps {
  isVisible: boolean
  onComplete: () => void
}

const supportQuotes = [
  {
    text: "Every small step forward is progress worth celebrating 🌟",
    icon: Star,
    gradient: "from-purple-400 to-pink-400",
  },
  {
    text: "You are stronger than you know, braver than you feel 💪",
    icon: Heart,
    gradient: "from-pink-400 to-red-400",
  },
  {
    text: "Healing is not linear, and that's perfectly okay 🌱",
    icon: Sun,
    gradient: "from-green-400 to-blue-400",
  },
  {
    text: "Your feelings are valid, and you deserve support 🤗",
    icon: Smile,
    gradient: "from-blue-400 to-purple-400",
  },
  {
    text: "Tomorrow is a new day full of possibilities ✨",
    icon: Moon,
    gradient: "from-indigo-400 to-purple-400",
  },
  {
    text: "You matter, your story matters, your healing matters 💙",
    icon: Sparkles,
    gradient: "from-teal-400 to-blue-400",
  },
]

export function PageTransition({ isVisible, onComplete }: PageTransitionProps) {
  const [currentQuote, setCurrentQuote] = useState(supportQuotes[0])
  const [fadeClass, setFadeClass] = useState("")

  useEffect(() => {
    if (isVisible) {
      // Select random quote
      const randomQuote = supportQuotes[Math.floor(Math.random() * supportQuotes.length)]
      setCurrentQuote(randomQuote)
      setFadeClass("animate-fade-in")

      // Complete transition after animation
      const timer = setTimeout(() => {
        setFadeClass("animate-fade-out")
        setTimeout(onComplete, 500)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  const IconComponent = currentQuote.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentQuote.gradient} opacity-95`} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center px-8 ${fadeClass}`}>
        <div className="mb-6">
          <IconComponent className="w-16 h-16 text-white mx-auto animate-pulse" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 max-w-2xl">{currentQuote.text}</h2>
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-out {
          animation: fade-out 0.5s ease-in forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
