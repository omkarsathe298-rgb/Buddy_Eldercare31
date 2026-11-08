import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Smartphone, 
  MessageCircle, 
  PhoneCall, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Volume2, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { speechController } from '../utils/speech';

export const DigitalLearning: React.FC = () => {
  const { lang, profile, setIsSpeaking, setActiveTab } = useApp();

  const [activeCourseId, setActiveCourseId] = useState<string>('c_whatsapp');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);

  const courses = [
    {
      id: 'c_whatsapp',
      category: 'Messaging',
      title: 'WhatsApp: Sending Photos & Voice Notes',
      titleHi: 'व्हाट्सएप: फोटो और बोलकर संदेश भेजना',
      summary: 'Learn how to easily share photos of your garden or grandchildren, and send voice messages without typing.',
      icon: MessageCircle,
      steps: [
        {
          step: 1,
          title: 'Opening WhatsApp & Choosing Family',
          instruction: 'Tap the green WhatsApp icon with the white phone symbol on your home screen. Then tap the name or picture of your family member.',
          tip: 'Their conversation will open with all past messages.'
        },
        {
          step: 2,
          title: 'Sending a Quick Voice Note',
          instruction: 'Look at the bottom right corner for the green circle with a microphone. Press and hold your finger down on it. Speak clearly: "Hello, I am thinking of you today!"',
          tip: 'Lift your finger when finished speaking. It sends immediately!'
        },
        {
          step: 3,
          title: 'Canceling if you make a mistake',
          instruction: 'If you sneeze or say the wrong thing while holding the microphone, gently slide your finger to the left across the screen to throw it away into the trash.',
          tip: 'No one will ever hear the canceled recording!'
        },
        {
          step: 4,
          title: 'Sending a Photo from Gallery',
          instruction: 'Tap the small paperclip or camera icon next to the message typing box. Tap "Gallery", select the picture you want, and tap the green arrow button to send.',
          tip: 'You can practice this in our Phone Practice Simulator right now!'
        }
      ],
      quiz: {
        question: 'What do you do if you want to cancel a voice note before sending it on WhatsApp?',
        options: [
          'Drop the phone immediately',
          'Slide your finger to the left while holding the microphone',
          'Turn off the internet router'
        ],
        correctIndex: 1,
        explanation: 'Sliding your finger to the left safely cancels the voice note so it is never sent.'
      }
    },
    {
      id: 'c_videocall',
      category: 'Calling',
      title: 'Making a WhatsApp Video Call to Family',
      titleHi: 'परिवार के साथ वीडियो कॉल करना',
      summary: 'See your grandchildren face-to-face from anywhere in the world with one tap.',
      icon: PhoneCall,
      steps: [
        {
          step: 1,
          title: 'Find the Video Camera Icon',
          instruction: 'Open the WhatsApp chat of your son, daughter, or grandchild. Look at the very top right corner. You will see a small video camera icon next to the phone icon.',
          tip: 'Make sure you are seated comfortably near good room lighting.'
        },
        {
          step: 2,
          title: 'Starting the Call',
          instruction: 'Tap that small video camera icon once. A prompt might say "Start video call?". Tap "Call".',
          tip: 'Hold the phone at eye level so your family can see your smiling face clearly.'
        },
        {
          step: 3,
          title: 'Ending the Call when Finished',
          instruction: 'When you are done talking and saying your blessings, tap the red round button with the receiver icon pointing down.',
          tip: 'This hangs up the call safely.'
        }
      ],
      quiz: {
        question: 'Which icon at the top of a WhatsApp chat starts a face-to-face video call?',
        options: [
          'The small video camera icon at the top right',
          'The keyboard icon',
          'The volume icon'
        ],
        correctIndex: 0,
        explanation: 'The video camera icon connects you face-to-face with your loved ones.'
      }
    },
    {
      id: 'c_upi',
      category: 'Digital Payments',
      title: 'UPI & Payment Safety: The Golden Rule',
      titleHi: 'यूपीआई और पेमेंट सुरक्षा: सुनहरा नियम',
      summary: 'Crucial knowledge for Google Pay, PhonePe, and Paytm: when you should NEVER enter your PIN.',
      icon: CreditCard,
      steps: [
        {
          step: 1,
          title: 'The Golden Rule of UPI PIN',
          instruction: 'Your 4-digit or 6-digit UPI PIN is ONLY entered when YOU are sending money away from your bank account. You NEVER need to enter a PIN to receive money or pension.',
          tip: 'If anyone tells you "Enter PIN to receive prize or money refund", hang up immediately.'
        },
        {
          step: 2,
          title: 'QR Code Caution',
          instruction: 'Scanning a QR code also sends money. Never scan a QR code sent to you on WhatsApp by an unknown caller.',
          tip: 'Real shops will have their QR code physically placed on their counter.'
        },
        {
          step: 3,
          title: 'When in Doubt, Ask Family First',
          instruction: 'Never feel rushed. Scammers always make you feel in a hurry. Take a breath and call your son, daughter, or caregiver.',
          tip: 'True urgency rarely exists in digital banking.'
        }
      ],
      quiz: {
        question: 'Do you ever need to enter your UPI PIN to receive money into your bank?',
        options: [
          'Yes, always enter it quickly',
          'Only on Sundays',
          'NEVER! A PIN is only used when sending money away'
        ],
        correctIndex: 2,
        explanation: 'A UPI PIN is strictly for paying money out. You never enter a PIN to receive money.'
      }
    }
  ];

  const currentCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const currentStep = currentCourse.steps[currentStepIndex];

  const handleReadStep = () => {
    setIsSpeaking(true);
    const text = `Step ${currentStep.step}: ${currentStep.title}. ${currentStep.instruction}. Helpful tip: ${currentStep.tip}`;
    speechController.speak(text, lang, profile.voiceSpeed).finally(() => {
      setIsSpeaking(false);
    });
  };

  const handleCompleteCourse = () => {
    if (!completedCourses.includes(currentCourse.id)) {
      setCompletedCourses(prev => [...prev, currentCourse.id]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <GraduationCap className="w-8 h-8 text-emerald-200" />
          <h1 className="text-3xl font-black">Digital Learning Center</h1>
        </div>
        <p className="text-emerald-100 text-lg max-w-2xl">
          Learn modern smartphone skills step-by-step with zero rush. Master WhatsApp, video calling, and digital payment safety with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Course List */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Choose a Lesson:</h2>
          {courses.map((course) => {
            const Icon = course.icon;
            const isSelected = activeCourseId === course.id;
            const isDone = completedCourses.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => {
                  setActiveCourseId(course.id);
                  setCurrentStepIndex(0);
                  setQuizAnswer(null);
                  setQuizSubmitted(false);
                }}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-start space-x-4 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-700'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      {course.category}
                    </span>
                    {isDone && (
                      <span className="flex items-center space-x-1 text-xs font-black text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mt-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {course.summary}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Shortcut to Practice simulator */}
          <div className="p-5 rounded-3xl bg-sky-50 border border-sky-200 text-sky-900 mt-6 space-y-2">
            <h4 className="font-black text-base flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-sky-600" />
              <span>Interactive Phone Simulator</span>
            </h4>
            <p className="text-xs text-slate-600">
              Want to practice sending fake WhatsApp messages and photos safely without any risk?
            </p>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-2 w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-all"
            >
              Open Phone Practice Sandbox →
            </button>
          </div>
        </div>

        {/* Right: Active Step-by-Step Viewer */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400">
                Step {currentStepIndex + 1} of {currentCourse.steps.length}
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-0.5">
                {currentStep.title}
              </h2>
            </div>
            <button
              onClick={handleReadStep}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl flex items-center space-x-2 text-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Listen</span>
            </button>
          </div>

          {/* Large step box */}
          <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl space-y-4">
            <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
              {currentStep.instruction}
            </p>

            {currentStep.tip && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start space-x-3 text-amber-900">
                <Lightbulb className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sm uppercase">Helpful Tip: </span>
                  <span className="text-sm font-medium">{currentStep.tip}</span>
                </div>
              </div>
            )}
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              className="px-6 py-3.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              ← Previous Step
            </button>

            {currentStepIndex < currentCourse.steps.length - 1 ? (
              <button
                onClick={() => setCurrentStepIndex(prev => prev + 1)}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl flex items-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleCompleteCourse}
                className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-2xl flex items-center space-x-2 shadow-md cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Mark Lesson Complete</span>
              </button>
            )}
          </div>

          {/* Mini Knowledge Quiz Check */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-800">Quick Understanding Check</h3>
            </div>

            <p className="text-base font-bold text-slate-700">
              {currentCourse.quiz.question}
            </p>

            <div className="space-y-2">
              {currentCourse.quiz.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => { setQuizAnswer(idx); setQuizSubmitted(true); }}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base transition-all cursor-pointer ${
                    quizSubmitted && idx === currentCourse.quiz.correctIndex
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300'
                      : quizSubmitted && quizAnswer === idx
                      ? 'border-red-400 bg-red-50 text-red-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </button>
              ))}
            </div>

            {quizSubmitted && (
              <div className={`p-4 rounded-2xl text-sm font-bold ${
                quizAnswer === currentCourse.quiz.correctIndex
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {quizAnswer === currentCourse.quiz.correctIndex ? '🎉 Perfect! ' : '💡 Notice: '}
                {currentCourse.quiz.explanation}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
