"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Stethoscope,
  Brain,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  Heart,
  CheckCircle,
  ArrowRight,
  Play,
  Lightbulb,
  Activity,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  // Fixed floating icons without mouse tracking
  const floatingIcons = [
    { icon: Brain, delay: 0, duration: 8 },
    { icon: Heart, delay: 1, duration: 10 },
    { icon: Activity, delay: 2, duration: 9 },
    { icon: Stethoscope, delay: 3, duration: 11 },
    { icon: MessageSquare, delay: 4, duration: 7 },
    { icon: BarChart3, delay: 5, duration: 12 },
    { icon: Shield, delay: 6, duration: 8 },
    { icon: Zap, delay: 7, duration: 10 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 page-transition">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Ascle Med</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Background Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {floatingIcons.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="absolute animate-float-random opacity-10"
              style={{
                left: `${10 + index * 12}%`,
                top: `${15 + index * 8}%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration}s`,
              }}
            >
              <Icon className="w-12 h-12 text-blue-500" />
            </div>
          )
        })}
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
              🚀 Advanced AI-Powered Healthcare Analytics
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              Transform Healthcare with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 block">
                Intelligent Sentiment Analysis
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Revolutionize patient care with our comprehensive AI platform that analyzes emotions, predicts mental
              health trends, and provides personalized recommendations for better healthcare outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Ascle Med Platform Demo</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Ascle Med Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Healthcare Intelligence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with healthcare expertise to deliver unprecedented insights into
              patient mental health and emotional well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Text Sentiment Analysis */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Advanced Text Analysis</CardTitle>
                <CardDescription>
                  Analyze patient communications, medical notes, and feedback with state-of-the-art NLP algorithms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time emotion detection
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Multi-language support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    HIPAA compliant processing
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Mental Health Chatbot */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">AI Mental Health Companion</CardTitle>
                <CardDescription>
                  24/7 intelligent chatbot providing personalized mental health support and crisis intervention.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Emotion-specific responses
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Crisis detection & support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Therapeutic conversation
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Comprehensive Analytics</CardTitle>
                <CardDescription>
                  Advanced dashboards with real-time insights, trends, and predictive analytics for healthcare
                  providers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Interactive visualizations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Predictive modeling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Custom reporting
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Patient Monitoring */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <Activity className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Patient Monitoring</CardTitle>
                <CardDescription>
                  Continuous monitoring of patient emotional states with automated alerts and intervention
                  recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automated alerts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Risk assessment
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* CBT Tools */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl font-semibold">CBT & Wellness Tools</CardTitle>
                <CardDescription>
                  Evidence-based cognitive behavioral therapy tools and wellness resources for patient self-care.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Guided exercises
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Progress tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Personalized plans
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-level security with HIPAA compliance, end-to-end encryption, and comprehensive audit trails.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    HIPAA compliant
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Audit trails
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Healthcare Leaders</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Join thousands of healthcare professionals who are transforming patient care with our AI-powered platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg opacity-90">Healthcare Providers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-lg opacity-90">Patients Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Healthcare?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join the revolution in healthcare analytics. Start your free trial today and experience the power of
              AI-driven sentiment analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Stethoscope className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Ascle Med</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transforming healthcare through intelligent sentiment analysis and AI-powered insights.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ascle Med. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float-random {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
          75% { transform: translateY(-15px) rotate(2deg); }
        }
        
        .animate-float-random {
          animation: float-random 8s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pageSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .page-transition {
          animation: pageSlideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
