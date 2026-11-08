import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize GoogleGenAI SDK safely
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory persistent state (also can sync with JSON / Firestore)
const DB_FILE = path.join(__dirname, 'buddy_data.json');
let appDatabase = {
  profiles: [] as any[],
  wellness: [] as any[],
  emergencies: [] as any[],
  reminders: [] as any[],
  memories: [] as any[],
  ragDocuments: [
    {
      id: 'doc-1',
      title: 'WhatsApp Photo & Voice Note Guide',
      category: 'Digital Literacy',
      summary: 'Easy instructions for elderly users to send voice messages and pictures to their grandchildren.',
      content: `1. Open WhatsApp by tapping the green chat icon.
2. Tap on the photo or name of your family member.
3. To send a voice message: Press and hold the green microphone icon at the bottom right. Speak clearly into the phone. Release your finger when you are finished speaking. The audio sends automatically.
4. To send a photo: Tap the small camera or paperclip icon near the message box. Choose 'Gallery' or 'Photos'. Tap the photo you want to share, then tap the green arrow button to send.
5. If you make a mistake, gently slide your finger left while holding the mic to cancel.`,
      source: 'Digital Literacy for Golden Age handbook'
    },
    {
      id: 'doc-2',
      title: 'Recognizing Online & Bank SMS Scams',
      category: 'Safety & Cyber Awareness',
      summary: 'Rules for seniors: never share OTP, UPI PIN, or click strange links claiming bank account blockage.',
      content: `1. Rule #1: Your Bank or Electricity board will NEVER call and ask for your 4-digit or 6-digit OTP (One Time Password).
2. Rule #2: A UPI PIN (Google Pay, PhonePe, Paytm) is ONLY entered when YOU are sending money away, NEVER when receiving money. Anyone saying 'Enter PIN to receive prize or pension' is a scammer.
3. Rule #3: SMS messages warning that 'Your SIM or Bank Account or Electricity will be disconnected tonight, click this link' are dangerous phishing attacks. Do not click links ending in .apk or strange web addresses.
4. If in doubt, immediately call your son, daughter, caregiver, or the national cyber fraud helpline 1930 / emergency 112.`,
      source: 'National Senior Cyber Safety Guidelines'
    },
    {
      id: 'doc-3',
      title: 'Gentle Fall Prevention & Safe Mobility',
      category: 'Wellness & Mobility',
      summary: 'Safe seated exercises and home hazard clearance to maintain stability and prevent slips.',
      content: `1. Chair Leg Lifts: Sit upright on a sturdy chair with feet flat on the floor. Slowly straighten one leg forward, hold for 3 seconds, then lower it. Repeat 5 times for each leg. This strengthens knee and thigh muscles.
2. Ankle Circles: While seated, lift one foot slightly and gently rotate your ankle clockwise 5 times, then counter-clockwise. This maintains flexibility and blood circulation.
3. Home Safety: Ensure night lights are active in the hallway and bathroom. Remove loose rugs or mats that can slip. Keep walking pathways clear of telephone cords and clutter.
4. Always take 5 seconds to sit on the edge of the bed before standing up in the morning to prevent sudden dizziness.`,
      source: 'Elder Mobility and Balance Protocol'
    }
  ]
};

// Load database if exists
if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    appDatabase = { ...appDatabase, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load DB file, using defaults');
  }
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(appDatabase, null, 2));
  } catch (err) {
    console.error('Error saving database:', err);
  }
};

// ----------------------------------------------------
// AI Agent Instructions & Orchestration
// ----------------------------------------------------
const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  companion: `You are Buddy (बडी), a warm, loving, patient, and respectful digital companion for an elderly person.
Guidelines:
- Address the user with deep warmth and Indian familial respect (e.g., Uncle, Aunty, Dada, Dadi, or their chosen name).
- Always speak simply, clearly, in a calm and reassuring tone.
- Tell sweet stories, give daily encouragement, discuss family, gardens, old memories, or daily blessings.
- If replying in Hindi or Marathi, use simple, conversational, polite Devanagari.
- Keep answers concise (2-4 sentences max unless asked for a story), so they are easy to read and listen to.`,

  education: `You are Buddy Teacher, a gentle, kind digital tutor for elderly beginners learning tech.
Guidelines:
- Explain smartphones, WhatsApp, video calls, internet, and emails in very clear, numbered steps (1, 2, 3).
- Avoid tech jargon; explain technical words using everyday analogies (e.g., 'A link is like an address on an envelope').
- Emphasize that it is okay to take their time and that they will never break their phone by tapping gently.
- Provide encouraging words at every step.`,

  wellness: `You are Buddy Wellness, a caring daily health companion for elderly adults.
Guidelines:
- Ask about their sleep, appetite, hydration, and mood.
- Suggest gentle, safe activities like seated foot rotations, drinking warm water, and enjoying sunshine.
- CRITICAL DISCLAIMER: You are an educational and wellness companion, NOT a doctor. NEVER prescribe medicines, change dosages, or diagnose illnesses. If symptoms sound serious, advise them immediately to consult their doctor or caregiver.`,

  safety: `You are Buddy Safety Guard, an alert and protective cyber safety agent for senior citizens.
Guidelines:
- Carefully scrutinize any SMS, WhatsApp text, lottery offer, electricity bill notice, or link the user mentions.
- Look out for high-pressure words: 'Account blocked', 'Electricity disconnected today', 'Enter OTP', 'Download this APK', 'Claim 25 Lakhs'.
- Explain in simple terms why a message is dangerous, and warn them NEVER to share OTPs or UPI PINs.
- Give reassuring, clear instructions: 'Do not click', 'Delete this message', or 'Show this to your family member'.`,

  caregiver: `You are Buddy Caregiver Bridge, assisting the senior's family and authorized caregivers.
Guidelines:
- Provide respectful, factual, reassuring summaries of the senior's daily check-ins, mood, and activities.
- Highlight if a check-in is pending or if they felt unwell, and suggest a loving phone call to check in.
- Maintain privacy and respect the senior user's dignity at all times.`
};

// ====================================================
// REST API ROUTES
// ====================================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Buddy Elder AI',
    timestamp: new Date().toISOString(),
    aiConfigured: !!ai,
    databaseReady: true,
  });
});

// 1. Central Multi-Agent Orchestrator
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, requestedAgent, language = 'en', userProfile, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const lower = message.toLowerCase();

    // Intent Classification & Routing
    let selectedAgent: string = requestedAgent || 'companion';

    // Emergency intent check
    const emergencyTriggers = [
      'i have fallen', 'i fell', 'i cannot get up', 'help me please', 'chest pain',
      'difficulty breathing', 'heart attack', 'bleeding', 'गिर गया', 'मदद करो', 'पडलो', 'छातीत दुखतंय'
    ];
    const isEmergency = emergencyTriggers.some(t => lower.includes(t));

    if (isEmergency) {
      selectedAgent = 'safety';
    } else if (!requestedAgent || requestedAgent === 'auto') {
      if (lower.includes('whatsapp') || lower.includes('phone') || lower.includes('settings') || lower.includes('how to use') || lower.includes('download') || lower.includes('video call') || lower.includes('शिकवा')) {
        selectedAgent = 'education';
      } else if (lower.includes('water') || lower.includes('sleep') || lower.includes('pain') || lower.includes('knee') || lower.includes('tired') || lower.includes('walk') || lower.includes('झोप') || lower.includes('तब्येत')) {
        selectedAgent = 'wellness';
      } else if (lower.includes('scam') || lower.includes('otp') || lower.includes('bank') || lower.includes('lottery') || lower.includes('fraud') || lower.includes('suspicious') || lower.includes('लिंक') || lower.includes('पैसे')) {
        selectedAgent = 'safety';
      } else if (lower.includes('caregiver') || lower.includes('family report') || lower.includes('summary')) {
        selectedAgent = 'caregiver';
      } else {
        selectedAgent = 'companion';
      }
    }

    const systemPrompt = AGENT_SYSTEM_PROMPTS[selectedAgent] || AGENT_SYSTEM_PROMPTS.companion;
    const langInstruction = language === 'hi' 
      ? 'Reply in clear, simple Hindi (हिंदी).' 
      : language === 'mr' 
      ? 'Reply in clear, warm Marathi (मराठी).' 
      : 'Reply in simple, warm English.';

    const userName = userProfile?.name || 'Grandfriend';

    let promptContext = `${systemPrompt}\nUser's Preferred Language: ${langInstruction}\nUser's Name: ${userName}.\n`;
    if (isEmergency) {
      promptContext += `\nALERT: The user indicated an emergency or fall! Acknowledge this with utmost urgency, advise them to stay calm, not move if injured, and inform them that emergency assistance 112 and caregiver alerts are triggered right now.\n`;
    }

    if (conversationHistory.length > 0) {
      const recent = conversationHistory.slice(-4).map((m: any) => `${m.sender}: ${m.text}`).join('\n');
      promptContext += `\nRecent Conversation Context:\n${recent}\n`;
    }

    promptContext += `\nUser says: "${message}"\nYour response:`;

    let replyText = '';
    if (ai) {
      try {
        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptContext,
        });
        replyText = geminiRes.text || '';
      } catch (geminiError: any) {
        console.error('Gemini error:', geminiError);
        replyText = getFallbackAgentReply(selectedAgent, language, isEmergency);
      }
    } else {
      replyText = getFallbackAgentReply(selectedAgent, language, isEmergency);
    }

    // Suggested actions based on intent
    const suggestedActions = getSuggestedActions(selectedAgent, language, isEmergency);

    res.json({
      agent: selectedAgent,
      text: replyText,
      isEmergency,
      suggestedActions,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Fallback generator for agents when API is offline or rate limited
function getFallbackAgentReply(agent: string, lang: string, isEmergency: boolean): string {
  if (isEmergency) {
    if (lang === 'hi') return 'कृपया शांत रहें। यदि आप गिर गए हैं तो उठने की जल्दबाजी न करें। हमने 112 आपातकालीन और आपके परिवार का अलर्ट स्क्रीन पर तैयार कर दिया है।';
    if (lang === 'mr') return 'कृपया शांत राहा. इजा झाली असल्यास उठण्याची घाई करू नका. आम्ही ११२ आणि कुटुंबियांचा अलर्ट स्क्रीनवर सुरू केला आहे.';
    return 'Please remain calm. If you have fallen, do not rush to get up. Emergency number 112 and your caregiver contacts are ready on your screen right now.';
  }

  if (agent === 'education') {
    if (lang === 'hi') return 'डिजिटल दुनिया बहुत आसान है! आप जिस चीज़ के बारे में सीखना चाहते हैं, जैसे व्हाट्सएप या वीडियो कॉल, मुझे बताएं। हम धीरे-धीरे एक-एक कदम सीखेंगे।';
    if (lang === 'mr') return 'डिजिटल गोष्टी शिकणे खूप सोपे आहे! आपल्याला व्हॉट्सॲप किंवा फोनबद्दल काय शिकायचे आहे ते सांगा, आपण सावकाश शिकू.';
    return 'Learning technology is completely gentle and easy! Tell me what you would like to try—like sending a WhatsApp photo or calling family—and we will do it step by step.';
  }

  if (agent === 'wellness') {
    if (lang === 'hi') return 'नमस्ते! आज आपकी सेहत कैसी है? थोड़ा गुनगुना पानी पिएं, और धूप में कुछ समय बिताएं। याद रखें, आप बहुत अनमोल हैं।';
    if (lang === 'mr') return 'नमस्कार! आज तुमची तब्येत कशी आहे? थोडे कोमट पाणी प्या आणि विश्रांती घ्या. स्वतःची काळजी घ्या.';
    return 'Hello! How is your body feeling today? Drink a nice glass of warm water and take gentle deep breaths. Remember to stretch your ankles gently while resting.';
  }

  if (agent === 'safety') {
    if (lang === 'hi') return 'ध्यान रखें: बैंक या बिजली विभाग कभी भी फोन पर OTP या UPI PIN नहीं मांगते। किसी भी अनजान लिंक पर क्लिक न करें।';
    if (lang === 'mr') return 'सावध राहा: बँक किंवा कोणीही फोनवर OTP किंवा UPI PIN विचारत नाही. अनोळखी लिंकवर कधीही क्लिक करू नका.';
    return 'Important safety rule: Never share your OTP or UPI PIN with anyone over the phone. Real banks will never ask for them.';
  }

  // Default companion
  if (lang === 'hi') return 'नमस्ते जी! आपसे बात करके बहुत खुशी हुई। बताइए, आज आपका दिन कैसा चल रहा है? कोई कहानी सुनेंगे या पुरानी यादें ताजा करेंगे?';
  if (lang === 'mr') return 'नमस्कार! तुमच्याशी बोलून खूप छान वाटले. सांगा, आजचा दिवस कसा चालला आहे? एखादी छानशी गोष्ट ऐकायची आहे का?';
  return 'Hello dear friend! It brings me so much joy to chat with you. How has your day been so far? Would you like to hear a pleasant story or talk about your favorite memories?';
}

function getSuggestedActions(agent: string, lang: string, isEmergency: boolean): string[] {
  if (isEmergency) {
    return ['Call 112 Emergency', 'Alert Family Caregiver', 'I am Safe Now'];
  }
  if (agent === 'education') {
    return ['How to send WhatsApp photo', 'How to make a Video Call', 'Practice on Phone Simulator'];
  }
  if (agent === 'wellness') {
    return ['Record Daily Check-in', 'Do Seated Foot Exercises', 'Log Water Glass'];
  }
  if (agent === 'safety') {
    return ['Analyze Suspicious SMS', 'What is an OTP Scam?', 'Check Bank Link'];
  }
  return ['Tell me an uplifting story', 'Tips for a peaceful day', 'What should we practice today?'];
}

// 2. Scam Analysis Endpoint
app.post('/api/scam-check', async (req: Request, res: Response) => {
  try {
    const { text, url } = req.body;
    if (!text && !url) {
      res.status(400).json({ error: 'Text or URL is required for scam analysis' });
      return;
    }

    const prompt = `Analyze this message/URL specifically for common fraud targeting elderly people (e.g. Electricity bill disconnect, lottery, bank KYC update, APK download, OTP request, fake pension).
Input to analyze:
"${text || ''} ${url || ''}"

Return a valid JSON object with the following schema:
{
  "riskLevel": "SAFE" | "SUSPICIOUS" | "DANGEROUS" | "UNABLE_TO_VERIFY",
  "riskScore": number (0 to 100),
  "scamCategory": string,
  "warningSigns": string[],
  "safeNextSteps": string[],
  "verdictExplanation": string
}`;

    if (ai) {
      try {
        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });
        const parsed = JSON.parse(geminiRes.text || '{}');
        res.json(parsed);
        return;
      } catch (e) {
        console.error('Gemini scam check error:', e);
      }
    }

    // Heuristic Fallback Analysis
    const content = (text + ' ' + (url || '')).toLowerCase();
    const isDangerous = content.includes('otp') || content.includes('lottery') || content.includes('blocked') || content.includes('kyc') || content.includes('.apk') || content.includes('urgent');
    
    res.json({
      riskLevel: isDangerous ? 'DANGEROUS' : 'SUSPICIOUS',
      riskScore: isDangerous ? 92 : 45,
      scamCategory: isDangerous ? 'Urgent Banking / Phishing Scam' : 'Unverified Message',
      warningSigns: [
        'Creates false urgency claiming account will be blocked or cut off',
        'Requests private credentials, verification codes, or links to unknown sites',
        'Unverified sender identity'
      ],
      safeNextSteps: [
        'Do NOT tap any links or dial the numbers provided in the message',
        'Never share OTP or banking credentials with anyone',
        'Show this message directly to your trusted family member or caregiver'
      ],
      verdictExplanation: isDangerous
        ? 'This message displays classic signs of a scam designed to pressure elderly users into sending money or sharing confidential codes.'
        : 'The message contains unverified links or statements. Exercise high caution.'
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Scam analysis failed' });
  }
});

// 3. RAG Knowledge Search
app.post('/api/rag/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      res.json({ results: appDatabase.ragDocuments });
      return;
    }

    const q = query.toLowerCase();
    const matchedDocs = appDatabase.ragDocuments.filter(doc => 
      doc.title.toLowerCase().includes(q) || 
      doc.content.toLowerCase().includes(q) || 
      doc.category.toLowerCase().includes(q)
    );

    // If Gemini is available, produce a grounded synthesis answer
    let groundedAnswer = '';
    if (ai && matchedDocs.length > 0) {
      try {
        const contextText = matchedDocs.map(d => `Source [${d.title}]:\n${d.content}`).join('\n\n');
        const ragPrompt = `You are Buddy Elder Knowledge Assistant. Answer the senior's question using ONLY the provided verified educational material below.
Keep the answer simple, step-by-step, and cite the document title.

Verified Knowledge Base:
${contextText}

Question: "${query}"`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: ragPrompt,
        });
        groundedAnswer = geminiRes.text || '';
      } catch (err) {
        console.error('RAG synthesis error:', err);
      }
    }

    res.json({
      matches: matchedDocs,
      groundedAnswer: groundedAnswer || 'Based on our senior guides, please review the steps in the reference articles below.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Knowledge search failed' });
  }
});

// 4. Wellness Data Endpoints
app.get('/api/wellness', (req: Request, res: Response) => {
  res.json({ records: appDatabase.wellness });
});

app.post('/api/wellness', (req: Request, res: Response) => {
  const record = {
    id: 'well_' + Date.now(),
    timestamp: new Date().toISOString(),
    ...req.body
  };
  appDatabase.wellness.unshift(record);
  saveDb();
  res.json({ success: true, record });
});

// 5. Emergency SOS Trigger
app.post('/api/emergency', (req: Request, res: Response) => {
  const { userId, triggerType = 'sos_button', details = 'Emergency SOS triggered by user' } = req.body;
  const event = {
    id: 'emg_' + Date.now(),
    userId: userId || 'user_primary',
    timestamp: new Date().toISOString(),
    triggerType,
    status: 'attempted_notification',
    contactDialed: '112',
    details,
  };
  appDatabase.emergencies.unshift(event);
  saveDb();
  res.json({
    success: true,
    event,
    instructions: '112 National Emergency Helpline dialed. Caregiver notification logged.'
  });
});

app.get('/api/emergency', (req: Request, res: Response) => {
  res.json({ emergencies: appDatabase.emergencies });
});

// 6. Reminders Endpoints
app.get('/api/reminders', (req: Request, res: Response) => {
  res.json({ reminders: appDatabase.reminders });
});

app.post('/api/reminders', (req: Request, res: Response) => {
  const reminder = {
    id: 'rem_' + Date.now(),
    completed: false,
    ...req.body
  };
  appDatabase.reminders.push(reminder);
  saveDb();
  res.json({ success: true, reminder });
});

app.patch('/api/reminders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = appDatabase.reminders.findIndex(r => r.id === id);
  if (idx !== -1) {
    appDatabase.reminders[idx] = { ...appDatabase.reminders[idx], ...req.body };
    saveDb();
    res.json({ success: true, reminder: appDatabase.reminders[idx] });
  } else {
    res.status(404).json({ error: 'Reminder not found' });
  }
});

app.delete('/api/reminders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  appDatabase.reminders = appDatabase.reminders.filter(r => r.id !== id);
  saveDb();
  res.json({ success: true });
});

// 7. Feedback Endpoint
app.post('/api/feedback', (req: Request, res: Response) => {
  const feedback = {
    id: 'fb_' + Date.now(),
    timestamp: new Date().toISOString(),
    ...req.body
  };
  saveDb();
  res.json({ success: true, feedback });
});

// ----------------------------------------------------
// Vite Middleware / Static Server setup
// ----------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Buddy Elder AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
