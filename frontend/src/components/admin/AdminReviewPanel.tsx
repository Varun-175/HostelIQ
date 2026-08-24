import { useState, useEffect } from 'react';
import { AllocationResponse } from '../../api/allocations.api';
import { reviewAllocation, approveAllocation, rejectAllocation, overrideAllocation } from '../../api/admin.api';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { CheckCircle2, XCircle, AlertTriangle, Building, Zap, Activity } from 'lucide-react';

interface AdminReviewPanelProps {
  allocationId: string;
  onComplete: (allocationId: string) => void;
}

export default function AdminReviewPanel({ allocationId, onComplete }: AdminReviewPanelProps) {
  const [request, setRequest] = useState<AllocationResponse | null>(null);
  const [showOverride, setShowOverride] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [overrideRoom, setOverrideRoom] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [action, setAction] = useState<'approve' | 'override' | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError('');
    reviewAllocation(allocationId).then(setRequest).catch((error) => {
      setError(error.response?.data?.message || 'Unable to load this allocation.');
    }).finally(() => setIsLoading(false));
  }, [allocationId]);

  const handleApprove = async () => {
    if (!request) return;
    setAction('approve');
    setError('');
    try {
      await approveAllocation(request._id);
      onComplete(request._id);
    } catch (error) {
      setError((error as any).response?.data?.message || 'Approval failed. Please try again.');
    } finally {
      setAction(null);
    }
  };

  const handleOverride = async () => {
    if (!overrideRoom || !overrideReason || !request) return;
    setAction('override');
    setError('');
    try {
      await overrideAllocation(request._id, overrideRoom, overrideReason);
      onComplete(request._id);
    } catch (error) {
      setError((error as any).response?.data?.message || 'Override failed. Please try again.');
    } finally {
      setAction(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || !request) return;
    setAction('override');
    setError('');
    try {
      await rejectAllocation(request._id, rejectReason.trim());
      onComplete(request._id);
    } catch (error) {
      setError((error as any).response?.data?.message || 'Rejection failed. Please try again.');
    } finally {
      setAction(null);
    }
  };

  if (isLoading) return <div className="h-[600px] bg-slate-200/50 animate-pulse rounded-[2rem]" />;
  if (!request) return <div className="glass-card rounded-[2rem] p-8 text-sm font-semibold text-danger-700" role="alert">{error || 'Allocation unavailable.'}</div>;

  return (
    <>
      <div className="w-full overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200/50 relative">
        
        {/* Premium Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-accent-700 p-8 sm:p-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-accent-500/20 blur-[80px]" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 mb-4 border border-white/20 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 text-accent-400" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-100">SmartFit Analysis</p>
              </div>
              <h2 className="text-3xl font-extrabold leading-tight text-white display-font tracking-tight">Review Allocation Request</h2>
              <p className="mt-2 text-lg text-primary-200 font-medium">Student: {request.studentId?.name || request.studentId}</p>
            </div>
            
            {/* Glowing Score Badge */}
            <div className="shrink-0 flex flex-col items-center justify-center h-28 w-28 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-200 shadow-[0_0_40px_rgba(251,191,36,0.3)] border-2 border-white/40 transform hover:scale-105 transition-transform duration-500">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800/80 mb-1">Score</span>
              <span className="text-5xl font-black text-amber-900 display-font leading-none">{Math.round(request.totalScore)}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-10 bg-slate-50/50">
          {error && (
             <div className="mb-6 flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 p-4">
               <AlertTriangle className="h-5 w-5 text-danger-600 shrink-0 mt-0.5" />
               <p className="text-sm font-medium text-danger-800">{error}</p>
             </div>
          )}
          
          <div className="space-y-8">
            {/* Proposed Room Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" /> Proposed Room Match
              </h4>
              <div className="flex items-center justify-between rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 to-white px-6 py-5 shadow-sm">
                <span className="text-3xl font-black text-primary-700 display-font tracking-tight">Room {request.roomNo}</span>
                <Badge variant="outline" className="px-3 py-1 bg-white">{request.status}</Badge>
              </div>
            </div>
            
            {/* SmartFit Breakdown Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" /> SmartFit Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Room Type', value: request.scoreBreakdown?.roomType },
                  { label: 'Occupancy', value: request.scoreBreakdown?.occupancy },
                  { label: 'Floor', value: request.scoreBreakdown?.floor },
                  { label: 'Capacity', value: request.scoreBreakdown?.capacity },
                  { label: 'Fairness', value: request.scoreBreakdown?.fairness }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white border border-slate-200/60 rounded-xl p-3 shadow-sm hover:border-primary-200 transition-colors">
                    <span className="text-sm font-semibold text-slate-500">{item.label}</span>
                    <span className="text-lg font-bold text-slate-800 display-font">{Math.round(item.value || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Action Buttons - Prominent Reject & Approve */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-end border-t border-slate-200/80 pt-8">
            <Button 
              variant="danger" 
              className="group sm:mr-auto rounded-xl px-6 bg-danger-50 text-danger-700 hover:bg-danger-600 hover:text-white border border-danger-200 shadow-sm transition-all font-bold" 
              onClick={() => setShowReject(true)} 
              disabled={!!action}
            >
              <XCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Reject Request
            </Button>
            
            <Button 
              variant="outline" 
              className="rounded-xl px-6 font-bold" 
              onClick={() => setShowOverride(true)} 
              disabled={!!action}
            >
              Manual Override
            </Button>
            
            <Button 
              className="rounded-xl px-8 shadow-lg shadow-primary-500/25 bg-primary-600 hover:bg-primary-700 font-bold" 
              onClick={handleApprove} 
              isLoading={action === 'approve'}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Approve Allocation
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showOverride}
        onClose={() => setShowOverride(false)}
        title="Manual Allocation Override"
        footer={
          <>
            <Button variant="ghost" className="rounded-xl" onClick={() => setShowOverride(false)}>Cancel</Button>
            <Button variant="danger" className="rounded-xl" onClick={handleOverride} isLoading={action === 'override'}>Confirm Override</Button>
          </>
        }
      >
        <div className="space-y-5 py-4">
          <div className="flex items-start gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4">
             <AlertTriangle className="h-5 w-5 text-warning-600 shrink-0 mt-0.5" />
             <p className="text-sm text-warning-800 font-medium leading-relaxed">
               You are about to manually override the SmartFit engine's proposed allocation. This action will bypass algorithmic fairness checks and will be permanently recorded in the audit log.
             </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-700">New Room Number</label>
            <Input 
              type="number" 
              placeholder="e.g. 101" 
              value={overrideRoom} 
              onChange={e => setOverrideRoom(e.target.value)}
              className="h-12 rounded-xl bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-700">Override Reason (Required)</label>
            <Input 
              type="text" 
              placeholder="e.g. Medical requirement, special accommodation" 
              value={overrideReason} 
              onChange={e => setOverrideReason(e.target.value)}
              className="h-12 rounded-xl bg-slate-50"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        title="Reject Allocation Request"
        footer={
          <>
            <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setShowReject(false)}>Cancel</Button>
            <Button variant="danger" className="rounded-xl font-bold px-6 shadow-lg shadow-danger-500/20" onClick={handleReject} isLoading={action === 'override'}>
              <XCircle className="mr-2 h-4 w-4" /> Reject and Release
            </Button>
          </>
        }
      >
        <div className="space-y-5 py-4">
          <div className="flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 p-4">
             <AlertTriangle className="h-5 w-5 text-danger-600 shrink-0 mt-0.5" />
             <p className="text-sm text-danger-800 font-medium">
               Rejecting this allocation will release the proposed room back to the pool and notify the student. This action cannot be undone.
             </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-700">Reason for Rejection (Required)</label>
            <Input 
              required 
              placeholder="e.g. Eligibility documents incomplete or invalid" 
              value={rejectReason} 
              onChange={(e) => setRejectReason(e.target.value)} 
              className="h-12 rounded-xl bg-slate-50"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
