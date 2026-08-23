import { useState } from 'react';
import RequestQueue from '../../components/admin/RequestQueue';
import AdminReviewPanel from '../../components/admin/AdminReviewPanel';
import { Card, CardContent } from '../../components/ui/Card';
import { AlertCircle } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

export default function AdminRequests() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const handleComplete = (allocationId: string) => {
    setResolvedIds((current) => current.includes(allocationId) ? current : [...current, allocationId]);
    setSelectedRequest(null);
    setNotice('Allocation approved and removed from the queue.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Allocation Requests</h1>
        <p className="text-slate-500">Review and approve student room allocations.</p>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <div className="min-w-0">
          <Card className="border-0 shadow-xl shadow-slate-200/50">
            <CardContent className="min-w-0 p-4 sm:p-6">
              <RequestQueue resolvedIds={resolvedIds} onSelectRequest={setSelectedRequest} />
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0">
          {selectedRequest ? (
            <AdminReviewPanel allocationId={selectedRequest} onComplete={handleComplete} />
          ) : (
            <Card className="border-2 border-dashed border-slate-200 bg-slate-50 shadow-none">
              <CardContent className="flex h-[500px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 mb-4">
                  <AlertCircle className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Request Selected</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-[200px]">
                  Select a request from the queue to review SmartFit scores and approve the allocation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {notice && <div className="flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm font-medium text-success-700" role="status"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
    </div>
  );
}
