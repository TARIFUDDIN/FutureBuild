
🧠 AI-Powered Career Platform

A next-generation AI-driven career platform designed to revolutionize how professionals build resumes, prepare for interviews, and plan their career growth.
This platform integrates intelligent resume optimization, mock interviews, personalized learning paths, and multi-source job aggregation — all powered by cutting-edge AI.

🚀 Features
🎯 1. Intelligent Resume Builder

ATS-optimized resume creation with keyword and format guidance.

AI-powered resume scoring and gap detection for role-specific optimization.

Integrated cover letter generator customized for target positions.

🧑‍💼 2. Real-Time AI Mock Interviews

Conduct interactive mock interviews with real-time speech recognition using AssemblyAI.

Provides feedback, analytics, and improvement suggestions.

Simulates domain-specific interviews using Gemini AI.

🧩 3. Multi-Portal Job Scraper

Aggregates job listings from LinkedIn, Naukri, and Indeed.

Unified job dashboard with filters, saved searches, and application tracking.

Automates job application workflows and resume matching.

📈 4. Personalized Learning & Career Roadmaps

Tailored learning plans generated based on resume analysis and job trends.

AI-curated career progression recommendations.

Real-time market insights and salary trend analytics.

🗣️ 5. AI Voice Career Coach

Built with AssemblyAI for real-time speech-to-text and AWS Polly for voice synthesis.

Enables conversational career guidance and topic-based lectures.

Interactive sessions with performance tracking and recommendations.

🧰 Tech Stack
Layer	Technologies
Frontend	Next.js • JavaScript • Tailwind CSS • shadcn-ui
Backend & Database	Prisma ORM • NeonDB • Convex • Inngest
AI & APIs	Gemini API • AssemblyAI • AWS Polly
Authentication	Clerk
🧠 AI Capabilities

Gemini AI Integration: Personalized interview prep and guidance.

Resume Analyzer: Role-based score, ATS check, and keyword gap detection.

Voice AI Agent: Real-time speech understanding and conversational coaching.

Market Analytics Engine: Live salary and job market insights.

📊 Dashboard Highlights

📈 Salary Trends — visualize compensation data by role, location, and experience.

🧭 Career Insights — actionable analytics on emerging job roles and skills.

🗂️ Application Tracker — unified view of your job search and applications.

📚 Learning Recommendations — AI-curated resources to upskill efficiently.

⚙️ System Architecture
Frontend (Next.js + Tailwind)
         ↓
Backend (Convex + Prisma + Inngest)
         ↓
Database (NeonDB)
         ↓
AI Services (Gemini, AssemblyAI, AWS Polly)
         ↓
Auth & User Management (Clerk)

💡 Future Enhancements

🤝 Integration with Google Jobs API and Glassdoor Reviews.

🧠 AI career mentor chat powered by Gemini long-context reasoning.

📱 Mobile app version using React Native.

🧾 Exportable analytics reports for career planning.

⚡ Quick Start Guide

Follow these steps to set up and run the project locally.

🧩 Prerequisites

Make sure you have the following installed:

Node.js ≥ 18

npm or yarn

NeonDB database set up (or replace with your own Postgres URI)

Clerk account for authentication

Gemini API Key and AssemblyAI API Key

🛠️ Installation
# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/ai-career-platform.git

# 2️⃣ Navigate to the project folder
cd ai-career-platform

# 3️⃣ Install dependencies
npm install
# or
yarn install

⚙️ Environment Setup

Create a .env file in the project root and add the following environment variables:

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Database (NeonDB / PostgreSQL)
DATABASE_URL=your_neondb_connection_string

# AI & APIs
GEMINI_API_KEY=your_gemini_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
AWS_POLLY_ACCESS_KEY=your_aws_access_key
AWS_POLLY_SECRET_KEY=your_aws_secret_key

▶️ Run the App
# Development mode
npm run dev
# or
yarn dev


Visit 👉 http://localhost:3000
 to explore the app.

🧠 Build for Production
npm run build
npm start

🧾 Testing
npm run lint
npm test
🧑‍💻 Author

Tarifuddin Ahmed
🎓 Btech IT @ University Of Calcutta
💼 Passionate about AI, Web Development, and Career-Tech Innovation
🌐 LinkedIn
 • Portfolio
 • GitHub

📜 License

This project is released under the MIT License — free to use, modify, and distribute.

