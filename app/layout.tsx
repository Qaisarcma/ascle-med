import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3B82F6",
}

export const metadata: Metadata = {
  title: "HealthSentiment - AI-Powered Healthcare Analytics",
  description:
    "Transform healthcare with sentiment intelligence. Analyze patient emotions from text, voice, and interactions to improve care delivery with real-time insights and personalized recommendations.",
  keywords:
    "healthcare, sentiment analysis, AI, mental health, patient care, medical analytics, voice analysis, chatbot",
  authors: [{ name: "HealthSentiment Team" }],
  creator: "HealthSentiment",
  publisher: "HealthSentiment",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://healthsentiment.com",
    title: "HealthSentiment - AI-Powered Healthcare Analytics",
    description: "Transform healthcare with sentiment intelligence and AI-powered patient emotion analysis.",
    siteName: "HealthSentiment",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthSentiment - AI-Powered Healthcare Analytics",
    description: "Transform healthcare with sentiment intelligence and AI-powered patient emotion analysis.",
    creator: "@healthsentiment",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
