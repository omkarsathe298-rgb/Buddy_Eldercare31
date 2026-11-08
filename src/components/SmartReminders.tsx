import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BellRing, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Droplet, 
  Activity, 
  Phone, 
  GraduationCap, 
  Heart,
  Volume2
} from 'lucide-react';
import { speechController } from '../utils/speech';

export const SmartReminders: React.FC = () => {
  const { reminders, toggleReminder, addReminder, deleteReminder, lang, profile, setIsSpeaking } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newCategory, setNewCategory] = useState<'water' | 'exercise' | 'family' | 'learning' | 'wellness'>('water');
  const [showAddForm, setShowAddForm] = useState(false);

  const categoryIcons: Record<string, any> = {
    water: Droplet,
    exercise: Activity,
    family: Phone,
    learning: GraduationCap,
    wellness: Heart
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addReminder({
      userId: profile.id,
      title: newTitle.trim(),
      time: newTime,
      category: newCategory,
      frequency: 'daily'
    });

    setNewTitle('');
    setShowAddForm(false);
  };

  const readSchedule = () => {
    setIsSpeaking(true);
    const pending = reminders.filter(r => !r.completed);
    let speechText = `You have ${pending.length} pending reminders for today. `;
    pending.forEach(r => {
      speechText += `At ${r.time}, ${r.title}. `;
    });
    speechController.speak(speechText, lang, profile.voiceSpeed).finally(() => {
      setIsSpeaking(false);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <BellRing className="w-8 h-8 text-sky-200" />
          <h1 className="text-3xl font-black">Daily Schedule & Smart Reminders</h1>
        </div>
        <p className="text-sky-100 text-lg max-w-2xl">
          Keep your day peaceful and organized with gentle prompts for drinking warm water, stretching, family calls, and quiet rest.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Today's Routine</h2>
            <p className="text-sm font-semibold text-slate-500">
              Tap any item to check it off once completed.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={readSchedule}
              className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-2xl flex items-center space-x-2 text-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>Read Aloud</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-2xl flex items-center space-x-2 text-sm shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Close' : 'Add Reminder'}</span>
            </button>
          </div>
        </div>

        {/* Add Reminder Inline Form */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="p-6 bg-slate-50 border-2 border-sky-200 rounded-3xl space-y-4 animate-in fade-in">
            <h3 className="text-lg font-black text-slate-800">Add a New Daily Reminder</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Reminder Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Afternoon warm tea or Call Grandson"
                  className="w-full p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="04:00 PM"
                  className="w-full p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
              <div className="flex flex-wrap gap-2">
                {(['water', 'exercise', 'family', 'learning', 'wellness'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      newCategory === cat
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-md cursor-pointer"
            >
              Save Reminder
            </button>
          </form>
        )}

        {/* Reminders List with large touch buttons */}
        <div className="space-y-3">
          {reminders.map((rem) => {
            const Icon = categoryIcons[rem.category] || BellRing;
            return (
              <div
                key={rem.id}
                className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                  rem.completed 
                    ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
                    : 'bg-white border-sky-100 hover:border-sky-300 shadow-xs'
                }`}
              >
                <div 
                  onClick={() => toggleReminder(rem.id)}
                  className="flex items-center space-x-4 cursor-pointer flex-1"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    rem.completed ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-6 h-6 fill-current" />
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sky-700 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className={`font-black text-lg sm:text-xl ${rem.completed ? 'text-slate-400' : 'text-slate-800'}`}>
                      {rem.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{rem.time} • Daily</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-2 text-slate-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors ml-2 cursor-pointer"
                  title="Delete reminder"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
