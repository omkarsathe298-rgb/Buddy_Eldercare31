import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  Mic, 
  MessageSquare, 
  ShieldAlert, 
  GraduationCap, 
  HeartPulse, 
  ShieldCheck, 
  BellRing, 
  PhoneCall, 
  Sun, 
  Moon, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { speechController } from '../utils/speech';

export const HomeDashboard: React.FC = () => {
  const { profile, setActiveTab, t, reminders, toggleReminder, wellnessRecords, triggerEmergency, setIsSpeaking, lang } = useApp();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const hour = now.getHours();
      if (hour < 12) setGreeting(t.greetings.morning);
      else if (hour < 17) setGreeting(t.greetings.afternoon);
      else if (hour < 21) setGreeting(t.greetings.evening);
      else setGreeting(t.greetings.night);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [t]);

  const handleStartVoice = () => {
    setActiveTab('chat');
  };

  const speakGreeting = () => {
    setIsSpeaking(true);
    speechController.speak(greeting, lang, profile.voiceSpeed).finally(() => {
      setIsSpeaking(false);
    });
  };

  const latestWellness = wellnessRecords[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-sky-900/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1.5">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} • {currentTime}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
            {t.common.welcomeBack}, {profile.name}!
          </h1>

          <p className="text-lg sm:text-2xl text-sky-100 font-medium mb-6 leading-relaxed">
            {greeting}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={handleStartVoice}
              className="py-4 px-6 sm:px-8 bg-white hover:bg-sky-50 text-sky-800 font-black rounded-2xl shadow-lg flex items-center space-x-3 text-lg sm:text-xl active:scale-95 transition-all cursor-pointer"
            >
              <Mic className="w-7 h-7 text-sky-600 animate-pulse" />
              <span>{t.common.startVoice}</span>
            </button>

            <button
              onClick={speakGreeting}
              className="py-4 px-5 bg-sky-500/30 hover:bg-sky-500/50 text-white font-bold rounded-2xl border border-white/30 flex items-center space-x-2 text-base active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t.common.speakText}</span>
            </button>
          </div>
        </div>

        {/* Ambient background deco */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Action Cards Grid (60px+ touch targets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Chat / Companion */}
        <div 
          onClick={() => setActiveTab('chat')}
          className="bg-white rounded-3xl p-6 border-2 border-sky-100 hover:border-sky-300 shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">{t.nav.chat}</h3>
            <p className="text-sm font-semibold text-slate-500">{t.agents.companionDesc}</p>
          </div>
          <div className="mt-5 flex items-center text-sky-600 font-bold text-sm">
            <span>Talk with Buddy</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Digital Learning */}
        <div 
          onClick={() => setActiveTab('learning')}
          className="bg-white rounded-3xl p-6 border-2 border-emerald-100 hover:border-emerald-300 shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">{t.nav.learning}</h3>
            <p className="text-sm font-semibold text-slate-500">{t.agents.educationDesc}</p>
          </div>
          <div className="mt-5 flex items-center text-emerald-600 font-bold text-sm">
            <span>Learn Step-by-Step</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Daily Wellness */}
        <div 
          onClick={() => setActiveTab('wellness')}
          className="bg-white rounded-3xl p-6 border-2 border-rose-100 hover:border-rose-300 shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">{t.nav.wellness}</h3>
            <p className="text-sm font-semibold text-slate-500">
              {latestWellness ? `Logged today: ${latestWellness.mood} mood` : 'Quick 1-minute daily check-in for sleep & mood'}
            </p>
          </div>
          <div className="mt-5 flex items-center text-rose-600 font-bold text-sm">
            <span>{latestWellness ? 'View Wellness Log' : 'Start Check-in'}</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Scam Detector */}
        <div 
          onClick={() => setActiveTab('scamDetector')}
          className="bg-white rounded-3xl p-6 border-2 border-amber-100 hover:border-amber-300 shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">{t.nav.scamDetector}</h3>
            <p className="text-sm font-semibold text-slate-500">{t.agents.safetyDesc}</p>
          </div>
          <div className="mt-5 flex items-center text-amber-600 font-bold text-sm">
            <span>Check SMS or Link</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Content Split: Today's Routine Checklist & Safety/Family Call Shortcut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Activity & Reminders */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                <BellRing className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Today's Daily Checklist</h2>
            </div>
            <button
              onClick={() => setActiveTab('reminders')}
              className="text-sm font-bold text-sky-600 hover:text-sky-800 underline"
            >
              Manage Reminders
            </button>
          </div>

          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                onClick={() => toggleReminder(rem.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  rem.completed 
                    ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
                    : 'bg-white border-sky-100 hover:border-sky-300 shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    rem.completed ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${rem.completed ? 'text-slate-400' : 'text-slate-800'}`}>
                      {rem.title}
                    </p>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {rem.time}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600">
                  {rem.completed ? 'Done' : 'Tap to Complete'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Family & Emergency Quick Dial Card */}
        <div className="bg-gradient-to-br from-teal-50 to-sky-50 rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Family & Caregiver</h2>
            <p className="text-sm font-medium text-slate-600 mb-6">
              Your primary caregiver is connected for daily check-in reports and emergency notices.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs mb-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Authorized Caregiver
              </div>
              <div className="text-xl font-black text-slate-800">
                {profile.emergencyContactName || 'Family Member'}
              </div>
              <div className="text-sm font-semibold text-teal-700 mt-0.5">
                {profile.caregiverPhone || '+91 98765 43210'}
              </div>
            </div>

            <a
              href={`tel:${profile.caregiverPhone || '+919876543210'}`}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 shadow-md shadow-teal-200 text-lg cursor-pointer transition-all"
            >
              <PhoneCall className="w-6 h-6" />
              <span>Call Caregiver Now</span>
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-teal-200/60">
            <button
              onClick={() => triggerEmergency()}
              className="w-full py-3.5 bg-red-100 hover:bg-red-200 text-red-700 font-black rounded-2xl flex items-center justify-center space-x-2 border border-red-300 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Emergency SOS (112)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
