# Buddy Elder AI (बडी एल्डर एआई)
## Full-Stack Multi-Agent AI Companion, Education, Wellness, and Safety Platform for Elderly Adults

Buddy Elder AI is an accessible, voice-first digital companion built specifically for senior citizens and their family caregivers. It empowers elderly people with friendly everyday conversations, step-by-step smartphone and digital literacy learning, gentle wellness check-ins, fall prevention mobility routines, cyber fraud/scam detection, and rapid 112 emergency assistance.

---

## 🌟 Key Highlights & Architecture

### 1. Central Multi-Agent Orchestrator
- **Buddy Companion Agent:** Warm, respectful, daily companion conversations, folklore, encouragement, and empathetic companionship.
- **Digital Education Agent:** Step-by-step smartphone, WhatsApp, video calling, and digital payment tutorials.
- **Wellness Agent:** Daily check-ins for mood, sleep quality, and hydration, with gentle mobility tips.
- **Safety & Scam Agent:** Real-time analysis of suspicious SMS, WhatsApp forwards, phishing links, and fake bank warnings.
- **Caregiver Support Agent:** Authorized summaries and notifications for family members with complete senior consent.

### 2. Elderly-Friendly Accessible Design
- **Minimum 20px default text** in Elderly Mode with high contrast.
- **60px+ touch targets** with accessible buttons and smooth responsive layouts.
- **Multilingual Support:** English, Hindi (हिंदी), and Marathi (मराठी).
- **Voice-First AI Assistant:** Web Speech API integration for speech-to-text voice input and adjustable-speed text-to-speech audio narration.
- **112 Emergency SOS Modal:** Direct one-tap connection to national emergency services and family caregivers.

### 3. Interactive Phone Simulator
- Practice sending WhatsApp messages, photos, voice notes, and video calls in a safe, risk-free sandbox environment without real transmissions.

### 4. Grounded RAG Knowledge Base
- Document-grounded answers citing verified senior digital literacy and mobility guidebooks.

---

## 🛠️ Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Backend:** Node.js, Express.js with Vite middleware
- **AI Engine:** Google Gemini API (`@google/genai` with `gemini-3.8-flash`)
- **Speech:** Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Data Persistence:** Server-backed data store with localStorage sync

---

## 🚀 Running the Project
```bash
npm install
npm run dev
```
The server will start on port `3000` with both backend API endpoints and frontend SPA running cohesively.
