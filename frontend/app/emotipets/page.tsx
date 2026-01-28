"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Smile,
  Frown,
  Meh,
  ArrowLeft,
  Gamepad2,
  Droplets,
  Wind,
  Sparkles,
  Coffee,
  Moon,
  Sun,
  Star,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { AnimatedDog } from "@/components/animated-dog"

interface Pet {
  name: string
  happiness: number
  energy: number
  health: number
  hunger: number
  mood: "happy" | "sad" | "neutral" | "excited" | "sleepy"
  lastFed: Date
  lastPlayed: Date
}

interface GameState {
  currentGame: "none" | "color-guess" | "memory-match" | "care-tasks"
  score: number
  level: number
}

export default function EmotiPetsPage() {
  const [userMood, setUserMood] = useState("")
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "pet"; message: string; timestamp: Date }>>(
    [],
  )
  const [currentInput, setCurrentInput] = useState("")
  const [gameState, setGameState] = useState<GameState>({ currentGame: "none", score: 0, level: 1 })
  const [showMoodCheck, setShowMoodCheck] = useState(true)
  const [pet, setPet] = useState<Pet>({
    name: "Buddy",
    happiness: 75,
    energy: 60,
    health: 90,
    hunger: 40,
    mood: "happy",
    lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastPlayed: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  })

  // Color guessing game state
  const [colorGame, setColorGame] = useState({
    targetColor: "",
    options: [] as string[],
    attempts: 0,
    maxAttempts: 3,
  })

  // Memory match game state
  const [memoryGame, setMemoryGame] = useState({
    cards: [] as Array<{ id: number; emoji: string; flipped: boolean; matched: boolean }>,
    flippedCards: [] as number[],
    matches: 0,
    moves: 0,
  })

  const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Cyan"]
  const memoryEmojis = ["🌟", "🌈", "🦋", "🌸", "🍀", "🌙", "☀️", "💎"]

  useEffect(() => {
    // Initialize with welcome message
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          sender: "pet",
          message:
            "Hello! I'm Buddy, your emotional support companion. I'm here to listen and help you feel better. 🐾",
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  const detectUserEmotion = (input: string): string => {
    const sadKeywords = ["sad", "depressed", "down", "upset", "crying", "lonely", "hopeless", "terrible", "awful"]
    const anxiousKeywords = ["anxious", "worried", "nervous", "scared", "panic", "stress", "overwhelmed", "afraid"]
    const angryKeywords = ["angry", "mad", "frustrated", "annoyed", "irritated", "furious"]
    const happyKeywords = ["happy", "good", "great", "amazing", "wonderful", "excited", "joyful", "fantastic"]
    const tiredKeywords = ["tired", "exhausted", "sleepy", "drained", "weary"]

    const lowerInput = input.toLowerCase()

    if (sadKeywords.some((keyword) => lowerInput.includes(keyword))) return "sad"
    if (anxiousKeywords.some((keyword) => lowerInput.includes(keyword))) return "anxious"
    if (angryKeywords.some((keyword) => lowerInput.includes(keyword))) return "angry"
    if (happyKeywords.some((keyword) => lowerInput.includes(keyword))) return "happy"
    if (tiredKeywords.some((keyword) => lowerInput.includes(keyword))) return "tired"
    return "neutral"
  }

  const generatePetResponse = (emotion: string, userMessage: string): string => {
    const responses = {
      sad: [
        "I can feel that you're going through a tough time. *nuzzles gently* You're not alone, I'm here with you. 💙",
        "It's okay to feel sad sometimes. *sits close to you* Would you like to try some deep breathing together? 🌸",
        "I see you're hurting. *offers a warm paw* Let's do something gentle together to help you feel a little better. 🤗",
        "Your feelings are valid, and I care about you. *gentle purr* How about we play a calming game or I can remind you of something beautiful? 🌙",
      ],
      anxious: [
        "I notice you're feeling anxious. *breathes slowly with you* Let's take this one moment at a time. 🌊",
        "Anxiety can feel overwhelming, but you're safe here with me. *calm presence* Would you like to try the 5-4-3-2-1 grounding technique? 🌿",
        "I'm here to help you feel more grounded. *steady breathing* Let's focus on something peaceful together. ☁️",
        "You're doing great by reaching out. *supportive nuzzle* Would you like me to guide you through some calming activities? 🕊️",
      ],
      angry: [
        "I can sense your frustration. *patient presence* It's okay to feel angry - let's find a healthy way to express it. 🔥➡️💨",
        "Your anger is telling you something important. *understanding look* Would you like to talk about it or do something physical to release the energy? 💪",
        "I'm here to listen without judgment. *calm energy* Sometimes anger needs space to be felt before it can transform. 🌋➡️🌱",
        "It's brave of you to acknowledge your anger. *supportive stance* Let's channel this energy into something that helps you feel better. ⚡",
      ],
      happy: [
        "Your happiness is contagious! *excited tail wag* I love seeing you feel good. Let's celebrate this moment! 🎉",
        "What wonderful energy you have! *playful bounce* Your joy makes my day brighter too. Want to play something fun? ✨",
        "I'm so happy that you're happy! *cheerful dance* This is the perfect time to do something you love. 🌟",
        "Your positive vibes are amazing! *joyful spin* Let's make this good feeling last even longer. 🌈",
      ],
      tired: [
        "You sound exhausted. *gentle yawn* Rest is so important. Would you like me to help you relax? 😴",
        "Being tired is your body's way of asking for care. *cozy curl up* Let's do something restful together. 🌙",
        "I can feel your weariness. *soft presence* How about we do some gentle stretching or just breathe quietly? 💤",
        "Rest is not a luxury, it's necessary. *warm companionship* I'll stay here while you recharge. 🛌",
      ],
      neutral: [
        "I'm glad you're here with me. *friendly presence* How are you feeling in this moment? 🤔",
        "Sometimes neutral is exactly where we need to be. *peaceful sitting* What would feel good for you right now? 🌸",
        "I'm here to listen and support you, whatever you're feeling. *attentive ears* What's on your mind? 👂",
        "Every feeling is welcome here. *open heart* I'm curious about your inner world today. 💭",
      ],
    }

    const emotionResponses = responses[emotion as keyof typeof responses] || responses.neutral
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
  }

  const handleMoodSubmit = () => {
    if (!userMood.trim()) return

    const emotion = detectUserEmotion(userMood)
    const petResponse = generatePetResponse(emotion, userMood)

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", message: userMood, timestamp: new Date() },
      { sender: "pet", message: petResponse, timestamp: new Date() },
    ])

    // Update pet mood based on user emotion
    let newMood: "happy" | "sad" | "neutral" | "excited" | "sleepy" = pet.mood
    if (emotion === "happy") {
      newMood = "excited"
    } else if (emotion === "sad") {
      newMood = "sad"
    } else if (emotion === "tired") {
      newMood = "sleepy"
    } else {
      newMood = "happy"
    }

    setPet((prev) => ({
      ...prev,
      mood: newMood,
      happiness: emotion === "happy" ? Math.min(100, prev.happiness + 10) : Math.max(0, prev.happiness - 5),
    }))

    setUserMood("")
    setShowMoodCheck(false)

    // Suggest activities based on emotion
    setTimeout(() => {
      let suggestion = ""
      switch (emotion) {
        case "sad":
          suggestion =
            "Would you like to try some gentle breathing exercises, or shall we play a calming color game? 🎨"
          break
        case "anxious":
          suggestion =
            "Let's try some grounding activities. I can remind you to drink water, or we could play a memory game to focus your mind. 🧠"
          break
        case "angry":
          suggestion =
            "How about we do some energetic activities? We could play a quick game or I could guide you through some movement. 🏃‍♀️"
          break
        case "happy":
          suggestion = "This is wonderful! Let's keep this energy going. Want to play a fun game or take care of me? 🎮"
          break
        case "tired":
          suggestion =
            "Rest is important. Would you like me to guide you through some relaxation, or shall we do something very gentle? 😌"
          break
        default:
          suggestion =
            "What would feel good for you right now? We could play a game, do some self-care, or just chat. 💬"
      }

      setChatMessages((prev) => [...prev, { sender: "pet", message: suggestion, timestamp: new Date() }])
    }, 2000)
  }

  const handleChatSubmit = () => {
    if (!currentInput.trim()) return

    const emotion = detectUserEmotion(currentInput)
    const petResponse = generatePetResponse(emotion, currentInput)

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", message: currentInput, timestamp: new Date() },
      { sender: "pet", message: petResponse, timestamp: new Date() },
    ])

    setCurrentInput("")

    // Update pet stats based on interaction
    let newMood: "happy" | "sad" | "neutral" | "excited" | "sleepy" = pet.mood
    if (emotion === "happy") {
      newMood = "excited"
    } else if (emotion === "sad") {
      newMood = "sad"
    } else if (emotion === "tired") {
      newMood = "sleepy"
    } else {
      newMood = "happy"
    }

    setPet((prev) => ({
      ...prev,
      mood: newMood,
      happiness: Math.min(100, prev.happiness + 5),
      energy: Math.max(0, prev.energy - 2),
    }))
  }

  const startColorGame = () => {
    const targetColor = colors[Math.floor(Math.random() * colors.length)]
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5).slice(0, 4)
    if (!shuffledColors.includes(targetColor)) {
      shuffledColors[0] = targetColor
    }
    shuffledColors.sort(() => Math.random() - 0.5)

    setColorGame({
      targetColor,
      options: shuffledColors,
      attempts: 0,
      maxAttempts: 3,
    })
    setGameState({ currentGame: "color-guess", score: gameState.score, level: gameState.level })

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "pet",
        message: `Let's play the color guessing game! 🎨 I'm thinking of the color: ${targetColor}. Can you pick the right one?`,
        timestamp: new Date(),
      },
    ])
  }

  const guessColor = (color: string) => {
    const isCorrect = color === colorGame.targetColor
    const newAttempts = colorGame.attempts + 1

    if (isCorrect) {
      setGameState((prev) => ({ ...prev, score: prev.score + 10, currentGame: "none" }))
      setPet((prev) => ({ ...prev, happiness: Math.min(100, prev.happiness + 15) }))
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "pet",
          message: `🎉 Excellent! You got it right! ${color} was the correct answer. You earned 10 points! I'm so proud of you! 🌟`,
          timestamp: new Date(),
        },
      ])
    } else if (newAttempts >= colorGame.maxAttempts) {
      setGameState((prev) => ({ ...prev, currentGame: "none" }))
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "pet",
          message: `Good try! The correct answer was ${colorGame.targetColor}. Don't worry, you did great! Want to try again? 💙`,
          timestamp: new Date(),
        },
      ])
    } else {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "pet",
          message: `Not quite, but you're doing great! You have ${colorGame.maxAttempts - newAttempts} more tries. Keep going! 💪`,
          timestamp: new Date(),
        },
      ])
    }

    setColorGame((prev) => ({ ...prev, attempts: newAttempts }))
  }

  const startMemoryGame = () => {
    const gameEmojis = memoryEmojis.slice(0, 4)
    const cards = [...gameEmojis, ...gameEmojis]
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }))
      .sort(() => Math.random() - 0.5)

    setMemoryGame({
      cards,
      flippedCards: [],
      matches: 0,
      moves: 0,
    })
    setGameState({ currentGame: "memory-match", score: gameState.score, level: gameState.level })

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "pet",
        message:
          "Let's play memory match! 🧠✨ Find the matching pairs by clicking on the cards. This will help focus your mind!",
        timestamp: new Date(),
      },
    ])
  }

  const flipCard = (cardId: number) => {
    if (memoryGame.flippedCards.length >= 2) return
    if (memoryGame.cards[cardId].flipped || memoryGame.cards[cardId].matched) return

    const newCards = [...memoryGame.cards]
    newCards[cardId].flipped = true
    const newFlippedCards = [...memoryGame.flippedCards, cardId]

    setMemoryGame((prev) => ({
      ...prev,
      cards: newCards,
      flippedCards: newFlippedCards,
      moves: prev.moves + 1,
    }))

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards
      if (newCards[first].emoji === newCards[second].emoji) {
        // Match found
        setTimeout(() => {
          newCards[first].matched = true
          newCards[second].matched = true
          const newMatches = memoryGame.matches + 1

          setMemoryGame((prev) => ({
            ...prev,
            cards: newCards,
            flippedCards: [],
            matches: newMatches,
          }))

          if (newMatches === 4) {
            // Game completed
            setGameState((prev) => ({ ...prev, score: prev.score + 20, currentGame: "none" }))
            setPet((prev) => ({ ...prev, happiness: Math.min(100, prev.happiness + 20) }))
            setChatMessages((prev) => [
              ...prev,
              {
                sender: "pet",
                message: `🎊 Amazing! You completed the memory game in ${memoryGame.moves + 1} moves! You earned 20 points! Your focus is incredible! 🧠💫`,
                timestamp: new Date(),
              },
            ])
          }
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          newCards[first].flipped = false
          newCards[second].flipped = false
          setMemoryGame((prev) => ({
            ...prev,
            cards: newCards,
            flippedCards: [],
          }))
        }, 1000)
      }
    }
  }

  const feedPet = () => {
    setPet((prev) => ({
      ...prev,
      hunger: Math.max(0, prev.hunger - 30),
      happiness: Math.min(100, prev.happiness + 10),
      energy: Math.min(100, prev.energy + 15),
      lastFed: new Date(),
    }))

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "pet",
        message:
          "Yum! Thank you for feeding me! 🍎 I feel so much better now. Taking care of me helps you practice self-care too! 💚",
        timestamp: new Date(),
      },
    ])
  }

  const groomPet = () => {
    setPet((prev) => ({
      ...prev,
      health: Math.min(100, prev.health + 10),
      happiness: Math.min(100, prev.happiness + 15),
    }))

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "pet",
        message:
          "Ahh, that feels wonderful! ✨ Grooming me is like practicing mindfulness - focusing on gentle, caring actions. Thank you! 🧘‍♀️",
        timestamp: new Date(),
      },
    ])
  }

  const playWithPet = () => {
    setPet((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      energy: Math.max(0, prev.energy - 10),
      lastPlayed: new Date(),
    }))

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "pet",
        message:
          "Wheee! That was so much fun! 🎾 Playing together releases happy chemicals in both our brains! Want to play more? 🎉",
        timestamp: new Date(),
      },
    ])
  }

  const giveSelfCareReminder = (type: "water" | "breathing" | "affirmation") => {
    const reminders = {
      water: {
        message:
          "💧 Gentle reminder: Have you had some water recently? Staying hydrated helps your body and mind feel better. Take a sip for me! 💙",
        action: "I'll wait here while you get some water! 🥤",
      },
      breathing: {
        message:
          "🌬️ Let's do some calming breaths together. Breathe in slowly for 4 counts... hold for 4... and breathe out for 6. Feel better? 😌",
        action: "Breathing with you makes me feel peaceful too! 🕊️",
      },
      affirmation: {
        message:
          "🌟 Here's a gentle reminder: You are worthy of love and care. You are doing your best, and that's enough. You matter. 💖",
        action: "Believing in yourself helps me believe in myself too! ✨",
      },
    }

    const reminder = reminders[type]
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "pet",
        message: reminder.message,
        timestamp: new Date(),
      },
      {
        sender: "pet",
        message: reminder.action,
        timestamp: new Date(),
      },
    ])

    setPet((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 5),
    }))
  }

  const getPetMoodIcon = () => {
    switch (pet.mood) {
      case "happy":
        return <Smile className="h-6 w-6 text-green-500" />
      case "excited":
        return <Star className="h-6 w-6 text-yellow-500" />
      case "sad":
        return <Frown className="h-6 w-6 text-blue-500" />
      case "sleepy":
        return <Moon className="h-6 w-6 text-purple-500" />
      default:
        return <Meh className="h-6 w-6 text-gray-500" />
    }
  }

  const getEncouragingMessage = () => {
    const messages = [
      "Remember, every small step counts! 🌱",
      "You're braver than you believe! 💪",
      "It's okay to have difficult days. Tomorrow is a new start! 🌅",
      "Your feelings are valid and important! 💙",
      "You deserve kindness, especially from yourself! 🤗",
      "Progress isn't always linear, and that's perfectly okay! 📈",
      "You're not alone in this journey! 🤝",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Gamepad2 className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">EmotiPets</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Score: {gameState.score}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pet Status */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getPetMoodIcon()}
                  Meet {pet.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <AnimatedDog
                    mood={pet.mood}
                    isInteracting={chatMessages.length > 0 && chatMessages[chatMessages.length - 1]?.sender === "user"}
                    message={
                      chatMessages.length > 0 && chatMessages[chatMessages.length - 1]?.sender === "pet"
                        ? chatMessages[chatMessages.length - 1].message.slice(0, 50) + "..."
                        : undefined
                    }
                  />
                  <p className="text-lg font-semibold capitalize mt-4">
                    {pet.name} is feeling {pet.mood}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Happiness</span>
                      <span>{pet.happiness}%</span>
                    </div>
                    <Progress value={pet.happiness} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Energy</span>
                      <span>{pet.energy}%</span>
                    </div>
                    <Progress value={pet.energy} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Health</span>
                      <span>{pet.health}%</span>
                    </div>
                    <Progress value={pet.health} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Hunger</span>
                      <span>{pet.hunger}%</span>
                    </div>
                    <Progress value={pet.hunger} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Care Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Care for {pet.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={feedPet} variant="outline" className="flex flex-col gap-2 h-16">
                    <Coffee className="h-5 w-5" />
                    <span className="text-xs">Feed</span>
                  </Button>
                  <Button onClick={groomPet} variant="outline" className="flex flex-col gap-2 h-16">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-xs">Groom</span>
                  </Button>
                  <Button onClick={playWithPet} variant="outline" className="flex flex-col gap-2 h-16">
                    <Gift className="h-5 w-5" />
                    <span className="text-xs">Play</span>
                  </Button>
                  <Button
                    onClick={() => giveSelfCareReminder("affirmation")}
                    variant="outline"
                    className="flex flex-col gap-2 h-16"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="text-xs">Cuddle</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Chat with {pet.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Initial Mood Check */}
                {showMoodCheck && (
                  <Card className="mb-4 border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 text-purple-800">How are you feeling today?</h3>
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="Tell me about your feelings..."
                          value={userMood}
                          onChange={(e) => setUserMood(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleMoodSubmit()}
                        />
                        <Button onClick={handleMoodSubmit}>Share</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["I'm feeling sad", "I'm anxious", "I'm happy", "I'm tired", "I'm okay"].map((mood) => (
                          <Button
                            key={mood}
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setUserMood(mood)
                              setTimeout(handleMoodSubmit, 100)
                            }}
                          >
                            {mood}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Game Interface */}
                {gameState.currentGame === "color-guess" && (
                  <Card className="mb-4 border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Color Guessing Game 🎨</h3>
                      <p className="mb-3">I'm thinking of: {colorGame.targetColor}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {colorGame.options.map((color) => (
                          <Button
                            key={color}
                            onClick={() => guessColor(color)}
                            variant="outline"
                            className="h-12"
                            style={{ backgroundColor: color.toLowerCase(), color: "white" }}
                          >
                            {color}
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm mt-2">
                        Attempts: {colorGame.attempts}/{colorGame.maxAttempts}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {gameState.currentGame === "memory-match" && (
                  <Card className="mb-4 border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Memory Match Game 🧠</h3>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {memoryGame.cards.map((card) => (
                          <Button
                            key={card.id}
                            onClick={() => flipCard(card.id)}
                            variant="outline"
                            className="h-12 text-lg"
                            disabled={card.matched}
                          >
                            {card.flipped || card.matched ? card.emoji : "?"}
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm">
                        Moves: {memoryGame.moves} | Matches: {memoryGame.matches}/4
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Talk to your pet..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                  />
                  <Button onClick={handleChatSubmit}>Send</Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Button onClick={startColorGame} variant="outline" className="flex flex-col gap-2 h-20">
                <Sun className="h-6 w-6" />
                <span className="text-sm">Color Game</span>
              </Button>
              <Button onClick={startMemoryGame} variant="outline" className="flex flex-col gap-2 h-20">
                <Star className="h-6 w-6" />
                <span className="text-sm">Memory Game</span>
              </Button>
              <Button
                onClick={() => giveSelfCareReminder("water")}
                variant="outline"
                className="flex flex-col gap-2 h-20"
              >
                <Droplets className="h-6 w-6" />
                <span className="text-sm">Water Reminder</span>
              </Button>
              <Button
                onClick={() => giveSelfCareReminder("breathing")}
                variant="outline"
                className="flex flex-col gap-2 h-20"
              >
                <Wind className="h-6 w-6" />
                <span className="text-sm">Breathing</span>
              </Button>
            </div>

            {/* Encouraging Message */}
            <Card className="mt-6 border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <p className="text-green-800 font-medium">{getEncouragingMessage()}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
