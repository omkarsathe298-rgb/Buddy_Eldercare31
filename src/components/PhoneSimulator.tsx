import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, 
  Send, 
  Image, 
  Mic, 
  Video, 
  Phone, 
  Check, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export const PhoneSimulator: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'me' | 'family'; text: string; time: string; type?: 'text' | 'image' | 'voice' }>>([
    { sender: 'family', text: 'Hello Dadi! How are your knees feeling today? Did you drink warm water?', time: '10:00 AM', type: 'text' }
  ]);
  const [inputText, setInputText] = useState('');
  const [simulatedVoiceRecording, setSimulatedVoiceRecording] = useState(false);
  const [inCall, setInCall] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      sender: 'me' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text' as const
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate gentle family reply after 1.5 seconds
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'family',
          text: 'So lovely to receive your message! You did it completely on your own! ❤️',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        }
      ]);
    }, 1500);
  };

  const handleSendPhoto = () => {
    setMessages(prev => [
      ...prev,
      {
        sender: 'me',
        text: 'Sent a flower garden photo 🌸',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'image'
      }
    ]);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'family',
          text: 'What a beautiful flower photo from your garden! Thank you!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        }
      ]);
    }, 1500);
  };

  const handleSendVoiceNote = () => {
    setSimulatedVoiceRecording(true);
    setTimeout(() => {
      setSimulatedVoiceRecording(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'me',
          text: 'Voice message (0:08) 🎙️ "Namaste, having a good day!"',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'voice'
        }
      ]);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'family',
            text: 'I loved hearing your sweet voice! You speak so clearly!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
          }
        ]);
      }, 1500);
    }, 2000);
  };

  const resetSimulator = () => {
    setMessages([
      { sender: 'family', text: 'Hello Dadi! How are your knees feeling today? Did you drink warm water?', time: '10:00 AM', type: 'text' }
    ]);
    setInCall(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <Smartphone className="w-8 h-8 text-indigo-200" />
          <h1 className="text-3xl font-black">Interactive Phone Practice Sandbox</h1>
        </div>
        <p className="text-indigo-100 text-lg max-w-2xl">
          A completely safe practice phone where you cannot make any mistake! Practice tapping buttons, sending mock WhatsApp messages, photos, and video calls without disturbing anyone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Practice Instructions */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Practice Missions</span>
            </h3>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100">
                <span className="font-bold text-sky-800">Mission 1: Type a greeting</span>
                <p className="text-xs text-slate-600 mt-0.5">Click into the typing box on the phone screen and press Send.</p>
              </div>

              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100">
                <span className="font-bold text-teal-800">Mission 2: Send a sample Photo</span>
                <p className="text-xs text-slate-600 mt-0.5">Tap the camera icon inside the phone simulator below.</p>
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="font-bold text-rose-800">Mission 3: Try a simulated Video Call</span>
                <p className="text-xs text-slate-600 mt-0.5">Tap the Video camera icon at the top of the phone screen.</p>
              </div>
            </div>

            <button
              onClick={resetSimulator}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Practice Phone</span>
            </button>
          </div>

          <div className="p-5 bg-amber-50 rounded-3xl border border-amber-200 text-amber-900 flex items-start space-x-3">
            <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed">
              Safe Zone: Nothing here is sent over the real internet or costs any money. Feel free to tap whatever you like to build your confidence!
            </p>
          </div>
        </div>

        {/* Realistic Mobile Frame (Simulator) */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="w-full max-w-md bg-slate-900 rounded-[48px] p-4 shadow-2xl border-4 border-slate-700">
            {/* Phone Screen */}
            <div className="bg-slate-100 rounded-[38px] overflow-hidden flex flex-col h-[650px] relative">
              {/* Phone Status Bar */}
              <div className="bg-emerald-800 text-white px-6 py-2 flex items-center justify-between text-xs font-bold">
                <span>10:30 AM</span>
                <div className="w-20 h-4 bg-black/40 rounded-full mx-auto" />
                <span>4G • 98%</span>
              </div>

              {/* WhatsApp-style Header */}
              <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-lg">
                    👩
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-tight">Pooja (Granddaughter)</h4>
                    <span className="text-[11px] text-emerald-200 font-medium">online</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setInCall(true)}
                    className="p-2 hover:bg-emerald-600 rounded-full transition-colors cursor-pointer"
                    title="Simulate Video Call"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setInCall(true)}
                    className="p-2 hover:bg-emerald-600 rounded-full transition-colors cursor-pointer"
                    title="Simulate Phone Call"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Video Call Overlay if active */}
              {inCall ? (
                <div className="flex-1 bg-slate-900 p-6 flex flex-col justify-between items-center text-white animate-in zoom-in-95 duration-200">
                  <div className="text-center mt-6">
                    <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-5xl mx-auto shadow-xl ring-4 ring-teal-400">
                      👩
                    </div>
                    <h3 className="text-2xl font-black mt-3">Pooja (Granddaughter)</h3>
                    <p className="text-xs text-teal-300 font-bold mt-1 animate-pulse">
                      Connected • 00:24
                    </p>
                  </div>

                  <div className="p-4 bg-white/10 rounded-2xl text-center max-w-xs text-sm font-semibold">
                    "Hello Dadi! You look wonderful today! This video call is so clear!"
                  </div>

                  <button
                    onClick={() => setInCall(false)}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-xl cursor-pointer"
                    title="End Call"
                  >
                    <Phone className="w-8 h-8 rotate-[135deg]" />
                  </button>
                </div>
              ) : (
                /* Chat Messages area */
                <>
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5]/50">
                    <div className="text-center">
                      <span className="text-[10px] font-bold bg-white/70 px-3 py-1 rounded-full text-slate-600 shadow-xs">
                        TODAY
                      </span>
                    </div>

                    {messages.map((m, idx) => {
                      const isMe = m.sender === 'me';
                      return (
                        <div
                          key={idx}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-2xl shadow-xs text-sm ${
                            isMe 
                              ? 'bg-[#d9fdd3] text-slate-800 rounded-tr-xs' 
                              : 'bg-white text-slate-800 rounded-tl-xs'
                          }`}>
                            <p className="font-semibold text-base leading-snug">{m.text}</p>
                            <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-400">
                              <span>{m.time}</span>
                              {isMe && <Check className="w-3.5 h-3.5 text-sky-500" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {simulatedVoiceRecording && (
                      <div className="p-3 bg-red-50 rounded-2xl border border-red-300 flex items-center space-x-2 text-red-700 text-xs font-bold animate-pulse">
                        <span className="w-2 h-2 bg-red-600 rounded-full" />
                        <span>Recording voice note: "Namaste, having a good day..."</span>
                      </div>
                    )}
                  </div>

                  {/* Simulator Bottom Input Bar */}
                  <div className="p-2.5 bg-slate-200 flex items-center space-x-1.5">
                    <button
                      onClick={handleSendPhoto}
                      className="p-2.5 bg-white text-slate-600 hover:text-emerald-700 rounded-full shadow-xs cursor-pointer"
                      title="Send photo"
                    >
                      <Image className="w-5 h-5" />
                    </button>

                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-white px-3.5 py-2.5 rounded-full text-sm font-semibold text-slate-800 focus:outline-hidden shadow-xs"
                    />

                    {inputText.trim() ? (
                      <button
                        onClick={handleSendMessage}
                        className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSendVoiceNote}
                        className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer"
                        title="Hold/tap to send voice note"
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
