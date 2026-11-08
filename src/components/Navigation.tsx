import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  MessageSquareHeart, 
  GraduationCap, 
  Smartphone, 
  HeartPulse, 
  Activity, 
  ShieldCheck, 
  BellRing, 
  Users, 
  BookOpen, 
  Settings
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'chat', label: t.nav.chat, icon: MessageSquareHeart },
    { id: 'learning', label: t.nav.learning, icon: GraduationCap },
    { id: 'simulator', label: t.nav.simulator, icon: Smartphone },
    { id: 'wellness', label: t.nav.wellness, icon: HeartPulse },
    { id: 'fallSafety', label: t.nav.fallSafety, icon: Activity },
    { id: 'scamDetector', label: t.nav.scamDetector, icon: ShieldCheck },
    { id: 'reminders', label: t.nav.reminders, icon: BellRing },
    { id: 'caregiver', label: t.nav.caregiver, icon: Users },
    { id: 'knowledge', label: t.nav.knowledge, icon: BookOpen },
    { id: 'profile', label: t.nav.profile, icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-sky-100 shadow-xs sticky top-[69px] z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all duration-150 text-sm md:text-base cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-200 ring-2 ring-sky-400'
                    : 'bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
