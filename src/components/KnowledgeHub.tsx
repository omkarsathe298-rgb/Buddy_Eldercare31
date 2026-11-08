import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  HelpCircle,
  Volume2
} from 'lucide-react';
import { speechController } from '../utils/speech';

export const KnowledgeHub: React.FC = () => {
  const { lang, profile, setIsSpeaking } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [ragResults, setRagResults] = useState<any[]>([]);
  const [groundedAnswer, setGroundedAnswer] = useState<string>('');

  useEffect(() => {
    handleSearch('');
  }, []);

  const handleSearch = async (queryToSearch: string) => {
    setSearching(true);
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToSearch })
      });
      const data = await res.json();
      setRagResults(data.matches || data.results || []);
      setGroundedAnswer(data.groundedAnswer || '');
    } catch (e) {
      console.error('RAG search error:', e);
    } finally {
      setSearching(false);
    }
  };

  const readAnswer = () => {
    if (!groundedAnswer) return;
    setIsSpeaking(true);
    speechController.speak(groundedAnswer, lang, profile.voiceSpeed).finally(() => {
      setIsSpeaking(false);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-8 h-8 text-sky-200" />
          <h1 className="text-3xl font-black">Elder Knowledge Hub & Grounded RAG</h1>
        </div>
        <p className="text-sky-100 text-lg max-w-2xl">
          Search our library of verified digital literacy, wellness, and cyber safety handbooks. Gemini synthesizes simple, grounded answers citing real senior guidebooks.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-6 h-6 text-slate-400 absolute left-4 top-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Ask anything, e.g. 'How to send a WhatsApp photo' or 'What is an OTP scam?'"
              className="w-full pl-13 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-sky-500 font-semibold text-slate-800 focus:outline-hidden text-base sm:text-lg"
            />
          </div>

          <button
            onClick={() => handleSearch(searchQuery)}
            disabled={searching}
            className="w-full sm:w-auto py-4 px-8 bg-sky-600 hover:bg-sky-700 text-white font-black text-lg rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all"
          >
            {searching ? 'Retrieving...' : 'Search Guides'}
          </button>
        </div>

        {/* Quick Question Prompts */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Try asking:</span>
          {[
            'How to send voice note in WhatsApp',
            'Can my electricity be disconnected via SMS?',
            'Safe exercises for knee stiffness'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => { setSearchQuery(prompt); handleSearch(prompt); }}
              className="text-xs font-bold bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Grounded AI Answer if available */}
      {groundedAnswer && (
        <div className="bg-sky-50 border-2 border-sky-300 rounded-3xl p-6 sm:p-8 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-sky-200">
            <div className="flex items-center space-x-2 text-sky-800">
              <Sparkles className="w-6 h-6 text-sky-600" />
              <h3 className="text-xl font-black">Grounded Guidebook Answer</h3>
            </div>
            <button
              onClick={readAnswer}
              className="px-4 py-2 bg-white hover:bg-sky-100 text-sky-800 font-bold rounded-xl flex items-center space-x-2 text-sm shadow-xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>Read Aloud</span>
            </button>
          </div>

          <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed whitespace-pre-line">
            {groundedAnswer}
          </p>

          <div className="pt-2 text-xs font-bold text-sky-700">
            ✓ Fact-checked from verified senior digital literacy handbooks.
          </div>
        </div>
      )}

      {/* Verified Document Articles */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Verified Guidebook Articles:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ragResults.map((doc: any) => (
            <div key={doc.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-black text-sky-600 uppercase tracking-wider mb-2">
                  <FileText className="w-4 h-4" />
                  <span>{doc.category}</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">
                  {doc.summary}
                </p>
                <div className="p-3 bg-slate-50 rounded-2xl text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {doc.content}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-400">
                Source: {doc.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
