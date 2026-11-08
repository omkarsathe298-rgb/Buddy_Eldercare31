import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  ShieldCheck, 
  Home, 
  Lightbulb, 
  ChevronRight,
  Info
} from 'lucide-react';
import { speechController } from '../utils/speech';

export const FallSafety: React.FC = () => {
  const { lang, profile, setIsSpeaking } = useApp();

  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [hazardChecks, setHazardChecks] = useState<Record<string, boolean>>({
    rugs: true,
    nightlight: true,
    cables: false,
    bathroom_mat: true
  });

  const exercises = [
    {
      id: 'ex_1',
      title: 'Seated Leg Lifts (कुर्सी पर पैर उठाना)',
      duration: '3 Minutes',
      difficulty: 'Gentle & Safe',
      instructions: [
        'Sit tall and comfortably on a sturdy chair with your back straight.',
        'Keep your feet flat on the floor, shoulder-width apart.',
        'Slowly straighten your right leg out in front of you until parallel to the floor.',
        'Hold gently for 3 to 5 seconds, then slowly lower it back down.',
        'Repeat 5 times for the right leg, then switch to the left leg.'
      ],
      benefits: 'Strengthens quadriceps and knee joints, supporting your walk and balance.',
      precaution: 'Do not lock your knee violently. Keep breathing steadily throughout.'
    },
    {
      id: 'ex_2',
      title: 'Seated Ankle Circles (टखने घुमाना)',
      duration: '2 Minutes',
      difficulty: 'Very Gentle',
      instructions: [
        'While comfortably seated, lift your right foot slightly off the carpet or floor.',
        'Rotate your ankle smoothly in a circle clockwise 5 times.',
        'Then rotate your ankle counter-clockwise 5 times.',
        'Lower your right foot and repeat the gentle circles with your left foot.'
      ],
      benefits: 'Promotes blood circulation in feet and calves, relieving stiffness after sitting.',
      precaution: 'Move slowly and rhythmically; stop if you feel sharp discomfort.'
    },
    {
      id: 'ex_3',
      title: 'Chair-Supported Heel-to-Toe Stand (खड़े होकर संतुलन)',
      duration: '3 Minutes',
      difficulty: 'Moderate (Always hold a sturdy table/chair)',
      instructions: [
        'Stand tall behind a heavy, sturdy chair or kitchen counter. Grip it firmly with both hands.',
        'Place one foot directly in front of the other so the heel of one foot touches the toes of the other.',
        'Look straight ahead at a fixed point on the wall and hold your balance for 10 seconds.',
        'Switch feet so the other foot is in front, keeping both hands firmly on the chair.'
      ],
      benefits: 'Re-trains balance centers in the inner ear and leg muscles.',
      precaution: 'NEVER do this without firmly holding onto a stable chair or counter.'
    }
  ];

  const currentExercise = exercises[activeExerciseIndex];

  const handleReadExercise = () => {
    setIsSpeaking(true);
    const speechText = `${currentExercise.title}. Instructions: ${currentExercise.instructions.join(' ')}. Benefits: ${currentExercise.benefits}. Precaution: ${currentExercise.precaution}`;
    speechController.speak(speechText, lang, profile.voiceSpeed).finally(() => {
      setIsSpeaking(false);
    });
  };

  const toggleComplete = (id: string) => {
    setCompletedExercises(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleHazard = (key: string) => {
    setHazardChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <Activity className="w-8 h-8" />
          <h1 className="text-3xl font-black">Fall Prevention & Safe Mobility</h1>
        </div>
        <p className="text-teal-100 text-lg max-w-2xl">
          Gentle, seated physical exercises and a practical home safety checklist to keep you steady, independent, and secure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exercise Routine Viewer */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-md">
                Safe Mobility Practice
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">
                {currentExercise.title}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleReadExercise}
                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl flex items-center space-x-2 text-sm cursor-pointer transition-colors"
              >
                <Volume2 className="w-4 h-4 text-teal-600" />
                <span>Read Instructions</span>
              </button>

              <button
                onClick={() => toggleComplete(currentExercise.id)}
                className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 text-sm cursor-pointer transition-all ${
                  completedExercises.includes(currentExercise.id)
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border-2 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completedExercises.includes(currentExercise.id) ? 'Completed!' : 'Mark Completed'}</span>
              </button>
            </div>
          </div>

          {/* Quick exercise nav tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {exercises.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => setActiveExerciseIndex(idx)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition-all ${
                  activeExerciseIndex === idx
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {idx + 1}. {ex.title.split('(')[0]}
              </button>
            ))}
          </div>

          {/* Step by step guide */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800">Step-by-step instructions:</h3>
            <div className="space-y-3">
              {currentExercise.instructions.map((step, i) => (
                <div key={i} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-base sm:text-lg font-medium text-slate-800 pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Precautions */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-amber-900">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm uppercase">Safety First: </span>
              <span className="text-sm font-medium">{currentExercise.precaution}</span>
            </div>
          </div>
        </div>

        {/* Home Hazard Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Home className="w-6 h-6 text-teal-600" />
            <h3 className="text-xl font-black text-slate-800">Home Hazard Checklist</h3>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Over 60% of senior slips happen at home. Review these simple room checks with family:
          </p>

          <div className="space-y-3">
            {[
              { key: 'rugs', title: 'Loose Rugs Secured', desc: 'Ensure floor mats have non-slip rubber backing.' },
              { key: 'nightlight', title: 'Night Light in Hallway', desc: 'Adequate lighting between bed and bathroom at night.' },
              { key: 'cables', title: 'Clear Pathways', desc: 'No trailing phone charging cables or clutter in walking corridors.' },
              { key: 'bathroom_mat', title: 'Bathroom Grab Bar', desc: 'Stable non-slip mat inside shower/toilet area.' }
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleHazard(item.key)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start space-x-3 ${
                  hazardChecks[item.key]
                    ? 'border-emerald-300 bg-emerald-50/60'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center shrink-0 ${
                  hazardChecks[item.key] ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                }`}>
                  {hazardChecks[item.key] && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-start space-x-2.5 text-sky-900">
            <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed">
              Golden Rule: Sit on the edge of the bed for 10 seconds before standing up in the morning to allow blood pressure to normalize.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
