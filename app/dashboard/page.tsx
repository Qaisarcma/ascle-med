"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Heart,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Stethoscope,
  MessageSquare,
  BarChart3,
  User,
  UserPlus,
  Pill,
  ChevronDown,
  MapPin,
  Star,
  Video,
  FileText,
  Truck,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Search,
  Clock,
  Gamepad2,
  Settings,
  LogOut,
  Activity,
  Smile,
  Frown,
  Meh,
  Menu,
  Brain,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"

interface ChatbotAnalysisData {
  analysis: {
    dominantEmotion: string
    emotionBreakdown: { emotion: string; count: number; percentage: number; color: string }[]
    insights: string[]
    recommendations: string[]
    totalMessages: number
    riskLevel: string
  }
  emotionHistory: Array<{
    emotion: string
    timestamp: string
    message: string
    response: string
  }>
  emotionTrendData?: Array<{
    date: string
    timestamp: string
    emotion: string
    message: string
    response: string
  }>
  timestamp: string
}

interface EmotionTrendData {
  date: string
  timestamp: string
  sadness: number
  happiness: number
  anxiety: number
  anger: number
  calm: number
  stress: number
  overall: number
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [chatbotData, setChatbotData] = useState<ChatbotAnalysisData | null>(null)
  const [emotionFilter, setEmotionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("7d")
  const [medicineSearch, setMedicineSearch] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [showTransition, setShowTransition] = useState(false)
  const [pendingSection, setPendingSection] = useState("")

  useEffect(() => {
    // Load chatbot analysis data from localStorage
    const storedData = localStorage.getItem("chatbotAnalysis")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setChatbotData(parsedData)
        console.log("Loaded chatbot data:", parsedData) // Debug log
      } catch (error) {
        console.error("Error parsing chatbot data:", error)
      }
    }
  }, [])

  // Generate comprehensive emotion trend data from chatbot interactions
  const generateEmotionTrendData = (): EmotionTrendData[] => {
    if (!chatbotData?.emotionHistory || chatbotData.emotionHistory.length === 0) {
      // Default data for demonstration
      return [
        {
          date: "Mon",
          timestamp: "2024-01-15",
          sadness: 2,
          happiness: 8,
          anxiety: 3,
          anger: 1,
          calm: 7,
          stress: 3,
          overall: 7,
        },
        {
          date: "Tue",
          timestamp: "2024-01-16",
          sadness: 4,
          happiness: 6,
          anxiety: 5,
          anger: 2,
          calm: 5,
          stress: 5,
          overall: 6,
        },
        {
          date: "Wed",
          timestamp: "2024-01-17",
          sadness: 1,
          happiness: 9,
          anxiety: 2,
          anger: 1,
          calm: 8,
          stress: 2,
          overall: 8,
        },
        {
          date: "Thu",
          timestamp: "2024-01-18",
          sadness: 3,
          happiness: 7,
          anxiety: 4,
          anger: 2,
          calm: 6,
          stress: 4,
          overall: 7,
        },
        {
          date: "Fri",
          timestamp: "2024-01-19",
          sadness: 1,
          happiness: 9,
          anxiety: 2,
          anger: 1,
          calm: 8,
          stress: 2,
          overall: 8,
        },
        {
          date: "Sat",
          timestamp: "2024-01-20",
          sadness: 2,
          happiness: 8,
          anxiety: 3,
          anger: 1,
          calm: 7,
          stress: 3,
          overall: 8,
        },
        {
          date: "Sun",
          timestamp: "2024-01-21",
          sadness: 1,
          happiness: 9,
          anxiety: 2,
          anger: 1,
          calm: 8,
          stress: 2,
          overall: 9,
        },
      ]
    }

    // Convert chatbot emotions to numerical scores
    const emotionToScores = {
      dangerous: { sadness: 10, happiness: 0, anxiety: 10, anger: 8, calm: 0, stress: 10, overall: 1 },
      sad: { sadness: 8, happiness: 2, anxiety: 5, anger: 2, calm: 2, stress: 6, overall: 3 },
      anxious: { sadness: 4, happiness: 3, anxiety: 9, anger: 3, calm: 1, stress: 8, overall: 3 },
      angry: { sadness: 3, happiness: 2, anxiety: 5, anger: 9, calm: 1, stress: 7, overall: 3 },
      regretful: { sadness: 6, happiness: 3, anxiety: 4, anger: 2, calm: 3, stress: 5, overall: 4 },
      melancholic: { sadness: 7, happiness: 3, anxiety: 3, anger: 1, calm: 3, stress: 4, overall: 4 },
      unhappy: { sadness: 6, happiness: 2, anxiety: 4, anger: 3, calm: 2, stress: 5, overall: 4 },
      neutral: { sadness: 3, happiness: 5, anxiety: 3, anger: 2, calm: 5, stress: 3, overall: 5 },
      contentment: { sadness: 1, happiness: 7, anxiety: 2, anger: 1, calm: 8, stress: 2, overall: 7 },
      hope: { sadness: 2, happiness: 8, anxiety: 2, anger: 1, calm: 7, stress: 2, overall: 8 },
      happy: { sadness: 1, happiness: 9, anxiety: 1, anger: 1, calm: 8, stress: 1, overall: 9 },
      love: { sadness: 1, happiness: 10, anxiety: 1, anger: 1, calm: 9, stress: 1, overall: 9 },
      pride: { sadness: 1, happiness: 8, anxiety: 2, anger: 1, calm: 7, stress: 2, overall: 8 },
      gratitude: { sadness: 1, happiness: 9, anxiety: 1, anger: 1, calm: 8, stress: 1, overall: 9 },
      blissful: { sadness: 0, happiness: 10, anxiety: 0, anger: 0, calm: 10, stress: 0, overall: 10 },
      awe: { sadness: 1, happiness: 9, anxiety: 1, anger: 1, calm: 8, stress: 1, overall: 9 },
    }

    // Group emotions by day
    const emotionsByDay = chatbotData.emotionHistory.reduce(
      (acc, item) => {
        const date = new Date(item.timestamp)
        const dayKey = date.toLocaleDateString("en", { weekday: "short" })

        if (!acc[dayKey]) {
          acc[dayKey] = []
        }
        acc[dayKey].push(item.emotion)
        return acc
      },
      {} as Record<string, string[]>,
    )

    // Generate last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date
    })

    return last7Days.map((date) => {
      const dayKey = date.toLocaleDateString("en", { weekday: "short" })
      const dayEmotions = emotionsByDay[dayKey] || []

      if (dayEmotions.length === 0) {
        return {
          date: dayKey,
          timestamp: date.toISOString(),
          sadness: 3,
          happiness: 5,
          anxiety: 3,
          anger: 2,
          calm: 5,
          stress: 3,
          overall: 5,
        }
      }

      // Calculate average scores for the day
      const avgScores = dayEmotions.reduce(
        (acc, emotion) => {
          const scores = emotionToScores[emotion as keyof typeof emotionToScores] || emotionToScores.neutral
          Object.keys(scores).forEach((key) => {
            acc[key as keyof typeof acc] += scores[key as keyof typeof scores]
          })
          return acc
        },
        { sadness: 0, happiness: 0, anxiety: 0, anger: 0, calm: 0, stress: 0, overall: 0 },
      )

      Object.keys(avgScores).forEach((key) => {
        avgScores[key as keyof typeof avgScores] = Math.round(
          avgScores[key as keyof typeof avgScores] / dayEmotions.length,
        )
      })

      return {
        date: dayKey,
        timestamp: date.toISOString(),
        ...avgScores,
      }
    })
  }

  // Generate pie chart data from chatbot analysis
  const generateEmotionPieData = () => {
    if (!chatbotData?.analysis?.emotionBreakdown) {
      return [
        { name: "Happy", value: 35, color: "#22c55e" },
        { name: "Neutral", value: 25, color: "#6b7280" },
        { name: "Anxious", value: 20, color: "#eab308" },
        { name: "Sad", value: 15, color: "#3b82f6" },
        { name: "Angry", value: 5, color: "#ef4444" },
      ]
    }

    return chatbotData.analysis.emotionBreakdown.map((item) => ({
      name: item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1),
      value: item.percentage,
      color: item.color,
    }))
  }

  const handleSectionChange = (section: string) => {
    if (section === activeSection) return

    setPendingSection(section)
    setShowTransition(true)
  }

  const completeTransition = () => {
    setActiveSection(pendingSection)
    setShowTransition(false)
    setPendingSection("")
  }

  const searchMedicine = async () => {
    if (!medicineSearch.trim()) return

    // Mock medicine data - in real app, this would fetch from medical APIs
    const mockResults = {
      sertraline: {
        name: "Sertraline (Zoloft)",
        rating: 4.2,
        totalReviews: 1247,
        positiveReviews: 78,
        neutralReviews: 15,
        negativeReviews: 7,
        commonSideEffects: ["Nausea", "Drowsiness", "Dry mouth", "Insomnia"],
        effectiveness: 85,
        cost: "$15-30/month",
        reviews: [
          {
            user: "Anonymous",
            rating: 5,
            sentiment: "positive",
            comment: "Really helped with my anxiety and depression. Minimal side effects after the first week.",
            date: "2024-01-15",
          },
          {
            user: "Patient123",
            rating: 4,
            sentiment: "positive",
            comment: "Effective but took about 6 weeks to feel the full benefits. Worth the wait.",
            date: "2024-01-10",
          },
          {
            user: "MentalHealthJourney",
            rating: 3,
            sentiment: "neutral",
            comment: "Helped with depression but caused some sleep issues initially.",
            date: "2024-01-08",
          },
          {
            user: "RecoveryPath",
            rating: 2,
            sentiment: "negative",
            comment: "Didn't work well for me, experienced significant side effects.",
            date: "2024-01-05",
          },
        ],
      },
      lexapro: {
        name: "Escitalopram (Lexapro)",
        rating: 4.4,
        totalReviews: 892,
        positiveReviews: 82,
        neutralReviews: 12,
        negativeReviews: 6,
        commonSideEffects: ["Nausea", "Headache", "Sexual side effects", "Weight changes"],
        effectiveness: 88,
        cost: "$20-40/month",
        reviews: [
          {
            user: "HopeSeeker",
            rating: 5,
            sentiment: "positive",
            comment: "Life-changing medication. Significantly reduced my anxiety.",
            date: "2024-01-12",
          },
          {
            user: "AnxietyFighter",
            rating: 4,
            sentiment: "positive",
            comment: "Good results but experienced some initial nausea.",
            date: "2024-01-09",
          },
        ],
      },
    }

    const searchKey = medicineSearch.toLowerCase().replace(/\s+/g, "")
    const result = mockResults[searchKey as keyof typeof mockResults] || null

    setSearchResults(result)
  }

  const currentUser = {
    name: "John Smith",
    email: "john.smith@email.com",
    location: "New York, NY",
    joinDate: "January 2024",
    lastActive: "2 hours ago",
  }

  const doctorsInArea = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Psychiatrist",
      rating: 4.9,
      distance: "0.8 miles",
      availability: "Available Today",
      nextSlot: "2:00 PM - 3:00 PM",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Clinical Psychologist",
      rating: 4.8,
      distance: "1.2 miles",
      availability: "Next Available: Tomorrow",
      nextSlot: "10:00 AM - 11:00 AM",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Therapist",
      rating: 4.7,
      distance: "1.5 miles",
      availability: "Available This Week",
      nextSlot: "Friday 3:00 PM - 4:00 PM",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const emotionTrendData = generateEmotionTrendData()
  const emotionPieData = generateEmotionPieData()

  const renderEmotionAnalysisSection = () => (
    <div className="space-y-6">
      {/* Emotion Summary from Chatbot */}
      {chatbotData?.analysis && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Latest Chatbot Analysis
            </CardTitle>
            <CardDescription>Based on your recent conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 capitalize">
                  {chatbotData.analysis.dominantEmotion}
                </div>
                <p className="text-sm text-blue-700">Dominant Emotion</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{chatbotData.analysis.totalMessages}</div>
                <p className="text-sm text-purple-700">Messages</p>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    chatbotData.analysis.riskLevel === "Critical"
                      ? "text-red-600"
                      : chatbotData.analysis.riskLevel === "High"
                        ? "text-red-500"
                        : chatbotData.analysis.riskLevel === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                  }`}
                >
                  {chatbotData.analysis.riskLevel}
                </div>
                <p className="text-sm text-gray-700">Risk Level</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{chatbotData.analysis.recommendations.length}</div>
                <p className="text-sm text-green-700">Recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Emotion Trends Over Time
            </CardTitle>
            <CardDescription>Your emotional patterns with color-coded visualization</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Color Legend */}
            <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Sadness</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Happiness</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Anxiety</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Anger</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-teal-500 rounded"></div>
                <span>Calm</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Stress</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emotionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}
                />
                <Line type="monotone" dataKey="sadness" stroke="#3b82f6" strokeWidth={2} name="Sadness" />
                <Line type="monotone" dataKey="happiness" stroke="#22c55e" strokeWidth={2} name="Happiness" />
                <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} name="Anxiety" />
                <Line type="monotone" dataKey="anger" stroke="#f97316" strokeWidth={2} name="Anger" />
                <Line type="monotone" dataKey="calm" stroke="#14b8a6" strokeWidth={2} name="Calm" />
                <Line type="monotone" dataKey="stress" stroke="#8b5cf6" strokeWidth={2} name="Stress" />
                <Line type="monotone" dataKey="overall" stroke="#1f2937" strokeWidth={3} name="Overall Mood" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emotion Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
            <CardDescription>Breakdown of your emotional states from chatbot analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emotionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Emotion Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Emotion Patterns</CardTitle>
            <CardDescription>Daily emotion intensity levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="happiness" fill="#22c55e" name="Happiness" />
                <Bar dataKey="calm" fill="#14b8a6" name="Calm" />
                <Bar dataKey="sadness" fill="#3b82f6" name="Sadness" />
                <Bar dataKey="anxiety" fill="#ef4444" name="Anxiety" />
                <Bar dataKey="stress" fill="#8b5cf6" name="Stress" />
                <Bar dataKey="anger" fill="#f97316" name="Anger" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emotion Summary Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Emotion Summary</CardTitle>
            <CardDescription>Average emotional levels this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Smile className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(
                      emotionTrendData.reduce((sum, day) => sum + day.happiness, 0) / emotionTrendData.length,
                    )}
                    /10
                  </div>
                  <p className="text-sm text-green-700">Happiness</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Frown className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(emotionTrendData.reduce((sum, day) => sum + day.sadness, 0) / emotionTrendData.length)}
                    /10
                  </div>
                  <p className="text-sm text-blue-700">Sadness</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {Math.round(emotionTrendData.reduce((sum, day) => sum + day.anxiety, 0) / emotionTrendData.length)}
                    /10
                  </div>
                  <p className="text-sm text-red-700">Anxiety</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <Heart className="h-8 w-8 text-teal-500" />
                <div>
                  <div className="text-2xl font-bold text-teal-600">
                    {Math.round(emotionTrendData.reduce((sum, day) => sum + day.calm, 0) / emotionTrendData.length)}/10
                  </div>
                  <p className="text-sm text-teal-700">Calm</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights from Chatbot Analysis */}
      {chatbotData?.analysis?.insights && (
        <Card>
          <CardHeader>
            <CardTitle>AI Insights from Your Conversations</CardTitle>
            <CardDescription>Personalized insights based on your chatbot interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chatbotData.analysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderConnectWithDoctor = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Video className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Video Consultation</h3>
            <p className="text-sm text-gray-600">Start immediate video call</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Book Appointment</h3>
            <p className="text-sm text-gray-600">Schedule future visit</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Get Prescription</h3>
            <p className="text-sm text-gray-600">Request medication</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Truck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold">Medicine Delivery</h3>
            <p className="text-sm text-gray-600">Home delivery service</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Doctors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Available Doctors in {currentUser.location}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctorsInArea.map((doctor) => (
              <div key={doctor.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <p className="text-gray-600">{doctor.specialty}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{doctor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{doctor.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{doctor.nextSlot}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {doctor.availability}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Button size="sm" className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        Video Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Book
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Prescribe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Support */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Phone className="h-5 w-5" />
            Emergency Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold">Crisis Hotline</h4>
              <p className="text-2xl font-bold text-red-600">988</p>
              <p className="text-sm text-gray-600">24/7 Support</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold">Emergency</h4>
              <p className="text-2xl font-bold text-red-600">911</p>
              <p className="text-sm text-gray-600">Immediate Danger</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <MessageSquare className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold">Crisis Text</h4>
              <p className="text-lg font-bold text-red-600">Text HOME to 741741</p>
              <p className="text-sm text-gray-600">Text Support</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrescriptionAnalysis = () => (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Medicine Search & Analysis
          </CardTitle>
          <CardDescription>Search for any medication to view reviews, ratings, and user experiences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter medicine name (e.g., Sertraline, Lexapro, Zoloft)"
              value={medicineSearch}
              onChange={(e) => setMedicineSearch(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && searchMedicine()}
            />
            <Button onClick={searchMedicine} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  {searchResults.name}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{searchResults.rating}</span>
                    <span className="text-gray-500">({searchResults.totalReviews} reviews)</span>
                  </div>
                  <Badge variant="outline">{searchResults.cost}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Effectiveness</div>
                <div className="text-2xl font-bold text-green-600">{searchResults.effectiveness}%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Sentiment Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-3">Review Sentiment</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                      Positive
                    </span>
                    <span className="font-medium">{searchResults.positiveReviews}%</span>
                  </div>
                  <Progress value={searchResults.positiveReviews} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <Meh className="h-4 w-4 text-gray-500" />
                      Neutral
                    </span>
                    <span className="font-medium">{searchResults.neutralReviews}%</span>
                  </div>
                  <Progress value={searchResults.neutralReviews} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                      Negative
                    </span>
                    <span className="font-medium">{searchResults.negativeReviews}%</span>
                  </div>
                  <Progress value={searchResults.negativeReviews} className="h-2" />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Common Side Effects</h4>
                <div className="space-y-2">
                  {searchResults.commonSideEffects.map((effect: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Effectiveness Rating</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{searchResults.effectiveness}%</div>
                  <Progress value={searchResults.effectiveness} className="mb-2" />
                  <p className="text-sm text-gray-600">Users report improvement</p>
                </div>
              </div>
            </div>

            {/* User Reviews */}
            <div>
              <h4 className="font-medium mb-4">Recent User Reviews</h4>
              <div className="space-y-4">
                {searchResults.reviews.map((review: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user}</span>
                        <Badge
                          variant={
                            review.sentiment === "positive"
                              ? "default"
                              : review.sentiment === "negative"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {review.sentiment}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button size="sm" variant="ghost" className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        Helpful (12)
                      </Button>
                      <Button size="sm" variant="ghost" className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" />
                        Not Helpful (2)
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Information */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Important Safety Information
              </h4>
              <p className="text-sm text-gray-700">
                This information is for educational purposes only. Always consult with your healthcare provider before
                starting, stopping, or changing any medication. Individual experiences may vary.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Medicine Searches</CardTitle>
          <CardDescription>Quick access to commonly searched medications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Sertraline", "Lexapro", "Prozac", "Zoloft", "Xanax", "Ativan", "Wellbutrin", "Cymbalta"].map(
              (medicine) => (
                <Button
                  key={medicine}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMedicineSearch(medicine)
                    searchMedicine()
                  }}
                  className="justify-start"
                >
                  {medicine}
                </Button>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderEmotiPets = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            EmotiPets - Your Virtual Emotional Companion
          </CardTitle>
          <CardDescription>A caring virtual pet that helps you cope with emotions and provides comfort</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/emotipets">
            <Button className="w-full h-20 text-lg" onClick={() => handleSectionChange("emotipets-redirect")}>
              <Heart className="h-6 w-6 mr-3" />
              Start Playing with EmotiPets
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>What is EmotiPets?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                EmotiPets is your virtual emotional companion designed to provide comfort, support, and gentle
                activities when you're feeling sad, anxious, or lonely.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Empathetic responses to your emotions</li>
                  <li>• Gentle self-care reminders</li>
                  <li>• Fun mini-games to lift your mood</li>
                  <li>• Virtual pet care activities</li>
                  <li>• Encouraging daily check-ins</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How EmotiPets Helps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Emotional Support</h4>
                  <p className="text-sm text-gray-600">
                    Your pet responds with warmth and understanding to your feelings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gamepad2 className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Interactive Games</h4>
                  <p className="text-sm text-gray-600">Color guessing, memory games, and caring activities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Self-Care Reminders</h4>
                  <p className="text-sm text-gray-600">Gentle prompts for breathing, hydration, and affirmations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Daily Mood & Emotion Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Emotion Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Today's Emotion Distribution
                  </CardTitle>
                  <CardDescription>Your emotional state breakdown from recent interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={emotionPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${percent.toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emotionPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Daily Mood Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="h-5 w-5" />
                    Daily Mood Score
                  </CardTitle>
                  <CardDescription>Your mood progression throughout the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emotionTrendData.slice(-7).map((day, index) => {
                      const moodScore = day.overall
                      const moodEmoji =
                        moodScore >= 8
                          ? "😊"
                          : moodScore >= 6
                            ? "🙂"
                            : moodScore >= 4
                              ? "😐"
                              : moodScore >= 2
                                ? "😔"
                                : "😢"
                      const moodColor =
                        moodScore >= 8
                          ? "bg-green-500"
                          : moodScore >= 6
                            ? "bg-blue-500"
                            : moodScore >= 4
                              ? "bg-yellow-500"
                              : moodScore >= 2
                                ? "bg-orange-500"
                                : "bg-red-500"

                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{moodEmoji}</span>
                            <div>
                              <p className="font-medium">{day.date}</p>
                              <p className="text-sm text-gray-600">Score: {moodScore}/10</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${moodColor}`}
                                style={{ width: `${moodScore * 10}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{moodScore}/10</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emotion Trend Graph */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Emotion Trend Analysis
                </CardTitle>
                <CardDescription>Track your emotional patterns over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={emotionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}
                    />
                    <Line type="monotone" dataKey="happiness" stroke="#22c55e" strokeWidth={2} name="Happiness" />
                    <Line type="monotone" dataKey="calm" stroke="#14b8a6" strokeWidth={2} name="Calm" />
                    <Line type="monotone" dataKey="sadness" stroke="#3b82f6" strokeWidth={2} name="Sadness" />
                    <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} name="Anxiety" />
                    <Line type="monotone" dataKey="overall" stroke="#1f2937" strokeWidth={3} name="Overall Mood" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Goals & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Self-Care Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Self-Care Goals
                  </CardTitle>
                  <CardDescription>Track your daily wellness activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">💧</div>
                        <div>
                          <p className="font-medium">Drink Water</p>
                          <p className="text-sm text-gray-600">6/8 glasses today</p>
                        </div>
                      </div>
                      <div className="w-20">
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">🚶</div>
                        <div>
                          <p className="font-medium">5-Min Walk</p>
                          <p className="text-sm text-gray-600">Completed today</p>
                        </div>
                      </div>
                      <div className="w-20">
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">📝</div>
                        <div>
                          <p className="font-medium">Gratitude Journal</p>
                          <p className="text-sm text-gray-600">Not completed</p>
                        </div>
                      </div>
                      <div className="w-20">
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">🧘</div>
                        <div>
                          <p className="font-medium">Meditation</p>
                          <p className="text-sm text-gray-600">10/15 minutes</p>
                        </div>
                      </div>
                      <div className="w-20">
                        <Progress value={67} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Streaks & Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Streaks & Achievements
                  </CardTitle>
                  <CardDescription>Your consistency and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">🔥</div>
                        <div>
                          <p className="font-medium">Journaling Streak</p>
                          <p className="text-sm text-gray-600">5 days in a row</p>
                        </div>
                      </div>
                      <Badge variant="secondary">5 days</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">😴</div>
                        <div>
                          <p className="font-medium">Sleep Goals Met</p>
                          <p className="text-sm text-gray-600">3 nights this week</p>
                        </div>
                      </div>
                      <Badge variant="secondary">3/7 nights</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">💪</div>
                        <div>
                          <p className="font-medium">Exercise Streak</p>
                          <p className="text-sm text-gray-600">2 days active</p>
                        </div>
                      </div>
                      <Badge variant="secondary">2 days</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">🎯</div>
                        <div>
                          <p className="font-medium">Weekly Goal</p>
                          <p className="text-sm text-gray-600">4/7 goals completed</p>
                        </div>
                      </div>
                      <Badge variant="outline">57%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "emotion-analysis":
        return renderEmotionAnalysisSection()
      case "connect-doctor":
        return renderConnectWithDoctor()
      case "prescription-analysis":
        return renderPrescriptionAnalysis()
      case "emotipets":
        return renderEmotiPets()
      default:
        return <div>Section not found</div>
    }
  }

  return (
    <>
      <PageTransition isVisible={showTransition} onComplete={completeTransition} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">Ascle Med</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-gray-600">Healthcare Sentiment Analysis Platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>

                {/* Top-right Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Menu
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Dashboard Sections</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSectionChange("overview")}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Overview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSectionChange("emotion-analysis")}>
                      <Activity className="mr-2 h-4 w-4" />
                      Emotion Analysis
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Healthcare Services</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleSectionChange("connect-doctor")}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Connect with Doctor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSectionChange("prescription-analysis")}>
                      <Pill className="mr-2 h-4 w-4" />
                      Prescription Analysis
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Games & Activities</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleSectionChange("emotipets")}>
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      EmotiPets
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Left Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Menu className="h-5 w-5" />
                    Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    <Button
                      variant={activeSection === "overview" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleSectionChange("overview")}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Overview
                    </Button>
                    <Button
                      variant={activeSection === "emotion-analysis" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleSectionChange("emotion-analysis")}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Emotion Analysis
                    </Button>
                    <Button
                      variant={activeSection === "connect-doctor" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleSectionChange("connect-doctor")}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Connect with Doctor
                    </Button>
                    <Button
                      variant={activeSection === "prescription-analysis" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleSectionChange("prescription-analysis")}
                    >
                      <Pill className="mr-2 h-4 w-4" />
                      Prescription Analysis
                    </Button>
                    <Button
                      variant={activeSection === "emotipets" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleSectionChange("emotipets")}
                    >
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      Games &gt; EmotiPets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  )
}
