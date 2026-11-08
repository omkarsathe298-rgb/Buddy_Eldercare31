import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  User, 
  Globe, 
  Volume2, 
  Eye, 
  Trash2, 
  Save, 
  CheckCircle, 
  ShieldCheck,
  BrainCircuit,
  Plus
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, setLanguage, clearMessages } = useApp();

  const [name, setName] = useState(profile.name);
  const [caregiverPhone, setCaregiverPhone] = useState(profile.caregiverPhone || '');
  const [caregiverName, setCaregiverName] = useState(profile.emergencyContactName || '');
  const [voiceSpeed, setVoiceSpeed] = useState(profile.voiceSpeed || 0.9);
  const [newMemory, setNewMemory] = useState('');
  const [memories, setMemories] = useState<string[]>(profile.memories || []);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      caregiverPhone,
      emergencyContactName: caregiverName,
      voiceSpeed,
      memories
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addMemoryItem = () => {
    if (!newMemory.trim()) return;
    setMemories(prev => [...prev, newMemory.trim()]);
    setNewMemory('');
  };

  const removeMemoryItem = (idx: number) => {
    setMemories(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="w-8 h-8 text-slate-300" />
          <h1 className="text-3xl font-black">Accessibility & Profile Preferences</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl">
          Personalize Buddy Elder AI: customize your preferred greeting name, speech speed, font scale, long-term AI memory, and emergency caregiver phone numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          {saved && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center space-x-2 text-emerald-800 font-bold animate-in fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Preferences saved successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-slate-700 mb-1">
                Your Preferred Name / Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dada-ji, Uncle Ramesh, Grandma"
                className="w-full p-3.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-slate-700 mb-1">
                App Language
              </label>
              <select
                aria-label="App Language select"
                value={profile.language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-sky-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>
          </div>

          {/* Caregiver Contact Details */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-3">Caregiver & Emergency Contacts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Caregiver Contact Name
                </label>
                <input
                  type="text"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder="e.g. Rajesh (Son) or Sister Anita"
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-800 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Caregiver Phone (for Direct Call & SOS)
                </label>
                <input
                  type="text"
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-800 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Speech Speed slider */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-base font-bold text-slate-700 flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-sky-600" />
                <span>Voice Narration Speed (Slow & Clear)</span>
              </label>
              <span className="text-lg font-black text-sky-700">{voiceSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.2"
              step="0.1"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
              className="w-full accent-sky-600 h-3 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs font-bold text-slate-400 mt-1">
              <span>Very Slow (0.6x)</span>
              <span>Gentle (0.9x)</span>
              <span>Standard (1.0x)</span>
              <span>Fast (1.2x)</span>
            </div>
          </div>

          {/* Elderly Big Font Mode Toggle */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between p-4 bg-sky-50 rounded-2xl border border-sky-100">
            <div>
              <h4 className="font-black text-slate-800 text-lg">Elderly-Friendly High Readability Mode</h4>
              <p className="text-xs text-slate-600 mt-0.5">Enlarges fonts, increases button touch targets, and boosts contrast.</p>
            </div>
            <button
              type="button"
              onClick={() => updateProfile({ elderlyMode: !profile.elderlyMode })}
              className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                profile.elderlyMode ? 'bg-sky-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white shadow-md block" />
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-sky-200 cursor-pointer active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Preferences</span>
          </button>
        </form>

        {/* AI Long-term Memory & Privacy Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <BrainCircuit className="w-6 h-6 text-sky-600" />
              <h3 className="text-xl font-black text-slate-800">AI Long-Term Memory</h3>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              These are the personal preferences Buddy remembers to customize your conversations:
            </p>

            <div className="space-y-2">
              {memories.map((mem, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                  <span>{mem}</span>
                  <button
                    type="button"
                    onClick={() => removeMemoryItem(idx)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                placeholder="Add memory, e.g. Loves marigold flowers"
                className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
              <button
                type="button"
                onClick={addMemoryItem}
                className="p-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Privacy & History wipe */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-3">
            <h4 className="font-black text-slate-800 text-base">Privacy & Data Management</h4>
            <p className="text-xs text-slate-500">
              You own all your data. You can clear conversation history at any time.
            </p>
            <button
              type="button"
              onClick={() => {
                clearMessages();
                alert('Chat history cleared cleanly.');
              }}
              className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs border border-red-200 transition-colors cursor-pointer"
            >
              Clear Conversation History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
