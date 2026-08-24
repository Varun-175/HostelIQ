import { useState } from 'react';
import RequestQueue from '../../components/admin/RequestQueue';
import AdminReviewPanel from '../../components/admin/AdminReviewPanel';
import { AlertCircle, CheckCircle2, LayoutTemplate } from 'lucide-react';

export default function AdminRequests() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const handleComplete = (allocationId: string) => {
    setResolvedIds((current) => current.includes(allocationId) ? current : [...current, allocationId]);
    setSelectedRequest(null);
    setNotice('Allocation processed successfully and removed from the queue.');
    
    // Clear notice after 5 seconds
    setTimeout(() => setNotice(''), 5000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 display-font">Allocation Requests</h1>
          </div>
          <p className="text-slate-500 font-medium pl-14">Review SmartFit scores and approve student room allocations.</p>
        </div>
      </div>
      
      {notice && (
        <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-5 py-4 text-sm font-bold text-success-800 shadow-sm animate-slide-down" role="status">
          <CheckCircle2 className="h-5 w-5 text-success-600" />
          {notice}
        </div>
      )}

      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(400px,1fr)] xl:grid-cols-[minmax(0,1.2fr)_minmax(500px,1fr)]">
        {/* Left Column - Queue */}
        <div className="min-w-0">
           <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 ml-2">Pending Queue</h2>
           <RequestQueue resolvedIds={resolvedIds} onSelectRequest={setSelectedRequest} />
        </div>

        {/* Right Column - Review Panel */}
        <div className="min-w-0 relative">
          <div className="sticky top-28">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 ml-2">Review Panel</h2>
            {selectedRequest ? (
              <div className="animate-slide-up">
                <AdminReviewPanel allocationId={selectedRequest} onComplete={handleComplete} />
              </div>
            ) : (
              <div className="flex h-[600px] flex-col items-center justify-center text-center glass-card rounded-[2.5rem] border border-dashed border-slate-300 bg-slate-50/50">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-6 shadow-inner">
                  <AlertCircle className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 display-font">No Request Selected</h3>
                <p className="mt-3 text-slate-500 max-w-[250px] font-medium leading-relaxed">
                  Select a request from the queue to review SmartFit scores and process the allocation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
