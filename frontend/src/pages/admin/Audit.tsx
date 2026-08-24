import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import apiClient from '../../api/client';
import { Clock, Shield, User, FileText, CheckCircle2, AlertCircle, BedDouble } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/audit-logs').then(res => {
      setLogs(res.data.data);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div className="h-96 bg-slate-200 animate-pulse rounded-2xl" />;
  }

  const getActionIcon = (action: string) => {
    if (action.includes('ALLOCATION')) return <CheckCircle2 className="h-5 w-5 text-success-500" />;
    if (action.includes('OVERRIDE')) return <AlertCircle className="h-5 w-5 text-warning-500" />;
    if (action.includes('ROOM')) return <BedDouble className="h-5 w-5 text-primary-500" />;
    return <FileText className="h-5 w-5 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Audit Log</h1>
          <p className="text-slate-500">Immutable record of all critical administrative actions.</p>
        </div>
      </div>

      <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Actor</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Target Resource</th>
                <th className="px-6 py-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="h-3 w-3 text-slate-600" />
                      </div>
                      <span className="font-medium text-slate-900">{log.actorId?.name || log.actorRole || 'SYSTEM'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <Badge variant="outline">{log.action}</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{log.entityId}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{log.metadata ? JSON.stringify(log.metadata) : (log.newState ? JSON.stringify(log.newState) : 'No details')}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No audit logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
