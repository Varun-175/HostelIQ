import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import apiClient from '../../api/client';
import { User, Book, GraduationCap, Building } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

interface StudentData {
  _id: string;
  name: string;
  email: string;
  registerNo: string;
  department: string;
  year: number;
  cgpa: number;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/students').then(res => {
      setStudents(res.data.data);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div className="h-96 bg-slate-200 animate-pulse rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Directory</h1>
          <p className="text-slate-500">View and manage student information.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {students.filter(Boolean).map((student, idx) => (
          <Card key={student._id || idx} className="hover-lift overflow-hidden border-0 shadow-xl shadow-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{student.name}</h3>
                  <p className="text-sm text-slate-500 font-mono">{student.registerNo}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center text-sm text-slate-600 gap-3">
                  <Building className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{student.department || 'Computer Science'}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span>Year {student.year || 3}</span>
                  </div>
                  <Badge variant="outline">CGPA: {student.cgpa || 8.5}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {students.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No students found.
          </div>
        )}
      </div>
    </div>
  );
}
