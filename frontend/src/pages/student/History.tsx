import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentAllocationHistory, AllocationResponse } from '../../api/allocations.api';
import SmartFitResult from '../../components/smartfit/SmartFitResult';
import { History as HistoryIcon } from 'lucide-react';

export default function StudentHistory() {
  const { user } = useAuth();
  const [allocation, setAllocation] = useState<AllocationResponse | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getStudentAllocationHistory(user.id).then(data => {
      setHistory(data);
      setAllocation(data[0] || null);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
          <HistoryIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Allocation History</h1>
          <p className="text-slate-500">View your current and past room allocations.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">Room {entry.roomId?.roomNo || 'Unavailable'}</p>
                  <p className="text-sm text-slate-500">{entry.event} · {new Date(entry.createdAt).toLocaleString()}</p>
                </div>
                <span className="font-bold text-primary-600">{Math.round(entry.score || 0)} / 100</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{entry.reason}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <p className="text-slate-500">No allocation history found.</p>
        </div>
      )}
    </div>
  );
}
