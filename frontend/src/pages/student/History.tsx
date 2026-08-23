import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentAllocation, AllocationResponse } from '../../api/allocations.api';
import SmartFitResult from '../../components/smartfit/SmartFitResult';
import { History as HistoryIcon } from 'lucide-react';

export default function StudentHistory() {
  const { user } = useAuth();
  const [allocation, setAllocation] = useState<AllocationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getStudentAllocation(user.id).then(data => {
      setAllocation(data);
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
      ) : allocation ? (
        <SmartFitResult allocation={allocation} />
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <p className="text-slate-500">No allocation history found.</p>
        </div>
      )}
    </div>
  );
}
