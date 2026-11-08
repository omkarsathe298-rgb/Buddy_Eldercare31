import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, WellnessRecord, SmartReminder, ChatMessage } from '../types';
import { translations } from '../utils/translations';

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  lang: 'en' | 'hi' | 'mr';
  t: typeof translations.en;
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  wellnessRecords: WellnessRecord[];
  addWellnessRecord: (record: Omit<WellnessRecord, 'id' | 'timestamp'>) => Promise<void>;
  reminders: SmartReminder[];
  toggleReminder: (id: string) => Promise<void>;
  addReminder: (rem: Omit<SmartReminder, 'id' | 'completed'>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  isSpeaking: boolean;
  setIsSpeaking: (v: boolean) => void;
  emergencyActive: boolean;
  setEmergencyActive: (v: boolean) => void;
  triggerEmergency: (reason?: string) => Promise<void>;
}

const defaultProfile: UserProfile = {
  id: 'user_primary',
  name: 'Dada-ji / Dada / Senior',
  role: 'senior',
  language: 'en',
  fontSize: 'large',
  voiceSpeed: 0.9,
  elderlyMode: true,
  highContrast: false,
  caregiverPhone: '+91 98765 43210',
  emergencyContactName: 'Family Caregiver',
  emergencyContactPhone: '+91 98765 43210',
  memories: [
    'Enjoys morning walks and birdsong',
    'Prefers step-by-step guidance for WhatsApp',
    'Takes gentle warm tea in the afternoon'
  ],
  createdAt: new Date().toISOString()
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('buddy_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('buddy_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        agent: 'companion',
        text: 'Hello dear friend! I am Buddy, your personal digital companion. How are you feeling today? Tap the microphone button below to talk to me with your voice, or tap any topic!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ['How is my wellness today?', 'How to send a WhatsApp photo', 'Check a suspicious message']
      }
    ];
  });

  const [wellnessRecords, setWellnessRecords] = useState<WellnessRecord[]>([]);
  const [reminders, setReminders] = useState<SmartReminder[]>([
    { id: 'rem_1', userId: 'user_primary', title: 'Drink a glass of warm water', time: '09:00 AM', category: 'water', completed: false, frequency: 'daily' },
    { id: 'rem_2', userId: 'user_primary', title: 'Seated ankle circles & gentle stretch', time: '11:00 AM', category: 'exercise', completed: true, frequency: 'daily' },
    { id: 'rem_3', userId: 'user_primary', title: 'Afternoon family check-in call', time: '04:30 PM', category: 'family', completed: false, frequency: 'daily' },
    { id: 'rem_4', userId: 'user_primary', title: 'Digital learning session (WhatsApp tips)', time: '06:00 PM', category: 'learning', completed: false, frequency: 'daily' }
  ]);

  // Load backend records on mount
  useEffect(() => {
    fetch('/api/wellness')
      .then(res => res.json())
      .then(data => {
        if (data.records && data.records.length > 0) {
          setWellnessRecords(data.records);
        }
      })
      .catch(() => {});

    fetch('/api/reminders')
      .then(res => res.json())
      .then(data => {
        if (data.reminders && data.reminders.length > 0) {
          setReminders(data.reminders);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('buddy_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('buddy_chat_history', JSON.stringify(messages));
  }, [messages]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const setLanguage = (newLang: 'en' | 'hi' | 'mr') => {
    updateProfile({ language: newLang });
  };

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: 'msg_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('buddy_chat_history');
  };

  const addWellnessRecord = async (record: Omit<WellnessRecord, 'id' | 'timestamp'>) => {
    try {
      const res = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      const data = await res.json();
      if (data.record) {
        setWellnessRecords(prev => [data.record, ...prev]);
      }
    } catch (e) {
      // Offline fallback
      const fallbackRec: WellnessRecord = {
        ...record,
        id: 'rec_' + Date.now(),
        timestamp: new Date().toISOString()
      };
      setWellnessRecords(prev => [fallbackRec, ...prev]);
    }
  };

  const toggleReminder = async (id: string) => {
    const target = reminders.find(r => r.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: nextCompleted } : r));
    try {
      await fetch(`/api/reminders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: nextCompleted })
      });
    } catch (e) {}
  };

  const addReminder = async (rem: Omit<SmartReminder, 'id' | 'completed'>) => {
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rem)
      });
      const data = await res.json();
      if (data.reminder) {
        setReminders(prev => [...prev, data.reminder]);
      }
    } catch (e) {
      const fallback: SmartReminder = {
        ...rem,
        id: 'rem_' + Date.now(),
        completed: false
      };
      setReminders(prev => [...prev, fallback]);
    }
  };

  const deleteReminder = async (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    try {
      await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  const triggerEmergency = async (reason = 'Emergency SOS Button Activated') => {
    setEmergencyActive(true);
    try {
      await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, details: reason })
      });
    } catch (e) {}
  };

  const lang = profile.language || 'en';
  const t = translations[lang] || translations.en;

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        lang,
        t,
        setLanguage,
        activeTab,
        setActiveTab,
        messages,
        addMessage,
        clearMessages,
        wellnessRecords,
        addWellnessRecord,
        reminders,
        toggleReminder,
        addReminder,
        deleteReminder,
        isSpeaking,
        setIsSpeaking,
        emergencyActive,
        setEmergencyActive,
        triggerEmergency
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
