# HealthSentiment - AI-Powered Healthcare Analytics

Transform healthcare with sentiment intelligence. Analyze patient emotions from text, voice, and interactions to improve care delivery with real-time insights and personalized recommendations.

![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📋 Overview

HealthSentiment is a comprehensive healthcare analytics platform that leverages artificial intelligence and sentiment analysis to understand patient emotions and improve healthcare outcomes. The platform analyzes patient interactions through multiple channels including text, voice, and behavioral data to provide actionable insights for healthcare providers.

## ✨ Features

### Core Features

- **🤖 AI Chatbot**: Intelligent conversational AI for patient interactions and health queries
- **🎤 Voice Analysis**: Analyze patient sentiment and emotional states from voice data
- **📊 Sentiment Analysis**: Real-time sentiment detection from patient feedback and communications
- **📱 Mood Logging**: Track patient mood patterns and emotional wellness over time
- **🏥 Public Health Monitoring**: Monitor health trends and public health metrics across regions
- **🎮 EmoiPets**: Gamified emotional wellness companion system
- **🧠 CBT Tools**: Cognitive Behavioral Therapy tools and exercises
- **📈 Dashboard**: Comprehensive analytics dashboard with real-time insights

### Advanced Capabilities

- Multi-modal sentiment analysis (text, voice, behavioral)
- Predictive health alerts and recommendations
- Regional and demographic health trend analysis
- Patient emotion tracking and mental health insights
- Integration with healthcare workflows
- Real-time data processing and analytics

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14.2.16
- **Language**: TypeScript 5
- **UI Library**: React 18
- **Styling**:
  - Tailwind CSS 3.4.17
  - Tailwind Merge
  - Tailwind CSS Animate
- **Component Library**: Radix UI
- **Icons**: Lucide React
- **Charting**: Recharts
- **Form Management**: React Hook Form + Zod
- **Notifications**: Sonner Toasts
- **Theme Management**: Next-Themes
- **Date Handling**: date-fns

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Port**: 5000 (default)

### Development Tools

- **Package Manager**: pnpm
- **Build System**: Next.js (Webpack)
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint (with Next.js config)

## 📁 Project Structure

```
ascle-med/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── chatbot/             # Chatbot API endpoint
│   │   ├── public-health/       # Public health monitoring API
│   │   ├── sentiment-analysis/  # Sentiment analysis API
│   │   └── voice-analysis/      # Voice analysis API
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── cbt-tools/               # CBT tools page
│   ├── chatbot/                 # Chatbot interface
│   ├── dashboard/               # Main dashboard
│   ├── emotipets/               # EmoiPets gamification
│   ├── mood-logging/            # Mood tracking
│   ├── public-health/           # Public health monitoring
│   ├── voice-analysis/          # Voice analysis interface
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   ├── ui/                      # UI component library (Radix UI)
│   ├── animated-dog.tsx         # Animated mascot component
│   ├── page-transition.tsx      # Page transition effects
│   └── theme-provider.tsx       # Theme provider
├── lib/                         # Utility functions
│   └── utils.ts                 # Helper utilities
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
├── backend/                     # Backend server
│   ├── config/                  # Configuration
│   │   └── db.js               # Database configuration
│   ├── controllers/             # Route controllers
│   │   └── userControllers.js   # User management
│   ├── models/                  # Data models
│   │   └── User.js             # User model
│   ├── routes/                  # API routes
│   │   └── userRoutes.js       # User routes
│   ├── server.js               # Express server
│   └── package.json            # Backend dependencies
├── frontend/                    # Duplicate frontend structure (legacy)
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Frontend dependencies
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm (or npm/yarn)
- MongoDB (for backend)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Karthikashanmugam05/ascle-med.git
cd ascle-med
```

2. **Install frontend dependencies**

```bash
pnpm install
```

3. **Install backend dependencies** (if running backend separately)

```bash
cd backend
pnpm install
cd ..
```

4. **Configure environment variables**
   Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/healthsentiment
```

### Running the Application

#### Development Mode

```bash
# Frontend (runs on http://localhost:3000)
pnpm dev

# Backend (in another terminal, runs on http://localhost:5000)
cd backend
npm start
```

#### Production Build

```bash
# Build the frontend
pnpm build

# Start production server
pnpm start
```

## 📡 API Endpoints

### Chatbot API

**Endpoint**: `POST /api/chatbot`

- Handles conversational AI interactions
- Processes patient queries and provides health insights

### Sentiment Analysis API

**Endpoint**: `POST /api/sentiment-analysis`

- Analyzes text sentiment from patient feedback
- Returns sentiment scores (positive, negative, neutral)

### Voice Analysis API

**Endpoint**: `POST /api/voice-analysis`

- Processes audio data for emotion detection
- Analyzes tone, stress levels, and emotional indicators

### Public Health Monitoring API

**Endpoint**: `GET /api/public-health`

- Query parameters: `region`, `timeframe`, `topic`
- Returns regional health trends and public health metrics
- Aggregates data from multiple sources

**Example Request**:

```bash
curl "http://localhost:3000/api/public-health?region=north-america&timeframe=30d&topic=mental-health"
```

## 🎨 UI Components

The project includes a comprehensive component library built with Radix UI:

- **Form Components**: Input, Textarea, Select, Checkbox, Radio, Toggle
- **Layout**: Card, Alert, Dialog, Drawer, Sidebar, Sheet
- **Data Display**: Table, Pagination, Badge, Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu
- **Interactive**: Tabs, Accordion, Collapsible, Dropdown Menu, Popover

## 🔧 Configuration

### Next.js Configuration (`next.config.mjs`)

- Image optimization disabled for unoptimized images
- TypeScript strict mode enabled (ignoring build errors)
- Optimized for production builds

### Tailwind CSS Configuration (`tailwind.config.ts`)

- Dark mode support with class strategy
- Custom color scheme (HSL-based for flexibility)
- Extended animations and utilities

### TypeScript Configuration (`tsconfig.json`)

- Strict type checking enabled
- Path aliases configured (`@/*` for imports)
- ES2020+ target with module interop

## 🔐 Authentication

User authentication is handled through:

- Login page: `/auth/login`
- Registration page: `/auth/register`
- Backend user management in `/backend/controllers/userControllers.js`
- MongoDB user model: `/backend/models/User.js`

## 📊 Data Models

### User Model

- User identification and credentials
- Health profile information
- Preferences and settings
- Timestamp tracking

## 🏗️ Building for Production

1. **Build the application**

```bash
pnpm build
```

2. **Run production server**

```bash
pnpm start
```

3. **Build output location**: `.next/` directory

## 📈 Performance Features

- Static site generation for optimal performance
- Dynamic route handling for personalized content
- Optimized image loading (unoptimized for healthcare data)
- Efficient TypeScript compilation
- Responsive design for all devices

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For support, email support@healthsentiment.com or open an issue on GitHub.

## 🔮 Future Enhancements

- [ ] Integration with electronic health records (EHR) systems
- [ ] Advanced AI models for predictive health analytics
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time patient monitoring dashboard
- [ ] Integration with wearable devices
- [ ] Enhanced security and HIPAA compliance
- [ ] Advanced data visualization and reporting

## 📚 Documentation

For detailed documentation on specific features, see:

- [API Documentation](./docs/API.md) (coming soon)
- [Component Library](./docs/COMPONENTS.md) (coming soon)
- [Deployment Guide](./docs/DEPLOYMENT.md) (coming soon)

---

**Built with ❤️ by the HealthSentiment Team**

Last Updated: January 28, 2026
