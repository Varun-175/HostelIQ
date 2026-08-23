import { useState, useEffect } from 'react';
import { getAnalytics, AnalyticsData } from '../../api/analytics.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(d => {
      setData(d);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  if (isLoading) {
    return <div className="h-96 bg-slate-200 animate-pulse rounded-2xl" />;
  }

  const occupancyData = [
    { name: 'Occupied', value: data?.occupiedRooms || 0 },
    { name: 'Available', value: data?.availableRooms || 0 },
  ];

  const COLORS = ['#6366f1', '#e2e8f0'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
        <p className="text-slate-500">System utilization and allocation metrics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-xl shadow-slate-200/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Room Occupancy</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {occupancyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl shadow-slate-200/50 bg-gradient-to-br from-primary-900 to-indigo-900 text-white">
          <CardContent className="p-8 flex flex-col justify-center h-full">
            <h3 className="text-lg font-medium text-primary-200 mb-2">Overall Utilization</h3>
            <div className="text-6xl font-black">{Math.round(data?.utilization || 0)}%</div>
            <p className="mt-4 text-primary-100">
              Total Students: <span className="font-bold text-white">{data?.totalStudents}</span>
            </p>
            <p className="text-primary-100">
              Total Rooms: <span className="font-bold text-white">{data?.totalRooms}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
