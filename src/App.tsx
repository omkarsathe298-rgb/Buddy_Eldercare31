/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { EmergencyModal } from './components/EmergencyModal';
import { HomeDashboard } from './components/HomeDashboard';
import { ChatAgent } from './components/ChatAgent';
import { DigitalLearning } from './components/DigitalLearning';
import { PhoneSimulator } from './components/PhoneSimulator';
import { WellnessCenter } from './components/WellnessCenter';
import { FallSafety } from './components/FallSafety';
import { ScamDetector } from './components/ScamDetector';
import { SmartReminders } from './components/SmartReminders';
import { CaregiverPortal } from './components/CaregiverPortal';
import { KnowledgeHub } from './components/KnowledgeHub';
import { ProfileSettings } from './components/ProfileSettings';

const MainContent: React.FC = () => {
  const { activeTab, profile } = useApp();

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 transition-colors ${
      profile.elderlyMode ? 'text-[20px]' : 'text-[16px]'
    }`}>
      {/* Top Header */}
      <Header />

      {/* Navigation Bar */}
      <Navigation />

      {/* Emergency SOS Modal (Always available) */}
      <EmergencyModal />

      {/* Page Body Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'chat' && <ChatAgent />}
        {activeTab === 'learning' && <DigitalLearning />}
        {activeTab === 'simulator' && <PhoneSimulator />}
        {activeTab === 'wellness' && <WellnessCenter />}
        {activeTab === 'fallSafety' && <FallSafety />}
        {activeTab === 'scamDetector' && <ScamDetector />}
        {activeTab === 'reminders' && <SmartReminders />}
        {activeTab === 'caregiver' && <CaregiverPortal />}
        {activeTab === 'knowledge' && <KnowledgeHub />}
        {activeTab === 'profile' && <ProfileSettings />}
      </main>

      {/* Bottom Accessible Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs font-semibold text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Buddy Elder AI (बडी एल्डर एआई) • Designed with Love, Dignity & Safety for Seniors</span>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-600 font-bold">✓ Multi-Agent AI Active</span>
            <span className="text-sky-600 font-bold">✓ Voice Enabled</span>
            <span className="text-red-600 font-bold">✓ 112 SOS Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
