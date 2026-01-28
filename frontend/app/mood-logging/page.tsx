"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Camera,
  Mic,
  Calendar,
  Heart,
  Brain,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  MapPin,
  Moon,
  Footprints,
  Stethoscope,
  ArrowLeft,
  Save,
  Upload,
  Square,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function MoodLoggingPage() {
  const [moodScore, setMoodScore] = useState([5])
  const [journalText, setJournalText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [passiveData, setPassiveData] = useState({
    sleep: 7.5,
    steps: 8432,
    heartRate: 72,
    location: "Home",
  })
  const [sentimentAnalysis, setSentimentAnalysis] = useState({
    confidence: 0.85,
    emotions: {
      joy: 0.3,
      sadness: 0.1,
      anxiety: 0.2,
      anger: 0.05,
      neutral: 0.35,
    },
    insights: [
      "Positive sentiment detected in journal entry",
      "Mood improvement since yesterday",
      "Sleep quality correlates with mood score",
    ],
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedPhoto(file)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.start()
      setIsRecording(true)

      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      mediaRecorder.onstop = () => {
        clearInterval(timer)
        stream.getTracks().forEach((track) => track.stop())
      }
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingTime(0)
    }
  }

  const getMoodEmoji = (score: number) => {
    if (score <= 3) return <Frown className="h-6 w-6 text-red-500" />
    if (score <= 7) return <Meh className="h-6 w-6 text-yellow-500" />
    return <Smile className="h-6 w-6 text-green-500" />
  }

  const getMoodColor = (score: number) => {
    if (score <= 3) return "from-red-500 to-red-600"
    if (score <= 7) return "from-yellow-500 to-orange-500"
    return "from-green-500 to-green-600"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
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
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Daily Mood Logging</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString()}
              </Badge>
              <Button className="hover:scale-105 transition-transform">
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Logging Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Scale */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span>Mood Scale</span>
                </CardTitle>
                <CardDescription>Rate your current mood from 1 (very low) to 10 (excellent)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  {getMoodEmoji(moodScore[0])}
                  <div className="text-3xl font-bold text-gray-900">{moodScore[0]}/10</div>
                </div>
                <div className="space-y-4">
                  <Slider value={moodScore} onValueChange={setMoodScore} max={10} min={1} step={1} className="w-full" />
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(moodScore[0])} transition-all duration-500`}
                    style={{ width: `${(moodScore[0] / 10) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <Frown className="h-6 w-6 text-red-500 mx-auto mb-1" />
                    <div className="text-sm text-red-700">Low (1-3)</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Meh className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                    <div className="text-sm text-yellow-700">Moderate (4-7)</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Smile className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <div className="text-sm text-green-700">High (8-10)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multimodal Input Tabs */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Mood Capture</CardTitle>
                <CardDescription>Express your feelings through text, photos, or voice</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="journal" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="journal" className="flex items-center space-x-2">
                      <Brain className="h-4 w-4" />
                      <span>Journal</span>
                    </TabsTrigger>
                    <TabsTrigger value="photo" className="flex items-center space-x-2">
                      <Camera className="h-4 w-4" />
                      <span>Photo</span>
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="flex items-center space-x-2">
                      <Mic className="h-4 w-4" />
                      <span>Voice</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="journal" className="space-y-4">
                    <Textarea
                      placeholder="How are you feeling today? What's on your mind?"
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                      className="min-h-32 resize-none"
                    />
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{journalText.length} characters</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        AI Analysis: {sentimentAnalysis.confidence * 100}% confidence
                      </Badge>
                    </div>
                  </TabsContent>

                  <TabsContent value="photo" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      {selectedPhoto ? (
                        <div className="space-y-4">
                          <img
                            src={URL.createObjectURL(selectedPhoto) || "/placeholder.svg"}
                            alt="Mood photo"
                            className="max-w-full h-48 object-cover rounded-lg mx-auto"
                          />
                          <p className="text-sm text-gray-600">{selectedPhoto.name}</p>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedPhoto(null)}
                            className="hover:scale-105 transition-transform"
                          >
                            Remove Photo
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-gray-900">Upload a mood photo</p>
                            <p className="text-sm text-gray-600">Capture how you're feeling visually</p>
                          </div>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="hover:scale-105 transition-transform"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Photo
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="voice" className="space-y-4">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        {isRecording ? (
                          <div className="w-8 h-8 bg-white rounded animate-pulse" />
                        ) : (
                          <Mic className="h-12 w-12 text-white" />
                        )}
                      </div>

                      {isRecording && (
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-red-600">{formatTime(recordingTime)}</div>
                          <div className="flex justify-center space-x-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-2 h-8 bg-red-500 rounded animate-pulse"
                                style={{ animationDelay: `${i * 0.1}s` }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          {isRecording ? "Recording your voice note..." : "Record a voice note"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isRecording ? "Tap stop when finished" : "Express your feelings through voice"}
                        </p>
                      </div>

                      <div className="flex justify-center space-x-4">
                        {!isRecording ? (
                          <Button
                            onClick={startRecording}
                            className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all"
                          >
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording
                          </Button>
                        ) : (
                          <Button
                            onClick={stopRecording}
                            variant="outline"
                            className="hover:scale-105 transition-transform"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Stop Recording
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Passive Data */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Passive Data</CardTitle>
                <CardDescription>Automatically tracked wellness metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Moon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">{passiveData.sleep}h</div>
                    <div className="text-xs text-blue-700">Sleep</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Footprints className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">{passiveData.steps.toLocaleString()}</div>
                    <div className="text-xs text-green-700">Steps</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <Heart className="h-6 w-6 text-red-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-red-600">{passiveData.heartRate}</div>
                    <div className="text-xs text-red-700">BPM</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-sm font-bold text-purple-600">{passiveData.location}</div>
                    <div className="text-xs text-purple-700">Location</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Sentiment Analysis */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>AI Analysis</span>
                </CardTitle>
                <CardDescription>Real-time sentiment insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confidence Score</span>
                    <span>{Math.round(sentimentAnalysis.confidence * 100)}%</span>
                  </div>
                  <Progress value={sentimentAnalysis.confidence * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Emotion Breakdown</h4>
                  {Object.entries(sentimentAnalysis.emotions).map(([emotion, value]) => (
                    <div key={emotion} className="flex justify-between items-center text-sm">
                      <span className="capitalize">{emotion}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={value * 100} className="w-16 h-1" />
                        <span className="text-xs w-8">{Math.round(value * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Insights</h4>
                  {sentimentAnalysis.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2 text-xs text-gray-600">
                      <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/cbt-tools">
                  <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform">
                    <Brain className="h-4 w-4 mr-2" />
                    CBT Tools
                  </Button>
                </Link>
                <Link href="/mood-trends">
                  <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Trends
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full justify-start hover:scale-105 transition-transform">
                    <Heart className="h-4 w-4 mr-2" />
                    Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
