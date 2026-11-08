import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Info,
  HelpCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

export const ScamDetector: React.FC = () => {
  const { profile } = useApp();
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const sampleScams = [
    {
      title: 'Electricity Bill Disconnection SMS',
      text: 'Dear Consumer, Your electricity power will be disconnected tonight at 9:30 PM because previous month bill was not updated. Please immediately call Electricity Officer on 98234-XXXXX or download BijliUpdate.apk',
    },
    {
      title: 'Lottery / KBC Reward WhatsApp',
      text: 'Congratulations! Your mobile number won 25,00,000 INR lottery in special KBC lucky draw. To claim transfer, send your Aadhaar card and transfer fee Rs 2500 via Google Pay to manager.',
    },
    {
      title: 'Bank KYC / Account Blocked SMS',
      text: 'Alert: Your SBI / HDFC Bank netbanking is blocked due to expired KYC. Click http://bank-kyc-verify-login.xyz/update to verify your PAN card and submit OTP immediately.',
    }
  ];

  const handleAnalyze = async (sample?: string) => {
    const textToCheck = sample || inputText;
    if (!textToCheck.trim() && !inputUrl.trim()) return;

    if (sample) {
      setInputText(sample);
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/scam-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToCheck,
          url: inputUrl
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      console.error('Scam check error:', e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <ShieldAlert className="w-8 h-8 text-amber-200" />
          <h1 className="text-3xl font-black">AI Scam & Fraud Detection Center</h1>
        </div>
        <p className="text-amber-100 text-lg max-w-2xl">
          Received a strange SMS, WhatsApp forward, or suspicious link? Paste it here. Our AI Scam Guard will inspect it for warning signs and tell you what to do safely.
        </p>
        <p className="text-xs text-amber-200 mt-2 font-bold">
          * Golden Rule: Real banks and government offices NEVER ask for your OTP or UPI PIN!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input & Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div>
            <label className="block text-xl font-black text-slate-800 mb-2">
              Paste the Suspicious SMS or Message here:
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., 'Dear customer, your bank account is blocked. Click here to verify...' or paste any WhatsApp forward."
              className="w-full p-4 rounded-2xl border-2 border-slate-200 text-base sm:text-lg text-slate-800 focus:border-amber-500 focus:outline-hidden bg-slate-50 focus:bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-base font-bold text-slate-700 mb-1">
              Optional: Suspicious Website Link (URL)
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. http://unknown-site.xyz/update"
              className="w-full p-3.5 rounded-2xl border-2 border-slate-200 text-base text-slate-800 focus:border-amber-500 focus:outline-hidden bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleAnalyze()}
              disabled={analyzing || (!inputText.trim() && !inputUrl.trim())}
              className="py-4 px-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-black text-lg rounded-2xl shadow-lg shadow-amber-200 cursor-pointer active:scale-98 transition-all flex items-center space-x-2"
            >
              <Search className="w-6 h-6" />
              <span>{analyzing ? 'Inspecting with AI...' : 'Analyze Message Now'}</span>
            </button>

            {inputText && (
              <button
                onClick={() => { setInputText(''); setInputUrl(''); setResult(null); }}
                className="py-4 px-5 text-slate-500 font-bold hover:text-slate-800 rounded-2xl hover:bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>

          {/* Analysis Results Display */}
          {result && (
            <div className={`mt-6 p-6 rounded-3xl border-2 space-y-4 animate-in zoom-in-95 duration-200 ${
              result.riskLevel === 'DANGEROUS'
                ? 'bg-red-50 border-red-300 text-red-950'
                : result.riskLevel === 'SUSPICIOUS'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-current/20">
                <div className="flex items-center space-x-3">
                  {result.riskLevel === 'DANGEROUS' ? (
                    <XCircle className="w-8 h-8 text-red-600" />
                  ) : result.riskLevel === 'SUSPICIOUS' ? (
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  )}
                  <div>
                    <h3 className="text-2xl font-black">
                      Verdict: {result.riskLevel}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                      Category: {result.scamCategory} • Risk Score: {result.riskScore}/100
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-lg font-bold leading-relaxed">
                {result.verdictExplanation}
              </p>

              {/* Warning signs */}
              {result.warningSigns && result.warningSigns.length > 0 && (
                <div className="space-y-1">
                  <div className="font-black text-sm uppercase">Red Flag Warning Signs:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm font-semibold">
                    {result.warningSigns.map((sign: string, idx: number) => (
                      <li key={idx}>{sign}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safe next steps */}
              {result.safeNextSteps && result.safeNextSteps.length > 0 && (
                <div className="pt-2 border-t border-current/10 space-y-1">
                  <div className="font-black text-sm uppercase">Safe Next Steps for You:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm font-semibold">
                    {result.safeNextSteps.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Examples of Common Senior Scams */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Info className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-black text-slate-800">Test Common Scam Examples</h3>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Tap any realistic example below to immediately see how Buddy evaluates it:
          </p>

          <div className="space-y-3">
            {sampleScams.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => handleAnalyze(sample.text)}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer group"
              >
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-800 flex items-center justify-between">
                  <span>{sample.title}</span>
                  <span className="text-xs text-amber-600 font-bold">Try →</span>
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  "{sample.text}"
                </p>
              </div>
            ))}
          </div>

          {/* National Cyber Helpline card */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 mt-6">
            <h4 className="font-black text-sm uppercase">Cyber Crime Helpline (India)</h4>
            <p className="text-xs mt-1 font-medium">
              If money was accidentally sent or deducted from your account, immediately dial:
            </p>
            <div className="text-2xl font-black text-red-700 mt-1">
              📞 1930
            </div>
            <p className="text-[11px] text-red-600 font-bold mt-1">
              Available 24x7 for financial cyber fraud freeze.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
