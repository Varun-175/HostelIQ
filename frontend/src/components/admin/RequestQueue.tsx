import { useEffect, useState } from 'react';
import { getAllocations, AllocationResponse } from '../../api/allocations.api';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export default function RequestQueue({ limit, onSelectRequest }: { limit?: number, onSelectRequest?: (id: string) => void }) {
  const [requests, setRequests] = useState<AllocationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allocations = await getAllocations();
        setRequests(limit ? allocations.slice(0, limit) : allocations);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [limit]);

  if (isLoading) {
    return <div>Loading requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
        <div className="text-slate-400">No pending requests in the queue.</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(req => (
        <Card key={req._id} className="flex flex-col md:flex-row items-center justify-between p-4 transition-colors hover:bg-slate-50">
          <div className="mb-4 flex-1 md:mb-0">
            <div className="flex items-center gap-3">
              <span className="font-medium text-slate-900">Student: {req.studentId?.name || req.studentId}</span>
              <Badge variant={req.status === 'ALLOCATED' ? 'success' : 'warning'}>
                {req.status} · SmartFit: {Math.round(req.totalScore)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Proposed Match: Room {req.roomNo}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onSelectRequest && onSelectRequest(req._id)}>Review Details</Button>
            <Button size="sm" onClick={() => onSelectRequest && onSelectRequest(req._id)}>Approve</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
