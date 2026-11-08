import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  MapPin, 
  UserCheck 
} from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { emergencyActive, setEmergencyActive, profile, t } = useApp();

  if (!emergencyActive) return null;

  const handleCall112 = () => {
    window.location.href = 'tel:112';
  };

  const handleCallCaregiver = () => {
    if (profile.caregiverPhone) {
      window.location.href = `tel:${profile.caregiverPhone}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-red-500 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-red-100">
          <div className="flex items-center space-x-3 text-red-600">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center animate-bounce">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {t.common.emergencySos}
              </h2>
              <p className="text-sm font-semibold text-red-600">
                Help protocol initiated
              </p>
            </div>
          </div>
          <button
            onClick={() => setEmergencyActive(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
            title="Cancel"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Urgent Advice */}
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-lg font-bold text-red-900 leading-snug">
            If you have fallen or feel faint, please stay seated or lie safely. Do not rush.
          </p>
          <p className="text-sm text-red-700 mt-1">
            Tap either big button below to connect immediately.
          </p>
        </div>

        {/* Giant Emergency Action Buttons */}
        <div className="mt-6 space-y-4">
          <button
            onClick={handleCall112}
            className="w-full py-5 px-6 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-2xl flex items-center justify-center space-x-4 shadow-xl shadow-red-200 border-2 border-red-400 transition-all cursor-pointer"
          >
            <PhoneCall className="w-8 h-8 animate-pulse" />
            <div className="text-left">
              <div className="text-2xl font-black">Call 112 (National Emergency)</div>
              <div className="text-sm text-red-100 font-medium">Free, immediate police & ambulance dispatch in India</div>
            </div>
          </button>

          <button
            onClick={handleCallCaregiver}
            className="w-full py-5 px-6 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white rounded-2xl flex items-center justify-center space-x-4 shadow-xl shadow-teal-200 border-2 border-teal-400 transition-all cursor-pointer"
          >
            <UserCheck className="w-8 h-8" />
            <div className="text-left">
              <div className="text-2xl font-black">Call Caregiver ({profile.emergencyContactName || 'Family'})</div>
              <div className="text-sm text-teal-100 font-medium">{profile.caregiverPhone || '+91 98765 43210'}</div>
            </div>
          </button>
        </div>

        {/* Status acknowledgment */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Emergency log sent to server</span>
          </span>
          <button
            onClick={() => setEmergencyActive(false)}
            className="text-slate-600 hover:text-slate-900 font-bold underline"
          >
            I am safe now (Close SOS)
          </button>
        </div>
      </div>
    </div>
  );
};
