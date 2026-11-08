import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  ShieldCheck, 
  PhoneCall, 
  HeartHandshake, 
  Calendar, 
  Clock, 
  Activity, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Lock
} from 'lucide-react';

export const CaregiverPortal: React.FC = () => {
  const { profile, wellnessRecords, reminders } = useApp();
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/emergency')
      .then(res => res.json())
      .then(data => {
        if (data.emergencies) {
          setEmergencies(data.emergencies);
        }
      })
      .catch(() => {});
  }, []);

  const latestWellness = wellnessRecords[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="w-8 h-8 text-teal-200" />
          <h1 className="text-3xl font-black">Family & Caregiver Bridge Portal</h1>
        </div>
        <p className="text-teal-100 text-lg max-w-2xl">
          Authorized family dashboard to stay updated on daily wellness check-ins, hydration, safety alerts, and routine completion with full senior consent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Senior Profile & Emergency Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-xl">
                👴
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">{profile.name}</h3>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  Active Senior Profile
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Primary Caregiver:</span>
                <span className="font-bold text-slate-800">{profile.emergencyContactName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Caregiver Phone:</span>
                <span className="font-bold text-teal-700">{profile.caregiverPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Preferred Language:</span>
                <span className="font-bold text-slate-800 uppercase">{profile.language}</span>
              </div>
            </div>

            <a
              href={`tel:${profile.caregiverPhone || '+919876543210'}`}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl flex items-center justify-center space-x-2 text-base shadow-md cursor-pointer transition-all"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call Senior Directly</span>
            </a>
          </div>

          {/* Privacy & Consent Badge */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-slate-700 font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Privacy & Consent Controls Active</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              In accordance with ethical AI eldercare guidelines, all information shared here has been explicitly granted by the senior user. No intrusive tracking or surveillance is permitted.
            </p>
          </div>
        </div>

        {/* Daily Wellness & Routine Report */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <h2 className="text-2xl font-black text-slate-800">Latest Wellness Summary</h2>

            {latestWellness ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-bold text-rose-600 uppercase">Today's Mood</span>
                  <div className="text-2xl font-black text-rose-900 mt-1 capitalize">
                    {latestWellness.mood}
                  </div>
                  <span className="text-xs text-rose-700">Self-reported check-in</span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <span className="text-xs font-bold text-indigo-600 uppercase">Sleep Quality</span>
                  <div className="text-2xl font-black text-indigo-900 mt-1 capitalize">
                    {latestWellness.sleepHours} hrs
                  </div>
                  <span className="text-xs text-indigo-700">{latestWellness.sleepQuality} sleep</span>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                  <span className="text-xs font-bold text-sky-600 uppercase">Hydration Log</span>
                  <div className="text-2xl font-black text-sky-900 mt-1">
                    {latestWellness.waterGlasses} glasses
                  </div>
                  <span className="text-xs text-sky-700">Warm water tracked</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 font-medium">No check-in recorded yet for today.</p>
            )}

            {/* Today's Checklist Progress */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-3">Today's Activities</h3>
              <div className="space-y-2">
                {reminders.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                    <span className={`font-bold ${r.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {r.title} ({r.time})
                    </span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-md ${
                      r.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Log History */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Recent Safety & Emergency Events</span>
              </h3>

              {emergencies.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 flex items-center space-x-2 text-sm font-bold">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>No emergency alerts triggered. Everything is peaceful!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {emergencies.slice(0, 3).map((emg: any) => (
                    <div key={emg.id} className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-sm">
                      <div className="flex items-center justify-between font-bold">
                        <span>Trigger: {emg.triggerType}</span>
                        <span className="text-xs text-red-600">{new Date(emg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-red-700 mt-1">{emg.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
