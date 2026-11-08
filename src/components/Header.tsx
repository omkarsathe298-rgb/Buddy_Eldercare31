import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  Globe, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { speechController } from '../utils/speech';

export const Header: React.FC = () => {
  const { profile, updateProfile, lang, setLanguage, t, triggerEmergency, isSpeaking, setIsSpeaking } = useApp();

  const handleStopSpeech = () => {
    speechController.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-200">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tight text-slate-800">
                {t.appName}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
                AI Elder Guardian
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden md:block">
              {t.subName}
            </p>
          </div>
        </div>

        {/* Global Controls: Audio, Language, Elderly Mode, SOS Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Audio Stop Button if speaking */}
          {isSpeaking && (
            <button
              onClick={handleStopSpeech}
              className="flex items-center space-x-1.5 px-3 py-2 bg-amber-100 text-amber-900 font-bold rounded-xl text-sm animate-pulse hover:bg-amber-200"
              title="Stop Speaking"
            >
              <VolumeX className="w-5 h-5 text-amber-700" />
              <span className="hidden sm:inline">Stop Audio</span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="relative flex items-center bg-slate-100 p-1 rounded-xl">
            <Globe className="w-4 h-4 text-slate-500 ml-1.5 mr-1" />
            <select
              aria-label="Language selection"
              value={lang}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-sm font-bold text-slate-700 cursor-pointer focus:outline-hidden pr-2 py-1"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          {/* Mode Switch (Elderly Mode Large Font / Normal) */}
          <button
            onClick={() => updateProfile({ elderlyMode: !profile.elderlyMode })}
            className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              profile.elderlyMode 
                ? 'bg-sky-100 border-sky-300 text-sky-800 shadow-xs' 
                : 'bg-white border-slate-200 text-slate-600'
            }`}
            title="Toggle Elderly Big Font Mode"
          >
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>{profile.elderlyMode ? 'Elderly Mode: ON' : 'Standard Mode'}</span>
          </button>

          {/* Prominent Emergency Help SOS Button */}
          <button
            onClick={() => triggerEmergency()}
            className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-lg shadow-red-200 hover:scale-105 active:scale-95 transition-all text-base border-2 border-red-500"
          >
            <ShieldAlert className="w-6 h-6 animate-bounce" />
            <span className="tracking-wide">{t.common.emergencySos}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
