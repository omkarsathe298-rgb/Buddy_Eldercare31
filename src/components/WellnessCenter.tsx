import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartPulse, 
  Smile, 
  Meh, 
  Frown, 
  Moon, 
  Droplet, 
  CheckCircle, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const WellnessCenter: React.FC = () => {
  const { wellnessRecords, addWellnessRecord, profile } = useApp();

  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'tired' | 'unwell'>('good');
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [sleepQuality, setSleepQuality] = useState<'excellent' | 'restful' | 'fair' | 'poor'>('restful');
  const [discomfortArea, setDiscomfortArea] = useState<string>('none');
  const [waterGlasses, setWaterGlasses] = useState<number>(6);
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addWellnessRecord({
      userId: profile.id,
      date: new Date().toISOString().split('T')[0],
      mood,
      sleepHours,
      sleepQuality,
      discomfortArea,
      waterGlasses,
      notes
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const moodEmojis: Record<string, { label: string; emoji: string }> = {
    great: { label: 'Joyful & Great', emoji: '🌟' },
    good: { label: 'Good & Calm', emoji: '😊' },
    okay: { label: 'Normal / Okay', emoji: '😐' },
    tired: { label: 'A Bit Tired', emoji: '🥱' },
    unwell: { label: 'Not Feeling Well', emoji: '🤕' }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <HeartPulse className="w-8 h-8" />
          <h1 className="text-3xl font-black">Daily Wellness & Health Check-in</h1>
        </div>
        <p className="text-rose-100 text-lg max-w-2xl">
          A gentle daily log of your mood, restful sleep, and hydration. This helps you and your caregiver notice daily wellness trends.
        </p>
        <p className="text-xs text-rose-200 mt-2 font-medium">
          * Note: This is an educational wellness diary and does not replace medical advice or clinical diagnosis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          {savedSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center space-x-3 text-emerald-800 animate-in fade-in">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <span className="font-bold text-lg">
                Your daily wellness check-in has been recorded successfully!
              </span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Question 1: Mood */}
            <div>
              <label className="block text-xl font-black text-slate-800 mb-3">
                1. How are you feeling today?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(moodEmojis).map(([key, item]) => {
                  const isSelected = mood === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMood(key as any)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-rose-500 bg-rose-50 shadow-md ring-2 ring-rose-200 scale-102' 
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-700 text-center">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2: Sleep */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-lg font-black text-slate-800 mb-2 flex items-center space-x-2">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <span>2. How did you sleep last night?</span>
                </label>
                <select
                  aria-label="Sleep quality selection"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value as any)}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 text-lg font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-500"
                >
                  <option value="excellent">Very Deep & Peaceful (Excellent)</option>
                  <option value="restful">Good & Restful</option>
                  <option value="fair">Fair / Woke up a few times</option>
                  <option value="poor">Restless / Poor sleep</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-black text-slate-800 mb-2">
                  Hours of Sleep
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 h-3 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <span className="text-2xl font-black text-rose-600 min-w-[70px]">
                    {sleepHours} hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Question 3: Physical Discomfort */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-lg font-black text-slate-800 mb-2">
                3. Are you experiencing any physical discomfort?
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: 'none', label: 'No discomfort (Feeling Good)' },
                  { id: 'knees', label: 'Knee or Joint Ache' },
                  { id: 'back', label: 'Back Stiffness' },
                  { id: 'head', label: 'Mild Headache' },
                  { id: 'general', label: 'General Fatigue' }
                ].map((item) => {
                  const isSelected = discomfortArea === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDiscomfortArea(item.id)}
                      className={`px-4 py-3 rounded-xl font-bold text-sm sm:text-base border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 4: Water glasses */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-lg font-black text-slate-800 mb-2 flex items-center space-x-2">
                <Droplet className="w-5 h-5 text-sky-500" />
                <span>Glasses of Water today</span>
              </label>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {[4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setWaterGlasses(num)}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl font-black text-base sm:text-lg border-2 transition-all cursor-pointer ${
                      waterGlasses === num
                        ? 'border-sky-500 bg-sky-500 text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-sky-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-base font-bold text-slate-700 mb-1">
                Optional Note for Caregiver or Diary
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Enjoyed walking in the garden this morning"
                className="w-full p-4 rounded-2xl border-2 border-slate-200 text-base font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-rose-200 cursor-pointer active:scale-98 transition-all"
            >
              Save Today's Check-in
            </button>
          </form>
        </div>

        {/* Recent History Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-rose-600" />
            <h3 className="text-xl font-black text-slate-800">Recent Records</h3>
          </div>

          <div className="space-y-4 max-h-[520px] overflow-y-auto">
            {wellnessRecords.length === 0 ? (
              <p className="text-slate-400 text-sm font-medium py-6 text-center">
                No check-ins recorded yet. Fill out the form to log your first record!
              </p>
            ) : (
              wellnessRecords.slice(0, 7).map((rec) => (
                <div key={rec.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{rec.date}</span>
                    <span className="text-xl">{moodEmojis[rec.mood]?.emoji || '😊'}</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-800">
                    Mood: {moodEmojis[rec.mood]?.label || rec.mood}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 flex items-center space-x-3">
                    <span>Sleep: {rec.sleepHours}h ({rec.sleepQuality})</span>
                    <span>Water: {rec.waterGlasses} glasses</span>
                  </div>
                  {rec.discomfortArea !== 'none' && (
                    <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                      Discomfort: {rec.discomfortArea}
                    </div>
                  )}
                  {rec.notes && (
                    <p className="text-xs italic text-slate-500 pt-1">"{rec.notes}"</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
