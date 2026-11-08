export interface UserProfile {
  id: string;
  name: string;
  role: 'senior' | 'caregiver' | 'admin';
  language: 'en' | 'hi' | 'mr';
  fontSize: 'normal' | 'large' | 'xlarge';
  voiceSpeed: number; // 0.8, 1.0, 1.2
  elderlyMode: boolean;
  highContrast: boolean;
  caregiverPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  memories?: string[];
  createdAt: string;
}

export type AgentType = 
  | 'companion' 
  | 'education' 
  | 'wellness' 
  | 'safety' 
  | 'caregiver';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  agent: AgentType;
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  audioBase64?: string;
}

export interface WellnessRecord {
  id: string;
  userId: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'tired' | 'unwell';
  sleepHours: number;
  sleepQuality: 'excellent' | 'restful' | 'fair' | 'poor';
  discomfortArea: string; // 'none', 'knees', 'back', 'head', 'general'
  waterGlasses: number;
  notes?: string;
  timestamp: string;
}

export interface FallExercise {
  id: string;
  title: string;
  titleHi: string;
  titleMr: string;
  description: string;
  instructions: string[];
  durationMinutes: number;
  difficulty: 'very-gentle' | 'gentle' | 'moderate';
  safetyWarning: string;
  benefits: string;
  iconName: string;
}

export interface LearningLesson {
  id: string;
  category: 'smartphones' | 'whatsapp' | 'calling' | 'payments' | 'security' | 'government';
  title: string;
  titleHi: string;
  titleMr: string;
  summary: string;
  summaryHi: string;
  summaryMr: string;
  steps: {
    stepNumber: number;
    title: string;
    instructions: string;
    tip?: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ScamAnalysisResult {
  riskLevel: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS' | 'UNABLE_TO_VERIFY';
  riskScore: number; // 0 to 100
  scamCategory: string; // e.g. "OTP Fraud", "Fake Bank KYC", "Lottery Scam", "None"
  warningSigns: string[];
  safeNextSteps: string[];
  verdictExplanation: string;
}

export interface EmergencyEvent {
  id: string;
  userId: string;
  timestamp: string;
  triggerType: 'sos_button' | 'voice_trigger' | 'fall_detected';
  status: 'initiated' | 'attempted_notification' | 'caregiver_alerted' | 'resolved';
  details: string;
  contactDialed?: string;
}

export interface SmartReminder {
  id: string;
  userId: string;
  title: string;
  time: string; // HH:mm format
  category: 'water' | 'exercise' | 'family' | 'learning' | 'appointment' | 'wellness';
  completed: boolean;
  frequency: 'daily' | 'weekdays' | 'once';
}

export interface RAGDocument {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  source: string;
}
