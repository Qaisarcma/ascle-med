"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Globe,
  MapPin,
  AlertTriangle,
  Users,
  MessageSquare,
  Calendar,
  Filter,
  Search,
  BarChart3,
  Activity,
  Shield,
  Zap,
  Clock,
} from "lucide-react"
import {
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const socialMediaTrends = [
  { date: "Jan", covid: 45, mental_health: 65, vaccines: 30, flu: 20 },
  { date: "Feb", covid: 40, mental_health: 70, vaccines: 35, flu: 25 },
  { date: "Mar", covid: 35, mental_health: 75, vaccines: 40, flu: 30 },
  { date: "Apr", covid: 30, mental_health: 80, vaccines: 25, flu: 15 },
  { date: "May", covid: 25, mental_health: 85, vaccines: 20, flu: 10 },
  { date: "Jun", covid: 20, mental_health: 90, vaccines: 15, flu: 8 },
]

const regionalSentiment = [
  { region: "North America", positive: 65, negative: 20, neutral: 15, population: 580000000 },
  { region: "Europe", positive: 70, negative: 18, neutral: 12, population: 750000000 },
  { region: "Asia", positive: 60, negative: 25, neutral: 15, population: 4600000000 },
  { region: "South America", positive: 55, negative: 30, neutral: 15, population: 430000000 },
  { region: "Africa", positive: 50, negative: 35, neutral: 15, population: 1300000000 },
  { region: "Oceania", positive: 75, negative: 15, neutral: 10, population: 45000000 },
]

const healthTopics = [
  { name: "Mental Health", value: 35, color: "#8B5CF6", trend: "+12%" },
  { name: "COVID-19", value: 25, color: "#EF4444", trend: "-8%" },
  { name: "Vaccines", value: 20, color: "#10B981", trend: "+5%" },
  { name: "Chronic Diseases", value: 15, color: "#F59E0B", trend: "+3%" },
  { name: "Public Health Policy", value: 5, color: "#6B7280", trend: "-2%" },
]

const emergingConcerns = [
  {
    id: 1,
    title: "Rising Anxiety Levels in Urban Areas",
    severity: "High",
    region: "North America",
    trend: "+25%",
    timeframe: "Last 30 days",
    description: "Significant increase in anxiety-related discussions across major cities",
    sources: 15420,
  },
  {
    id: 2,
    title: "Vaccine Hesitancy in Rural Communities",
    severity: "Medium",
    region: "Europe",
    trend: "+15%",
    timeframe: "Last 14 days",
    description: "Growing concerns about vaccine safety in rural populations",
    sources: 8750,
  },
  {
    id: 3,
    title: "Mental Health Stigma Discussions",
    severity: "Medium",
    region: "Asia",
    trend: "+18%",
    timeframe: "Last 7 days",
    description: "Increased conversations about mental health stigma and awareness",
    sources: 12300,
  },
]

export default function PublicHealthPage() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const [searchQuery, setSearchQuery] = useState("")

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend.startsWith("+") ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Public Health Sentiment Monitoring</h1>
              <p className="text-gray-600 mt-1">Real-time analysis of health-related discussions and trends</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="south-america">South America</SelectItem>
                  <SelectItem value="africa">Africa</SelectItem>
                  <SelectItem value="oceania">Oceania</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Mentions</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4M</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+2</span> new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage Regions</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">195</div>
              <p className="text-xs text-muted-foreground">Countries monitored</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Social Media Trends</TabsTrigger>
            <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
            <TabsTrigger value="alerts">Emerging Concerns</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Topic Trends Over Time</CardTitle>
                    <CardDescription>Social media mentions and sentiment analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={socialMediaTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="mental_health"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                          name="Mental Health"
                        />
                        <Line type="monotone" dataKey="covid" stroke="#EF4444" strokeWidth={2} name="COVID-19" />
                        <Line type="monotone" dataKey="vaccines" stroke="#10B981" strokeWidth={2} name="Vaccines" />
                        <Line type="monotone" dataKey="flu" stroke="#F59E0B" strokeWidth={2} name="Flu/Seasonal" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Topic Distribution</CardTitle>
                    <CardDescription>Current health discussion topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={healthTopics}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {healthTopics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Trending Health Topics</CardTitle>
                <CardDescription>Most discussed health topics with sentiment trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {healthTopics.map((topic, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{topic.name}</h3>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(topic.trend)}
                          <span
                            className={`text-sm font-medium ${
                              topic.trend.startsWith("+") ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {topic.trend}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: topic.color }} />
                        <span className="text-sm text-gray-600">{topic.value}% of discussions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Sentiment Analysis</CardTitle>
                <CardDescription>Health sentiment distribution across different regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalSentiment.map((region, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <h3 className="font-medium">{region.region}</h3>
                        </div>
                        <div className="text-sm text-gray-500">
                          Population: {(region.population / 1000000).toFixed(0)}M
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{region.positive}%</div>
                          <div className="text-sm text-gray-600">Positive</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-600">{region.neutral}%</div>
                          <div className="text-sm text-gray-600">Neutral</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{region.negative}%</div>
                          <div className="text-sm text-gray-600">Negative</div>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="flex h-2 rounded-full overflow-hidden">
                          <div className="bg-green-500" style={{ width: `${region.positive}%` }} />
                          <div className="bg-gray-400" style={{ width: `${region.neutral}%` }} />
                          <div className="bg-red-500" style={{ width: `${region.negative}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Emerging Health Concerns</h2>
                <p className="text-gray-600">AI-detected health issues requiring attention</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search concerns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {emergingConcerns.map((concern) => (
                <Card key={concern.id} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{concern.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(concern.severity)}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {concern.severity} Priority
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          {concern.region}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{concern.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-red-600" />
                        <div>
                          <div className="text-sm font-medium">Trend</div>
                          <div className="text-sm text-red-600">{concern.trend}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="text-sm font-medium">Timeframe</div>
                          <div className="text-sm text-gray-600">{concern.timeframe}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium">Sources</div>
                          <div className="text-sm text-blue-600">{concern.sources.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="text-sm font-medium">Reach</div>
                          <div className="text-sm text-purple-600">2.3M people</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Zap className="h-4 w-4 mr-2" />
                        Create Alert
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Predictive Analytics</span>
                  </CardTitle>
                  <CardDescription>AI predictions for emerging health trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Mental Health Crisis Prediction</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      85% probability of increased mental health discussions in urban areas over the next 30 days.
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-blue-600">85%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Vaccine Acceptance Improvement</h4>
                    <p className="text-sm text-green-700 mb-2">
                      72% likelihood of improved vaccine sentiment following recent awareness campaigns.
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-green-600">72%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Seasonal Health Concerns</h4>
                    <p className="text-sm text-orange-700 mb-2">
                      68% chance of increased flu-related discussions as winter approaches.
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: "68%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-orange-600">68%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>Policy Recommendations</span>
                  </CardTitle>
                  <CardDescription>Data-driven public health policy suggestions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-medium text-purple-900">Mental Health Resources</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Increase mental health resource allocation in urban areas by 25% based on sentiment analysis
                      trends.
                    </p>
                  </div>

                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900">Communication Strategy</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Implement targeted communication campaigns in regions showing vaccine hesitancy patterns.
                    </p>
                  </div>

                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900">Early Warning System</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Deploy early warning systems in regions with emerging health concern indicators.
                    </p>
                  </div>

                  <div className="p-3 border-l-4 border-red-500 bg-red-50">
                    <h4 className="font-medium text-red-900">Crisis Intervention</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Prepare crisis intervention protocols for areas showing high negative sentiment trends.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Real-time Health Intelligence Dashboard</CardTitle>
                <CardDescription>Live monitoring of global health sentiment and emerging issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600 mb-1">98.7%</div>
                    <div className="text-sm text-blue-700">System Uptime</div>
                    <div className="text-xs text-blue-600 mt-1">Last 30 days</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600 mb-1">195</div>
                    <div className="text-sm text-green-700">Countries Monitored</div>
                    <div className="text-xs text-green-600 mt-1">Real-time coverage</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600 mb-1">2.4M</div>
                    <div className="text-sm text-purple-700">Daily Mentions</div>
                    <div className="text-xs text-purple-600 mt-1">Across all platforms</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600 mb-1">15ms</div>
                    <div className="text-sm text-orange-700">Response Time</div>
                    <div className="text-xs text-orange-600 mt-1">Average processing</div>
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
