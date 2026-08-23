import { useEffect, useState } from 'react';
import { getAllocations, AllocationResponse } from '../../api/allocations.api';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

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
    return <div>Loading requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
        <div className="text-slate-400">No pending allocation requests.</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(req => (
        <Card key={req._id} className="group flex min-w-0 flex-col gap-4 p-4 transition-colors hover:bg-white md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <span className="truncate font-semibold text-slate-900">{req.studentId?.name || req.studentId}</span>
              <Badge variant={req.status === 'ALLOCATED' ? 'success' : 'warning'}>
                {req.status} · SmartFit: {Math.round(req.totalScore)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Proposed Match: Room {req.roomNo}
            </p>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-auto">
            <Button className="flex-1 md:flex-none" variant="outline" size="sm" onClick={() => onSelectRequest && onSelectRequest(req._id)}>Review Details</Button>
            <Button className="flex-1 md:flex-none" size="sm" onClick={() => onSelectRequest && onSelectRequest(req._id)}>Approve</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
