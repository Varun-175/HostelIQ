import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard, DashboardMetrics } from '../../api/admin.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Users, BedDouble, AlertCircle, CheckCircle2, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getAdminDashboard().then(data => {
      setMetrics(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
      </div>
    );
  }

  const kpis = [
    { label: 'Total Students', value: metrics?.totalStudents || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Total Rooms', value: metrics?.totalRooms || 0, icon: BedDouble, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { label: 'Pending Requests', value: metrics?.pendingRequests || 0, icon: AlertCircle, color: 'text-warning-500', bg: 'bg-warning-50', border: 'border-warning-100' },
    { label: 'Allocations Today', value: metrics?.allocationsToday || 0, icon: CheckCircle2, color: 'text-success-500', bg: 'bg-success-50', border: 'border-success-100' },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className={`border ${kpi.border} shadow-lg shadow-slate-200/40 hover-lift`}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">{kpi.value}</div>
                  <div className="text-sm font-medium text-slate-500">{kpi.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-0 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Activity className="h-48 w-48" />
          </div>
          <div className="relative z-10 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-500" />
              Room Utilization
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">Overall Occupancy</span>
                  <span className="text-primary-600 font-bold">{Math.round(metrics?.utilization || 0)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-400 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${metrics?.utilization || 0}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                  <div className="text-sm text-slate-500">Available</div>
                  <div className="text-2xl font-bold text-success-600">{metrics?.availableRooms || 0}</div>
                </div>
                <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                  <div className="text-sm text-slate-500">Fully Occupied</div>
                  <div className="text-2xl font-bold text-primary-600">{metrics?.fullRooms || 0}</div>
                </div>
                <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                  <div className="text-sm text-slate-500">Partially Occupied</div>
                  <div className="text-2xl font-bold text-warning-600">{metrics?.partialRooms || 0}</div>
                </div>
                <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                  <div className="text-sm text-slate-500">Maintenance</div>
                  <div className="text-2xl font-bold text-danger-600">{metrics?.maintenanceRooms || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-xl shadow-slate-200/50 bg-gradient-to-br from-primary-900 to-indigo-900 text-white">
          <div className="p-8">
            <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/admin/requests" className="flex items-center justify-between rounded-xl bg-white/10 p-4 hover:bg-white/20 transition-colors">
                <span className="font-medium">Review Requests</span>
                <div className="h-6 w-6 rounded-full bg-warning-500 flex items-center justify-center text-xs font-bold">
                  {metrics?.pendingRequests || 0}
                </div>
              </Link>
              <Link to="/admin/rooms" className="flex items-center justify-between rounded-xl bg-white/10 p-4 hover:bg-white/20 transition-colors">
                <span className="font-medium">Manage Rooms</span>
              </Link>
              <Link to="/admin/students" className="flex items-center justify-between rounded-xl bg-white/10 p-4 hover:bg-white/20 transition-colors">
                <span className="font-medium">Student Directory</span>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
