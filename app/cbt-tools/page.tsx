"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Heart,
  Lightbulb,
  Wind,
  BookOpen,
  Target,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function CBTToolsPage() {
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: "",
    emotion: "",
    intensity: 5,
    automaticThought: "",
    evidence: "",
    balancedThought: "",
  })

  const [breathingExercise, setBreathingExercise] = useState({
    isActive: false,
    phase: "inhale", // inhale, hold, exhale
    count: 4,
    cycle: 0,
  })

  const [journalPrompts] = useState([
    "What am I grateful for today?",
    "What challenged me and how did I handle it?",
    "What would I tell a friend in my situation?",
    "What small win can I celebrate today?",
    "How can I show myself compassion right now?",
  ])

  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [journalResponse, setJournalResponse] = useState("")

  const startBreathingExercise = () => {
    setBreathingExercise((prev) => ({ ...prev, isActive: true, cycle: 0 }))

    const breathingTimer = setInterval(() => {
      setBreathingExercise((prev) => {
        if (prev.phase === "inhale" && prev.count === 4) {
          return { ...prev, phase: "hold", count: 7 }
        } else if (prev.phase === "hold" && prev.count === 7) {
          return { ...prev, phase: "exhale", count: 8 }
        } else if (prev.phase === "exhale" && prev.count === 8) {
          return { ...prev, phase: "inhale", count: 4, cycle: prev.cycle + 1 }
        } else {
          return { ...prev, count: prev.count - 1 }
        }
      })
    }, 1000)

    setTimeout(() => {
      clearInterval(breathingTimer)
      setBreathingExercise((prev) => ({ ...prev, isActive: false }))
    }, 60000) // 1 minute exercise
  }

  const getBreathingInstruction = () => {
    switch (breathingExercise.phase) {
      case "inhale":
        return "Breathe in slowly..."
      case "hold":
        return "Hold your breath..."
      case "exhale":
        return "Breathe out slowly..."
      default:
        return "Ready to begin?"
    }
  }

  const getBreathingColor = () => {
    switch (breathingExercise.phase) {
      case "inhale":
        return "from-blue-400 to-blue-600"
      case "hold":
        return "from-purple-400 to-purple-600"
      case "exhale":
        return "from-green-400 to-green-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <span className="text-xl font-bold text-gray-900">CBT Tools</span>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Cognitive Behavioral Therapy
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tools */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="thought-record" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="thought-record" className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Thought Record</span>
                </TabsTrigger>
                <TabsTrigger value="breathing" className="flex items-center space-x-2">
                  <Wind className="h-4 w-4" />
                  <span>Breathing</span>
                </TabsTrigger>
                <TabsTrigger value="journaling" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Journaling</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="thought-record">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-6 w-6 text-yellow-600" />
                      <span>Thought Record</span>
                    </CardTitle>
                    <CardDescription>Challenge negative thoughts and develop balanced perspectives</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Situation</label>
                        <Input
                          placeholder="Describe the situation that triggered your emotion"
                          value={thoughtRecord.situation}
                          onChange={(e) => setThoughtRecord((prev) => ({ ...prev, situation: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Emotion</label>
                          <Input
                            placeholder="What emotion did you feel?"
                            value={thoughtRecord.emotion}
                            onChange={(e) => setThoughtRecord((prev) => ({ ...prev, emotion: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Intensity (1-10): {thoughtRecord.intensity}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={thoughtRecord.intensity}
                            onChange={(e) =>
                              setThoughtRecord((prev) => ({ ...prev, intensity: Number.parseInt(e.target.value) }))
                            }
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Automatic Thought</label>
                        <Textarea
                          placeholder="What went through your mind? What were you thinking?"
                          value={thoughtRecord.automaticThought}
                          onChange={(e) => setThoughtRecord((prev) => ({ ...prev, automaticThought: e.target.value }))}
                          className="min-h-20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Evidence</label>
                        <Textarea
                          placeholder="What evidence supports or contradicts this thought?"
                          value={thoughtRecord.evidence}
                          onChange={(e) => setThoughtRecord((prev) => ({ ...prev, evidence: e.target.value }))}
                          className="min-h-20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Balanced Thought</label>
                        <Textarea
                          placeholder="What would be a more balanced, realistic way to think about this?"
                          value={thoughtRecord.balancedThought}
                          onChange={(e) => setThoughtRecord((prev) => ({ ...prev, balancedThought: e.target.value }))}
                          className="min-h-20"
                        />
                      </div>

                      <Button className="w-full hover:scale-105 transition-transform">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Thought Record
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="breathing">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wind className="h-6 w-6 text-blue-600" />
                      <span>4-7-8 Breathing Exercise</span>
                    </CardTitle>
                    <CardDescription>Reduce anxiety and stress with guided breathing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div
                          className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${getBreathingColor()} flex items-center justify-center transition-all duration-1000 ${breathingExercise.isActive ? "scale-110" : "scale-100"}`}
                        >
                          <div className="text-white text-center">
                            <div className="text-2xl font-bold">{breathingExercise.count}</div>
                            <div className="text-sm">{breathingExercise.phase}</div>
                          </div>
                        </div>
                        {breathingExercise.isActive && (
                          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-blue-300 animate-ping" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{getBreathingInstruction()}</h3>
                        <p className="text-gray-600">
                          {breathingExercise.isActive
                            ? `Cycle ${breathingExercise.cycle + 1} of 4`
                            : "Inhale for 4, hold for 7, exhale for 8"}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {!breathingExercise.isActive ? (
                          <Button
                            onClick={startBreathingExercise}
                            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all"
                            size="lg"
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Start Exercise
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => setBreathingExercise((prev) => ({ ...prev, isActive: false }))}
                            className="hover:scale-105 transition-transform"
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Stop Exercise
                          </Button>
                        )}

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">4</div>
                            <div className="text-sm text-blue-700">Inhale</div>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">7</div>
                            <div className="text-sm text-purple-700">Hold</div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">8</div>
                            <div className="text-sm text-green-700">Exhale</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="journaling">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-6 w-6 text-green-600" />
                      <span>Guided Journaling</span>
                    </CardTitle>
                    <CardDescription>Structured prompts to explore your thoughts and feelings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">Today's Prompt:</h3>
                        <p className="text-green-700">{journalPrompts[currentPrompt]}</p>
                      </div>

                      <Textarea
                        placeholder="Take your time to reflect and write your thoughts..."
                        value={journalResponse}
                        onChange={(e) => setJournalResponse(e.target.value)}
                        className="min-h-40"
                      />

                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPrompt((prev) => (prev + 1) % journalPrompts.length)}
                          className="hover:scale-105 transition-transform"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          New Prompt
                        </Button>
                        <div className="text-sm text-gray-500">{journalResponse.length} characters</div>
                        <Button className="hover:scale-105 transition-transform">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Save Entry
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Today's Progress</CardTitle>
                <CardDescription>Your CBT practice journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Thought Records</span>
                    <Badge variant="outline">2/3</Badge>
                  </div>
                  <Progress value={66} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Breathing Exercises</span>
                    <Badge variant="outline">1/2</Badge>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Journal Entries</span>
                    <Badge variant="outline">1/1</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">75%</div>
                    <div className="text-sm text-gray-600">Daily Goal</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <span>CBT Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Thought Challenging</h4>
                  <p className="text-sm text-blue-700">
                    Ask yourself: "Is this thought helpful? What would I tell a friend?"
                  </p>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Mindful Breathing</h4>
                  <p className="text-sm text-green-700">
                    Practice daily for best results. Even 2-3 minutes can make a difference.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-1">Consistent Practice</h4>
                  <p className="text-sm text-purple-700">
                    Regular use of CBT tools builds stronger mental health habits.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Motivational Nudges */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Motivation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-3xl">🌟</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">You're doing great!</h3>
                    <p className="text-sm text-gray-600">
                      Every small step in practicing CBT tools builds resilience and emotional strength.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full hover:scale-105 transition-transform">
                    <Heart className="h-4 w-4 mr-2" />
                    Share Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
