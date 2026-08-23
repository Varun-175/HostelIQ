import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AllocationResponse } from '../../api/allocations.api';
import { Sparkles, Info, CheckCircle2, TrendingUp, Building, Users } from 'lucide-react';

interface SmartFitResultProps {
  allocation: AllocationResponse;
}

export default function SmartFitResult({ allocation }: SmartFitResultProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to totalScore
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = allocation.totalScore / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= allocation.totalScore) {
        setAnimatedScore(allocation.totalScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [allocation.totalScore]);

  const strokeDasharray = `${animatedScore}, 100`;

  return (
    <div className="space-y-6 animate-slide-up">
      <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-slate-900/5">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-indigo-900 p-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-accent-400" />
                <span className="text-sm font-semibold tracking-wider text-accent-400 uppercase">SmartFit Match</span>
              </div>
              <h2 className="text-3xl font-bold">Room {allocation.roomNo}</h2>
              <p className="text-primary-100 mt-2 max-w-md opacity-90 leading-relaxed">
                {allocation.reason}
              </p>
            </div>

            <div className="flex flex-col items-center shrink-0">
              <div className="relative h-32 w-32">
                {/* Circular Progress */}
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="stroke-white/20"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                  />
                  {/* Progress Circle */}
                  <path
                    className="stroke-accent-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    strokeDasharray={strokeDasharray}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{Math.round(animatedScore)}</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-80">Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <CardContent className="p-0">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4 px-8 text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Status:</span>
                <Badge variant={allocation.status === 'ALLOCATED' ? 'success' : 'warning'}>
                  {allocation.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Assigned by:</span>
                <Badge variant={allocation.allocatedBy === 'SYSTEM' ? 'primary' : 'secondary'}>
                  {allocation.allocatedBy}
                </Badge>
              </div>
            </div>
            {allocation.smartFit?.rank && (
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <TrendingUp className="h-4 w-4 text-primary-500" />
                Rank #{allocation.smartFit.rank} of {allocation.smartFit.candidatesEvaluated} candidates
              </div>
            )}
          </div>

          {/* Breakdown Grid */}
          <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: 'Room Type', value: allocation.scoreBreakdown?.roomType || 0, icon: Building, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Floor Pref', value: allocation.scoreBreakdown?.floor || 0, icon: Building, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { label: 'Capacity', value: allocation.scoreBreakdown?.capacity || 0, icon: Users, color: 'text-violet-500', bg: 'bg-violet-50' },
              { label: 'Occupancy', value: allocation.scoreBreakdown?.occupancy || 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
              { label: 'Fairness', value: allocation.scoreBreakdown?.fairness || 0, icon: CheckCircle2, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-6 transition-colors hover:bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{Math.round(item.value)}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-700">{item.label}</div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.max(0, Math.min(100, item.value))}%`, transitionDelay: `${idx * 100}ms` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Override Reason */}
          {allocation.override && (
            <div className="flex items-start gap-3 bg-warning-50 p-6 text-warning-900">
              <Info className="h-5 w-5 shrink-0 text-warning-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-warning-800">Admin Override</h4>
                <p className="mt-1 text-sm">{allocation.overrideReason}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
