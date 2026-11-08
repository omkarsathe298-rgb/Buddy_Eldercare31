import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AgentType } from '../types';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Sparkles, 
  GraduationCap, 
  HeartPulse, 
  ShieldCheck, 
  HeartHandshake, 
  Users,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { speechController } from '../utils/speech';

export const ChatAgent: React.FC = () => {
  const { 
    messages, 
    addMessage, 
    clearMessages, 
    profile, 
    lang, 
    t, 
    isSpeaking, 
    setIsSpeaking, 
    triggerEmergency,
    setActiveTab 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentType | 'auto'>('auto');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    // Add user message
    addMessage({
      sender: 'user',
      agent: selectedAgent === 'auto' ? 'companion' : selectedAgent,
      text: text.trim()
    });
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          requestedAgent: selectedAgent,
          language: lang,
          userProfile: profile,
          conversationHistory: messages.slice(-5)
        })
      });

      const data = await res.json();
      if (data.isEmergency) {
        triggerEmergency('Emergency detected in conversation: ' + text);
      }

      addMessage({
        sender: 'assistant',
        agent: data.agent || 'companion',
        text: data.text || 'I am here with you.',
        suggestedActions: data.suggestedActions
      });

      // Auto-read response if speech synthesis is enabled or in voice flow
      if (data.text) {
        handleSpeakText(data.text);
      }

    } catch (err: any) {
      console.error('Chat error:', err);
      addMessage({
        sender: 'assistant',
        agent: 'companion',
        text: 'I am here with you. Please take your time, and tell me whenever you are ready.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakText = (text: string, msgId?: string) => {
    if (activeSpeechId === msgId && isSpeaking) {
      speechController.stopSpeaking();
      setIsSpeaking(false);
      setActiveSpeechId(null);
      return;
    }

    setIsSpeaking(true);
    if (msgId) setActiveSpeechId(msgId);

    speechController.speak(text, lang, profile.voiceSpeed).finally(() => {
      setIsSpeaking(false);
      setActiveSpeechId(null);
    });
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      speechController.stopListening();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    speechController.startListening(
      lang,
      (transcript) => {
        setIsRecording(false);
        if (transcript.trim()) {
          handleSendMessage(transcript);
        }
      },
      (error) => {
        console.warn('Speech error:', error);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );
  };

  const agentIcons: Record<AgentType, any> = {
    companion: HeartHandshake,
    education: GraduationCap,
    wellness: HeartPulse,
    safety: ShieldCheck,
    caregiver: Users
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] min-h-[580px] bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Top Bar with Agent Switcher */}
      <div className="p-4 sm:p-5 bg-sky-50/70 border-b border-sky-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-200">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Buddy Multi-Agent Chat
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Automatic intelligent routing across 5 specialized elder assistants
            </p>
          </div>
        </div>

        {/* Agent Select Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {[
            { id: 'auto', label: 'Auto Detect', icon: Sparkles },
            { id: 'companion', label: 'Companion', icon: HeartHandshake },
            { id: 'education', label: 'Digital Teacher', icon: GraduationCap },
            { id: 'wellness', label: 'Wellness', icon: HeartPulse },
            { id: 'safety', label: 'Scam Guard', icon: ShieldCheck }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedAgent === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedAgent(item.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={clearMessages}
            title="Clear Chat History"
            className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 ml-1 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const AgentIcon = agentIcons[msg.agent] || HeartHandshake;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                isUser 
                  ? 'bg-slate-700' 
                  : msg.agent === 'safety' ? 'bg-amber-600' : msg.agent === 'education' ? 'bg-emerald-600' : msg.agent === 'wellness' ? 'bg-rose-600' : 'bg-sky-600'
              }`}>
                {isUser ? (
                  <span className="font-black text-sm">YOU</span>
                ) : (
                  <AgentIcon className="w-6 h-6" />
                )}
              </div>

              {/* Message Bubble (Large readable typography) */}
              <div className={`max-w-[85%] sm:max-w-xl rounded-3xl p-4 sm:p-5 shadow-sm border ${
                isUser
                  ? 'bg-sky-600 text-white border-sky-500 rounded-tr-xs'
                  : 'bg-white text-slate-900 border-slate-200 rounded-tl-xs'
              }`}>
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-sky-700 flex items-center space-x-1">
                      <AgentIcon className="w-3.5 h-3.5" />
                      <span>{t.agents[msg.agent] || 'Buddy'}</span>
                    </span>
                    <button
                      onClick={() => handleSpeakText(msg.text, msg.id)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-1 bg-sky-50 px-2 py-1 rounded-lg cursor-pointer"
                      title="Read aloud"
                    >
                      {activeSpeechId === msg.id && isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <p className={`leading-relaxed whitespace-pre-wrap font-medium ${
                  profile.elderlyMode ? 'text-xl sm:text-2xl' : 'text-lg'
                }`}>
                  {msg.text}
                </p>

                {/* Suggested Follow-up Actions if any */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="text-xs sm:text-sm font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left"
                      >
                        👉 {action}
                      </button>
                    ))}
                  </div>
                )}

                <div className={`mt-2 text-right text-[11px] ${isUser ? 'text-sky-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3 text-slate-500 font-bold p-3 bg-white max-w-xs rounded-2xl border border-slate-200 animate-pulse">
            <Sparkles className="w-5 h-5 text-sky-600 animate-spin" />
            <span>Buddy is thinking for you...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice & Input Footer (Min 60px touch targets for elderly ease) */}
      <div className="p-3 sm:p-5 bg-white border-t border-slate-200">
        {/* Recording active banner */}
        {isRecording && (
          <div className="mb-3 p-3 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center justify-between text-red-700 animate-pulse">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
              <span className="font-extrabold text-base">Listening to your voice... Speak now!</span>
            </div>
            <button
              onClick={toggleVoiceRecording}
              className="text-xs font-black bg-red-600 text-white px-3 py-1.5 rounded-xl"
            >
              Finish & Send
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Giant Microphone Button */}
          <button
            onClick={toggleVoiceRecording}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-bold transition-all shadow-lg cursor-pointer shrink-0 ${
              isRecording 
                ? 'bg-red-600 ring-4 ring-red-300 scale-105' 
                : 'bg-gradient-to-tr from-sky-600 to-teal-600 hover:scale-105 active:scale-95 shadow-sky-200'
            }`}
            title="Speak into Microphone"
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          {/* Text Input with large readable styling */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.common.typeMessage}
              className="w-full h-14 sm:h-16 px-5 pr-14 rounded-2xl bg-slate-100 border-2 border-slate-200 focus:border-sky-500 focus:bg-white text-base sm:text-xl font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 w-11 h-11 sm:w-12 sm:h-12 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
              title="Send Message"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
