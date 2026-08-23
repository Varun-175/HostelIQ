import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentProfile, StudentProfile } from '../../api/students.api';
import { getStudentAllocation, vacateStudent, AllocationResponse } from '../../api/allocations.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import PreferenceFlow from '../../components/students/PreferenceFlow';
import SmartFitResult from '../../components/smartfit/SmartFitResult';
import { Sparkles, BedDouble } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [allocation, setAllocation] = useState<AllocationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isVacating, setIsVacating] = useState(false);
  const [notice, setNotice] = useState('');

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const [prof, alloc] = await Promise.all([
        getStudentProfile(user.id),
        getStudentAllocation(user.id)
      ]);
      setProfile(prof);
      setAllocation(alloc);
    } catch (error) {
      console.error('Failed to load student dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVacate = async () => {
    if (!user?.id || !window.confirm('Vacate this room now? The room will become available.')) return;
    setIsVacating(true);
    try {
      await vacateStudent(user.id);
      setNotice('Room vacated successfully. It is available for the next student.');
      await loadData();
    } catch (error: any) {
      setNotice(error.response?.data?.message || 'Unable to vacate the room.');
    } finally {
      setIsVacating(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-2xl bg-slate-200" />
        <div className="h-96 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {notice && <div className="rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm font-medium text-success-700" role="status">{notice}</div>}
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl animate-float" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, <span className="text-accent-400">{profile?.name || user?.name}</span>
          </h1>
          <p className="mt-2 text-lg text-primary-100 max-w-xl">
            {allocation?.status === 'ALLOCATED' 
              ? "You've been successfully allocated a room for the upcoming semester." 
              : "Let's find the perfect room for your upcoming semester using our SmartFit engine."}
          </p>
        </div>
      </div>

      {allocation ? (
        <>
          <SmartFitResult allocation={allocation} />
          {allocation.status === 'ALLOCATED' && <Button variant="outline" onClick={handleVacate} isLoading={isVacating}>Vacate room</Button>}
        </>
      ) : showPreferences ? (
        <div className="animate-slide-up">
          <PreferenceFlow 
            profile={profile!} 
            onComplete={() => {
              setShowPreferences(false);
              loadData(); // Refresh allocation state to show SmartFitResult
            }} 
          />
        </div>
      ) : (
        <Card className="overflow-hidden border-0 bg-white shadow-xl shadow-primary-500/5 animate-slide-up">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 mb-6 text-primary-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Room Allocation Required</h2>
              <p className="mt-2 text-slate-500 max-w-md leading-relaxed">
                You haven't been allocated a room yet. Tell us your preferences and our AI-powered SmartFit engine will find the best possible match based on your academic standing, seniority, and behavior profile.
              </p>
              <div className="mt-8">
                <Button size="lg" onClick={() => setShowPreferences(true)} className="group">
                  Start SmartFit Allocation
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="hidden md:block w-1/3 bg-slate-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent" />
              <BedDouble className="absolute -bottom-10 -right-10 h-64 w-64 text-primary-100/50" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
