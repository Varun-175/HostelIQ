import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StudentProfile, updateStudentPreferences } from '../../api/students.api';
import { requestAllocation } from '../../api/allocations.api';
import { BedSingle, BedDouble, Users, Building, ArrowRight, Sparkles } from 'lucide-react';

interface PreferenceFlowProps {
  profile: StudentProfile;
  onComplete: () => void;
}

export default function PreferenceFlow({ profile, onComplete }: PreferenceFlowProps) {
  const [step, setStep] = useState(1);
  const [roomType, setRoomType] = useState<'SINGLE' | 'DOUBLE' | 'TRIPLE'>(profile.preferences?.roomType || 'DOUBLE');
  const [floor, setFloor] = useState<number | undefined>(profile.preferences?.floor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);

  const handleSavePreferences = async () => {
    setIsSubmitting(true);
    try {
      await updateStudentPreferences(profile._id, { roomType, floor });
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllocate = async () => {
    setIsAllocating(true);
    try {
      await requestAllocation(profile._id);
      onComplete();
    } catch (error) {
      console.error(error);
      setIsAllocating(false);
    }
  };

  const roomTypes = [
    { id: 'SINGLE', label: 'Single', icon: BedSingle, desc: 'Maximum privacy' },
    { id: 'DOUBLE', label: 'Double', icon: BedDouble, desc: 'Shared with 1 person' },
    { id: 'TRIPLE', label: 'Triple', icon: Users, desc: 'Shared with 2 people' },
  ];

  if (step === 1) {
    return (
      <Card className="border-0 shadow-xl shadow-slate-200/50">
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Room Preferences</h2>
              <p className="text-sm text-slate-500">Step 1 of 2 • Tell us what you're looking for</p>
            </div>
          </div>
        </div>
        
        <CardContent className="space-y-8 p-8">
          <div className="space-y-4">
            <label className="text-base font-semibold text-slate-900">What kind of room do you prefer?</label>
            <div className="grid gap-4 sm:grid-cols-3">
              {roomTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = roomType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setRoomType(type.id as any)}
                    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 text-center transition-all duration-200 hover-lift ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-primary-500" />
                    )}
                    <Icon className={`mb-3 h-8 w-8 ${isSelected ? 'text-primary-600' : 'text-slate-400'}`} />
                    <span className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>{type.label}</span>
                    <span className="mt-1 text-xs text-slate-500">{type.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-base font-semibold text-slate-900">Preferred Floor</label>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Optional</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map(f => (
                <button
                  key={f}
                  onClick={() => setFloor(floor === f ? undefined : f)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-lg font-bold transition-all hover-lift ${
                    floor === f
                      ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500">Leaving this blank allows the engine to optimize purely for room type and fairness.</p>
          </div>
          
          <div className="flex justify-end pt-6">
            <Button size="lg" onClick={handleSavePreferences} isLoading={isSubmitting} className="group">
              Continue to SmartFit
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-slate-900/5 animate-scale-in">
      <div className="bg-gradient-animated p-12 text-center text-white relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20">
            <Sparkles className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h3 className="text-3xl font-bold tracking-tight">Ready to find your match?</h3>
          <p className="mt-4 max-w-md text-lg text-primary-100">
            Our SmartFit engine will analyze your preferences, academic standing, and behavioral record to find the perfect room.
          </p>
        </div>
      </div>
      <CardContent className="p-10 text-center bg-white flex flex-col items-center justify-center">
        <Button size="lg" className="w-full max-w-sm text-lg shadow-xl shadow-primary-500/20 py-6" onClick={handleAllocate} isLoading={isAllocating}>
          {isAllocating ? 'Running SmartFit Engine...' : 'Run SmartFit Engine'}
        </Button>
        <p className="mt-4 text-xs text-slate-400">This action cannot be undone. Allocation is final unless overridden by an admin.</p>
      </CardContent>
    </Card>
  );
}
