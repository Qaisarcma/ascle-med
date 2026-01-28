"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mic,
  Play,
  Pause,
  Square,
  Volume2,
  AlertTriangle,
  TrendingUp,
  Activity,
  Brain,
  Heart,
  Clock,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const voiceEmotionData = [
  { time: "0s", joy: 20, sadness: 15, anger: 10, fear: 25, surprise: 30 },
  { time: "10s", joy: 25, sadness: 20, anger: 15, fear: 20, surprise: 20 },
  { time: "20s", joy: 15, sadness: 35, anger: 20, fear: 15, surprise: 15 },
  { time: "30s", joy: 10, sadness: 45, anger: 25, fear: 10, surprise: 10 },
  { time: "40s", joy: 30, sadness: 25, anger: 15, fear: 15, surprise: 15 },
  { time: "50s", joy: 35, sadness: 20, anger: 10, fear: 20, surprise: 15 },
]

const acousticFeatures = [
  { feature: "Pitch Variation", value: 75, status: "High", color: "text-orange-600" },
  { feature: "Speech Rate", value: 85, status: "Fast", color: "text-red-600" },
  { feature: "Volume Stability", value: 45, status: "Unstable", color: "text-yellow-600" },
  { feature: "Voice Quality", value: 90, status: "Clear", color: "text-green-600" },
  { feature: "Pause Frequency", value: 60, status: "Moderate", color: "text-blue-600" },
]

export default function VoiceAnalysisPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [currentEmotion, setCurrentEmotion] = useState("Analyzing...")
  const [stressLevel, setStressLevel] = useState(65)
  const [confidenceScore, setConfidenceScore] = useState(78)
  const audioRef = useRef<HTMLAudioElement>(null)

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
      setAudioLevel(Math.random() * 100)
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      setIsRecording(false)
      setCurrentEmotion("Anxious")
      setStressLevel(75)
      setConfidenceScore(82)
    }, 10000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setCurrentEmotion("Anxious")
    setStressLevel(75)
    setConfidenceScore(82)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "happy":
      case "joy":
        return "text-green-600 bg-green-100"
      case "sad":
      case "sadness":
        return "text-blue-600 bg-blue-100"
      case "angry":
      case "anger":
        return "text-red-600 bg-red-100"
      case "anxious":
      case "fear":
        return "text-yellow-600 bg-yellow-100"
      case "surprised":
      case "surprise":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStressColor = (level: number) => {
    if (level >= 70) return "text-red-600"
    if (level >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Voice Emotion Analysis</h1>
              <p className="text-gray-600 mt-1">Real-time voice emotion recognition and acoustic analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getEmotionColor(currentEmotion)}>
                <Activity className="h-4 w-4 mr-1" />
                {currentEmotion}
              </Badge>
              <Badge className={`${getStressColor(stressLevel)} bg-opacity-10`}>
                <AlertTriangle className="h-4 w-4 mr-1" />
                Stress: {stressLevel}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Recording Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mic className="h-6 w-6 text-blue-600" />
                  <span>Voice Recording & Analysis</span>
                </CardTitle>
                <CardDescription>Record your voice to analyze emotional state and acoustic features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recording Controls */}
                <div className="flex items-center justify-center space-x-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4"
                    >
                      <Mic className="h-6 w-6 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-4"
                    >
                      <Square className="h-6 w-6 mr-2" />
                      Stop Recording
                    </Button>
                  )}

                  <Button onClick={togglePlayback} size="lg" variant="outline" disabled={isRecording}>
                    {isPlaying ? <Pause className="h-6 w-6 mr-2" /> : <Play className="h-6 w-6 mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                </div>

                {/* Recording Status */}
                <div className="text-center space-y-4">
                  <div className="text-2xl font-mono font-bold text-gray-900">{formatTime(recordingTime)}</div>

                  {isRecording && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Recording in progress...</span>
                      </div>
                      <div className="w-full max-w-md mx-auto">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4 text-gray-400" />
                          <Progress value={audioLevel} className="flex-1" />
                          <span className="text-sm text-gray-500">{Math.round(audioLevel)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Waveform Visualization */}
                <div className="bg-gray-100 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="flex items-end space-x-1 h-20">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-blue-500 rounded-t ${isRecording ? "animate-pulse" : ""}`}
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Analysis */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-time Analysis</CardTitle>
                <CardDescription>Current emotional state detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{currentEmotion}</div>
                  <Badge className={getEmotionColor(currentEmotion)}>Primary Emotion</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Confidence</span>
                    <span className="text-sm">{confidenceScore}%</span>
                  </div>
                  <Progress value={confidenceScore} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Stress Level</span>
                    <span className={`text-sm font-medium ${getStressColor(stressLevel)}`}>{stressLevel}%</span>
                  </div>
                  <Progress value={stressLevel} className="[&>div]:bg-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Detection</CardTitle>
                <CardDescription>Automated distress monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Distress Indicators</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Voice Tremor</span>
                    <span>Detected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Speech Irregularity</span>
                    <span>Moderate</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Emotional Intensity</span>
                    <span>High</span>
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Trigger Alert Protocol
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="emotions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emotions">Emotion Timeline</TabsTrigger>
            <TabsTrigger value="acoustic">Acoustic Features</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="emotions">
            <Card>
              <CardHeader>
                <CardTitle>Emotion Timeline Analysis</CardTitle>
                <CardDescription>Emotional state changes throughout the recording</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={voiceEmotionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="joy" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area
                      type="monotone"
                      dataKey="sadness"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="anger"
                      stackId="1"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="fear"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="surprise"
                      stackId="1"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acoustic">
            <Card>
              <CardHeader>
                <CardTitle>Acoustic Feature Analysis</CardTitle>
                <CardDescription>Detailed analysis of voice characteristics using OpenSMILE features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Feature Analysis</h3>
                    {acousticFeatures.map((feature, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{feature.feature}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${feature.color}`}>{feature.status}</span>
                            <span className="text-sm text-gray-500">{feature.value}%</span>
                          </div>
                        </div>
                        <Progress value={feature.value} />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Voice Characteristics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">440Hz</div>
                        <div className="text-sm text-blue-700">Average Pitch</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">150</div>
                        <div className="text-sm text-green-700">Words/Min</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">2.3s</div>
                        <div className="text-sm text-purple-700">Avg Pause</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">65dB</div>
                        <div className="text-sm text-orange-700">Volume Level</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns">
            <Card>
              <CardHeader>
                <CardTitle>Pattern Recognition</CardTitle>
                <CardDescription>AI-detected patterns in voice and emotional expression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Detected Patterns</h3>
                    <div className="space-y-3">
                      <div className="p-3 border-l-4 border-red-500 bg-red-50">
                        <h4 className="font-medium text-red-900">Stress Indicators</h4>
                        <p className="text-sm text-red-700">
                          Increased speech rate and pitch variation detected, indicating elevated stress levels.
                        </p>
                      </div>
                      <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                        <h4 className="font-medium text-yellow-900">Anxiety Markers</h4>
                        <p className="text-sm text-yellow-700">
                          Frequent pauses and voice tremor suggest anxiety or nervousness.
                        </p>
                      </div>
                      <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                        <h4 className="font-medium text-blue-900">Emotional Variability</h4>
                        <p className="text-sm text-blue-700">
                          High emotional variability throughout the recording indicates emotional instability.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Behavioral Insights</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Communication Style</span>
                        <Badge variant="outline">Hesitant</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Emotional Regulation</span>
                        <Badge variant="outline">Struggling</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Confidence Level</span>
                        <Badge variant="outline">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Attention Focus</span>
                        <Badge variant="outline">Scattered</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Personalized recommendations based on voice analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <Brain className="h-5 w-5 mr-2" />
                        Emotional State Assessment
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Your voice analysis indicates elevated anxiety levels with moderate stress. The acoustic
                        patterns suggest you may benefit from relaxation techniques.
                      </p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        View Coping Strategies
                      </Button>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        Wellness Recommendations
                      </h4>
                      <p className="text-sm text-green-700 mb-3">
                        Based on your voice patterns, we recommend deep breathing exercises and mindfulness practices to
                        help regulate emotional responses.
                      </p>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Start Breathing Exercise
                      </Button>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Progress Tracking
                      </h4>
                      <p className="text-sm text-purple-700 mb-3">
                        Compared to your baseline, there's a 15% increase in stress indicators. Regular monitoring can
                        help track improvement over time.
                      </p>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        View Progress Chart
                      </Button>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2 flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Professional Consultation
                      </h4>
                      <p className="text-sm text-orange-700 mb-3">
                        The analysis suggests you might benefit from speaking with a mental health professional for
                        additional support and coping strategies.
                      </p>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Find Therapist
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Recommended Actions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">Immediate</div>
                        <p className="text-sm text-gray-600">Practice 4-7-8 breathing technique</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">Short-term</div>
                        <p className="text-sm text-gray-600">Schedule daily mindfulness sessions</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">Long-term</div>
                        <p className="text-sm text-gray-600">Consider professional counseling</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
