import { useState, useEffect } from 'react';
import { AllocationResponse } from '../../api/allocations.api';
import { reviewAllocation, approveAllocation, rejectAllocation, overrideAllocation } from '../../api/admin.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

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

  if (isLoading) return <div className="surface-panel h-96 animate-pulse rounded-2xl" />;
  if (!request) return <div className="surface-panel rounded-2xl p-6 text-sm text-danger-700" role="alert">{error || 'Allocation unavailable.'}</div>;

  return (
    <>
      <Card className="w-full overflow-hidden border-0 shadow-xl shadow-slate-200/50">
        <CardHeader className="bg-gradient-to-br from-primary-950 via-primary-900 to-accent-700 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">SmartFit review</p>
              <CardTitle className="text-xl leading-tight text-white">Review Allocation Request</CardTitle>
              <CardDescription className="mt-1 text-primary-200">Student: {request.studentId?.name || request.studentId}</CardDescription>
            </div>
            <div className="shrink-0 rounded-2xl bg-amber-100 px-4 py-3 text-center text-amber-950 shadow-lg shadow-black/10">
              <span className="block text-[10px] font-bold uppercase tracking-wider">Score</span>
              <strong className="block text-2xl leading-none">{Math.round(request.totalScore)}</strong>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5 sm:p-6">
          {error && <p className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700" role="alert">{error}</p>}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Proposed Room</h4>
            <div className="flex items-center justify-between rounded-xl border border-primary-100 bg-primary-50 px-4 py-3">
              <span className="text-2xl font-bold text-primary-700">Room {request.roomNo}</span>
              <Badge variant="outline">{request.status}</Badge>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">SmartFit Breakdown</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Room Type</span>
                <span className="font-medium">{Math.round(request.scoreBreakdown?.roomType || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Occupancy</span>
                <span className="font-medium">{Math.round(request.scoreBreakdown?.occupancy || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Floor</span>
                <span className="font-medium">{Math.round(request.scoreBreakdown?.floor || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Capacity</span>
                <span className="font-medium">{Math.round(request.scoreBreakdown?.capacity || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Fairness</span>
                <span className="font-medium">{Math.round(request.scoreBreakdown?.fairness || 0)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setShowReject(true)} disabled={!!action}>Reject</Button>
            <Button variant="outline" onClick={() => setShowOverride(true)} disabled={!!action}>Override</Button>
            <Button onClick={handleApprove} isLoading={action === 'approve'}>Approve Allocation</Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showOverride}
        onClose={() => setShowOverride(false)}
        title="Override Allocation"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowOverride(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleOverride} isLoading={action === 'override'}>Confirm Override</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-slate-500 mb-4">
            Manually override the SmartFit engine's proposed allocation. This action will be logged.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">New Room Number</label>
            <Input 
              type="number" 
              placeholder="e.g. 101" 
              value={overrideRoom} 
              onChange={e => setOverrideRoom(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Override Reason</label>
            <Input 
              type="text" 
              placeholder="e.g. Medical requirement" 
              value={overrideReason} 
              onChange={e => setOverrideReason(e.target.value)} 
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        title="Reject allocation"
        footer={<><Button variant="ghost" onClick={() => setShowReject(false)}>Cancel</Button><Button variant="danger" onClick={handleReject} isLoading={action === 'override'}>Reject and release room</Button></>}
      >
        <div className="space-y-2 py-2">
          <label className="text-sm font-medium text-slate-700">Reason for rejection</label>
          <Input required placeholder="e.g. Eligibility documents incomplete" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
        </div>
      </Modal>
    </>
  );
}
