import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AppShell from './components/layout/AppShell';
import { Logo } from './components/ui/Logo';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentRooms from './pages/student/Rooms';
import StudentHistory from './pages/student/History';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminRequests from './pages/admin/Requests';
import AdminRooms from './pages/admin/Rooms';
import AdminStudents from './pages/admin/Students';
import AdminAnalytics from './pages/admin/Analytics';
import AdminAuditLog from './pages/admin/Audit';

function AppRoutes() {
  const { isAuthenticated, user, isLoading, hasPermission } = useAuth();

  // CRITICAL: Wait for auth state to hydrate from localStorage before
  // evaluating any route guards. Without this, a direct navigation to
  // /student or /admin immediately sees isAuthenticated=false and
  // redirects to /login (blank flash).
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Logo compact className="animate-pulse" />
          <span className="text-sm font-medium text-slate-400">Loading HostelIQ…</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'STUDENT' ? '/student' : '/admin'} />} 
      />

      {/* Protected Student Routes */}
      <Route path="/student" element={
        isAuthenticated && user?.role === 'STUDENT' ? <AppShell /> : <Navigate to="/login" />
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="rooms" element={<StudentRooms />} />
        <Route path="history" element={<StudentHistory />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        isAuthenticated && user?.role !== 'STUDENT' ? <AppShell /> : <Navigate to="/login" />
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="requests" element={hasPermission('allocation.manage') ? <AdminRequests /> : <Navigate to="/admin" replace />} />
        <Route path="rooms" element={hasPermission('room.manage') ? <AdminRooms /> : <Navigate to="/admin" replace />} />
        <Route path="students" element={hasPermission('student.read') ? <AdminStudents /> : <Navigate to="/admin" replace />} />
        <Route path="analytics" element={hasPermission('analytics.read') ? <AdminAnalytics /> : <Navigate to="/admin" replace />} />
        <Route path="audit" element={hasPermission('analytics.read') ? <AdminAuditLog /> : <Navigate to="/admin" replace />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
