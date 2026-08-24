import { useEffect, useState } from 'react';
import { getAllocations, AllocationResponse } from '../../api/allocations.api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { UserCircle2, Activity } from 'lucide-react';

interface RequestQueueProps {
  limit?: number;
  resolvedIds?: string[];
  onSelectRequest?: (id: string) => void;
}

export default function RequestQueue({ limit, resolvedIds = [], onSelectRequest }: RequestQueueProps) {
  const [requests, setRequests] = useState<AllocationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allocations = await getAllocations();
        const visibleAllocations = allocations.filter((allocation) => allocation.status === 'PENDING' && !resolvedIds.includes(allocation._id));
        setRequests(limit ? visibleAllocations.slice(0, limit) : visibleAllocations);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [limit, resolvedIds]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-[2rem]">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
           <Activity className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 display-font">Queue Empty</h3>
        <p className="text-slate-500 mt-2">There are no pending allocation requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(req => (
        <div 
          key={req._id} 
          className="group flex min-w-0 flex-col gap-4 p-5 transition-all duration-300 hover:shadow-lg glass-card rounded-[1.5rem] hover:-translate-y-0.5 md:flex-row md:items-center md:justify-between border border-slate-200/50"
        >
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
               <UserCircle2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <span className="truncate font-bold text-lg text-slate-900 display-font">{req.studentId?.name || req.studentId}</span>
                <Badge variant={req.status === 'ALLOCATED' ? 'success' : 'warning'} className="shadow-sm">
                  {req.status}
                </Badge>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-200/50">
                  <Activity className="h-3 w-3" />
                  SMARTFIT: {Math.round(req.totalScore)}
                </div>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Proposed Match: <strong className="text-slate-700">Room {req.roomNo}</strong>
              </p>
            </div>
          </div>
          <div className="flex w-full shrink-0 gap-3 md:w-auto mt-4 md:mt-0">
            <Button className="flex-1 md:flex-none rounded-xl" variant="outline" size="sm" onClick={() => onSelectRequest && onSelectRequest(req._id)}>Review Details</Button>
            <Button className="flex-1 md:flex-none rounded-xl bg-primary-600 hover:bg-primary-700" size="sm" onClick={() => onSelectRequest && onSelectRequest(req._id)}>Approve</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
