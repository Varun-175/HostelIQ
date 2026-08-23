import { useState, useEffect } from 'react';
import { AllocationResponse } from '../../api/allocations.api';
import { reviewAllocation, approveAllocation, overrideAllocation } from '../../api/admin.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

interface AdminReviewPanelProps {
  allocationId: string;
  onComplete: () => void;
}

export default function AdminReviewPanel({ allocationId, onComplete }: AdminReviewPanelProps) {
  const [request, setRequest] = useState<AllocationResponse | null>(null);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideRoom, setOverrideRoom] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  useEffect(() => {
    reviewAllocation(allocationId).then(setRequest).catch(console.error);
  }, [allocationId]);

  const handleApprove = async () => {
    if (!request) return;
    try {
      await approveAllocation(request._id);
      onComplete();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOverride = async () => {
    if (!overrideRoom || !overrideReason || !request) return;
    try {
      await overrideAllocation(request._id, overrideRoom, overrideReason);
      onComplete();
    } catch (error) {
      console.error(error);
    }
  };

  if (!request) return <div className="animate-pulse h-96 bg-slate-200 rounded-xl" />;

  return (
    <>
      <Card className="w-full border-0 shadow-xl shadow-slate-200/50">
        <CardHeader className="bg-gradient-to-r from-primary-900 to-indigo-900 text-white rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white">Review Allocation Request</CardTitle>
              <CardDescription className="text-primary-200">Student: {request.studentId?.name || request.studentId}</CardDescription>
            </div>
            <Badge variant="warning">Score: {Math.round(request.totalScore)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Proposed Room</h4>
            <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
              <span className="text-2xl font-bold text-primary-700">Room {request.roomNo}</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">SmartFit Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Room Type</span>
                <span className="font-medium">{Math.round(request.scoreBreakdown?.roomType || 0)}</span>
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowOverride(true)}>Override</Button>
            <Button onClick={handleApprove}>Approve Allocation</Button>
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
            <Button variant="danger" onClick={handleOverride}>Confirm Override</Button>
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
    </>
  );
}
