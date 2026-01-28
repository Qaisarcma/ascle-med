"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Send, Bot, User, Heart, Brain, Smile, Frown, Meh, AlertTriangle, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  emotion?: string
}

interface EmotionData {
  emotion: string
  timestamp: string
  message: string
  response: string
}

interface EmotionAnalysis {
  dominantEmotion: string
  emotionBreakdown: { emotion: string; count: number; percentage: number; color: string }[]
  insights: string[]
  recommendations: string[]
  totalMessages: number
  riskLevel: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI mental health companion. I'm here to listen, provide support, and offer personalized recommendations based on how you're feeling. How are you doing today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [conversationAnalysis, setConversationAnalysis] = useState<EmotionAnalysis | null>(null)
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const emotionIcons = {
    sad: <Frown className="w-4 h-4 text-blue-500" />,
    anxious: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    angry: <AlertTriangle className="w-4 h-4 text-red-500" />,
    happy: <Smile className="w-4 h-4 text-green-500" />,
    love: <Heart className="w-4 h-4 text-pink-500" />,
    contentment: <Smile className="w-4 h-4 text-blue-400" />,
    pride: <Smile className="w-4 h-4 text-purple-500" />,
    gratitude: <Heart className="w-4 h-4 text-orange-500" />,
    hope: <Smile className="w-4 h-4 text-cyan-500" />,
    blissful: <Heart className="w-4 h-4 text-yellow-400" />,
    awe: <Brain className="w-4 h-4 text-indigo-500" />,
    regretful: <Frown className="w-4 h-4 text-gray-500" />,
    melancholic: <Frown className="w-4 h-4 text-slate-500" />,
    unhappy: <Frown className="w-4 h-4 text-red-400" />,
    dangerous: <AlertTriangle className="w-4 h-4 text-red-600" />,
    neutral: <Meh className="w-4 h-4 text-gray-500" />,
  }

  const detectEmotion = (text: string): string => {
    const dangerousKeywords = [
      "kill",
      "suicide",
      "suicidal",
      "fatal",
      "deadly",
      "murder",
      "accident",
      "harm myself",
      "end it all",
      "can't go on",
      "want to die",
      "better off dead",
    ]
    const sadKeywords = [
      "sad",
      "depressed",
      "down",
      "upset",
      "crying",
      "tears",
      "hurt",
      "pain",
      "lonely",
      "miserable",
      "awful",
      "terrible",
      "hopeless",
      "worthless",
      "empty",
      "broken",
      "devastated",
      "heartbroken",
    ]
    const anxiousKeywords = [
      "anxious",
      "worried",
      "nervous",
      "scared",
      "afraid",
      "panic",
      "stress",
      "stressed",
      "overwhelmed",
      "tense",
      "fearful",
      "terrified",
      "paranoid",
      "restless",
    ]
    const angryKeywords = [
      "angry",
      "mad",
      "furious",
      "frustrated",
      "annoyed",
      "irritated",
      "rage",
      "hate",
      "disgusted",
      "outraged",
      "livid",
      "enraged",
      "bitter",
      "resentful",
    ]
    const regretfulKeywords = [
      "regret",
      "regretful",
      "sorry",
      "ashamed",
      "guilty",
      "disappointed",
      "remorseful",
      "embarrassed",
      "humiliated",
    ]
    const melancholicKeywords = [
      "melancholic",
      "sorrowful",
      "gloomy",
      "despondent",
      "dejected",
      "forlorn",
      "mournful",
      "wistful",
      "pensive",
    ]
    const unhappyKeywords = [
      "unhappy",
      "dissatisfied",
      "displeased",
      "troubled",
      "disturbed",
      "unsettled",
      "uncomfortable",
    ]
    const happyKeywords = [
      "happy",
      "joy",
      "joyful",
      "excited",
      "great",
      "amazing",
      "wonderful",
      "fantastic",
      "good",
      "better",
      "excellent",
      "awesome",
      "brilliant",
      "cheerful",
      "delighted",
      "elated",
      "euphoric",
      "ecstatic",
    ]
    const loveKeywords = [
      "love",
      "loving",
      "adore",
      "cherish",
      "treasure",
      "affection",
      "devoted",
      "passionate",
      "romantic",
      "caring",
    ]
    const contentmentKeywords = [
      "content",
      "contentment",
      "satisfied",
      "peaceful",
      "serene",
      "calm",
      "tranquil",
      "relaxed",
      "comfortable",
      "at ease",
    ]
    const prideKeywords = [
      "proud",
      "pride",
      "accomplished",
      "achieved",
      "successful",
      "confident",
      "self-assured",
      "triumphant",
    ]
    const gratitudeKeywords = ["grateful", "gratitude", "thankful", "blessed", "appreciative", "fortunate", "lucky"]
    const hopeKeywords = [
      "hope",
      "hopeful",
      "optimistic",
      "positive",
      "encouraged",
      "inspired",
      "motivated",
      "uplifted",
    ]
    const blissfulKeywords = ["blissful", "bliss", "heavenly", "divine", "perfect", "magical", "enchanted", "wonderful"]
    const aweKeywords = [
      "awe",
      "amazed",
      "astonished",
      "impressed",
      "stunned",
      "breathtaking",
      "incredible",
      "remarkable",
    ]

    const lowerText = text.toLowerCase()

    if (dangerousKeywords.some((keyword) => lowerText.includes(keyword))) return "dangerous"
    if (sadKeywords.some((keyword) => lowerText.includes(keyword))) return "sad"
    if (anxiousKeywords.some((keyword) => lowerText.includes(keyword))) return "anxious"
    if (angryKeywords.some((keyword) => lowerText.includes(keyword))) return "angry"
    if (regretfulKeywords.some((keyword) => lowerText.includes(keyword))) return "regretful"
    if (melancholicKeywords.some((keyword) => lowerText.includes(keyword))) return "melancholic"
    if (unhappyKeywords.some((keyword) => lowerText.includes(keyword))) return "unhappy"
    if (happyKeywords.some((keyword) => lowerText.includes(keyword))) return "happy"
    if (loveKeywords.some((keyword) => lowerText.includes(keyword))) return "love"
    if (contentmentKeywords.some((keyword) => lowerText.includes(keyword))) return "contentment"
    if (prideKeywords.some((keyword) => lowerText.includes(keyword))) return "pride"
    if (gratitudeKeywords.some((keyword) => lowerText.includes(keyword))) return "gratitude"
    if (hopeKeywords.some((keyword) => lowerText.includes(keyword))) return "hope"
    if (blissfulKeywords.some((keyword) => lowerText.includes(keyword))) return "blissful"
    if (aweKeywords.some((keyword) => lowerText.includes(keyword))) return "awe"

    return "neutral"
  }

  const analyzeConversation = (): EmotionAnalysis => {
    const userMessages = messages.filter((m) => m.role === "user")
    const emotions = userMessages.map((m) => m.emotion || "neutral")

    const emotionCounts = emotions.reduce(
      (acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const total = emotions.length
    const emotionBreakdown = Object.entries(emotionCounts).map(([emotion, count]) => ({
      emotion,
      count,
      percentage: Math.round((count / total) * 100),
      color:
        {
          sad: "#3b82f6",
          anxious: "#eab308",
          angry: "#ef4444",
          happy: "#22c55e",
          love: "#ec4899",
          contentment: "#60a5fa",
          pride: "#a855f7",
          gratitude: "#f97316",
          hope: "#06b6d4",
          blissful: "#fbbf24",
          awe: "#6366f1",
          regretful: "#6b7280",
          melancholic: "#64748b",
          unhappy: "#f87171",
          dangerous: "#dc2626",
          neutral: "#6b7280",
        }[emotion] || "#6b7280",
    }))

    const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) =>
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b,
    )[0]

    const negativeEmotions = ["sad", "anxious", "angry", "regretful", "melancholic", "unhappy", "dangerous"]
    const negativeCount = emotions.filter((e) => negativeEmotions.includes(e)).length
    const riskLevel = emotions.includes("dangerous")
      ? "Critical"
      : negativeCount / total > 0.7
        ? "High"
        : negativeCount / total > 0.4
          ? "Medium"
          : "Low"

    const insights = [
      `Your dominant emotion during this conversation was ${dominantEmotion}`,
      `You expressed ${emotions.length} different emotional states`,
      `Risk assessment: ${riskLevel} based on emotional patterns`,
      emotions.includes("dangerous")
        ? "⚠️ Crisis indicators detected - immediate support recommended"
        : negativeCount > total * 0.5
          ? "Predominantly negative emotions - consider professional support"
          : "Balanced emotional expression observed",
    ]

    const recommendations = {
      dangerous: [
        "🚨 IMMEDIATE: Call 988 (Suicide Prevention Lifeline)",
        "🚨 IMMEDIATE: Go to nearest emergency room",
        "🚨 IMMEDIATE: Call 911 if in immediate danger",
        "Contact a trusted friend or family member immediately",
      ],
      sad: [
        "Consider scheduling regular therapy sessions",
        "Practice daily self-care and gentle activities",
        "Connect with supportive friends and family",
        "Explore antidepressant options with a doctor if needed",
      ],
      anxious: [
        "Learn and practice anxiety management techniques",
        "Consider cognitive behavioral therapy (CBT)",
        "Maintain regular exercise and sleep routines",
        "Explore mindfulness and meditation practices",
      ],
      angry: [
        "Practice healthy anger expression techniques",
        "Consider anger management counseling",
        "Engage in regular physical exercise",
        "Work on communication and boundary-setting skills",
      ],
      happy: [
        "Continue activities that bring you joy",
        "Share your positive energy with others",
        "Set new goals while feeling motivated",
        "Practice gratitude to maintain positive outlook",
      ],
      love: [
        "Nurture your loving relationships",
        "Express appreciation to those you care about",
        "Practice self-love and self-compassion",
        "Consider ways to spread love in your community",
      ],
      neutral: [
        "Explore new activities that might bring fulfillment",
        "Practice emotional awareness and mindfulness",
        "Consider what changes might improve well-being",
        "Maintain healthy routines for overall wellness",
      ],
    }[dominantEmotion] || [
      "Continue monitoring your emotional well-being",
      "Maintain healthy lifestyle habits",
      "Stay connected with supportive people",
      "Consider professional support if needed",
    ]

    return {
      dominantEmotion,
      emotionBreakdown,
      insights,
      recommendations,
      totalMessages: userMessages.length,
      riskLevel,
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const emotion = detectEmotion(input)
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      emotion,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") break

            try {
              const parsed = JSON.parse(data)
              if (parsed.type === "emotion" && parsed.data) {
                setEmotionHistory((prev) => [...prev, parsed.data])
              } else if (parsed.content) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id ? { ...msg, content: msg.content + parsed.content } : msg,
                  ),
                )
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const closeConversation = () => {
    const analysis = analyzeConversation()
    setConversationAnalysis(analysis)

    // Store analysis data in localStorage for dashboard with proper structure
    const dashboardData = {
      analysis,
      emotionHistory,
      timestamp: new Date().toISOString(),
      // Add processed emotion trend data for graphs
      emotionTrendData: emotionHistory.map((item, index) => ({
        date: new Date(item.timestamp).toLocaleDateString("en", { weekday: "short" }),
        timestamp: item.timestamp,
        emotion: item.emotion,
        message: item.message,
        response: item.response,
      })),
    }

    localStorage.setItem("chatbotAnalysis", JSON.stringify(dashboardData))
    setShowAnalysis(true)
  }

  const goToDashboard = () => {
    window.location.href = "/dashboard"
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Mental Health Companion</h1>
                <p className="text-gray-600">Get personalized support and emotion-specific recommendations</p>
              </div>
            </div>
            <Button onClick={closeConversation} variant="outline" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Close Conversation
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Chat Session
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area - Fixed height with proper scrolling */}
            <div className="h-[500px] flex flex-col">
              <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
                <div className="space-y-4 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user" ? "bg-blue-600" : "bg-green-600"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>

                        <div
                          className={`rounded-lg p-4 ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">{message.content}</div>
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.emotion && message.role === "user" && (
                              <Badge variant="secondary" className="ml-2 flex items-center gap-1">
                                {emotionIcons[message.emotion as keyof typeof emotionIcons]}
                                <span className="capitalize">{message.emotion}</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area - Fixed at bottom */}
              <div className="border-t bg-white p-4">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Share how you're feeling..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={isLoading || !input.trim()} className="px-4">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Modal */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Conversation Emotion Analysis
            </DialogTitle>
          </DialogHeader>

          {conversationAnalysis && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{conversationAnalysis.totalMessages}</div>
                  <div className="text-sm text-blue-700">Messages</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 capitalize">
                    {conversationAnalysis.dominantEmotion}
                  </div>
                  <div className="text-sm text-purple-700">Dominant Emotion</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div
                    className={`text-2xl font-bold ${
                      conversationAnalysis.riskLevel === "Critical"
                        ? "text-red-600"
                        : conversationAnalysis.riskLevel === "High"
                          ? "text-red-500"
                          : conversationAnalysis.riskLevel === "Medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                    }`}
                  >
                    {conversationAnalysis.riskLevel}
                  </div>
                  <div className="text-sm text-orange-700">Risk Level</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{conversationAnalysis.recommendations.length}</div>
                  <div className="text-sm text-green-700">Recommendations</div>
                </div>
              </div>

              {/* Emotion Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Emotion Breakdown</h3>
                <div className="space-y-3">
                  {conversationAnalysis.emotionBreakdown.map((item) => (
                    <div key={item.emotion} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-24">
                        {emotionIcons[item.emotion as keyof typeof emotionIcons]}
                        <span className="text-sm capitalize">{item.emotion}</span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-16">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Insights</h3>
                <ul className="space-y-2">
                  {conversationAnalysis.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Personalized Recommendations</h3>
                <ul className="space-y-2">
                  {conversationAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          rec.includes("🚨") ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowAnalysis(false)}>
                  Close
                </Button>
                <Button onClick={goToDashboard} className="bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
