import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, BedDouble, FileText, Users, BarChart3, LogOut, Search, Clock, History } from 'lucide-react';
import { cn } from '../ui/Button';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const studentLinks = [
    { to: '/student', icon: Home, label: 'Dashboard' },
    { to: '/student/rooms', icon: Search, label: 'Explore Rooms' },
    { to: '/student/history', icon: History, label: 'Allocation History' },
  ];

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/requests', icon: FileText, label: 'Requests Queue', permission: 'allocation.manage' },
    { to: '/admin/rooms', icon: BedDouble, label: 'Room Management', permission: 'room.manage' },
    { to: '/admin/students', icon: Users, label: 'Student Directory', permission: 'student.read' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', permission: 'analytics.read' },
    { to: '/admin/audit', icon: Clock, label: 'Audit Log', permission: 'analytics.read' },
  ];

  const links = user?.role === 'STUDENT' ? studentLinks : adminLinks.filter((link) => !link.permission || hasPermission(link.permission));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar-surface flex h-full w-72 flex-col text-slate-300">
      <div className="flex h-20 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-primary-500 shadow-lg shadow-accent-500/20">
            <BedDouble className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Hostel<span className="text-accent-300">IQ</span></span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-white/10">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "border-white/10 bg-white/[0.11] text-white shadow-lg shadow-black/10" 
                  : "text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-fade-in" />
              )}
              <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-300")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="mb-4 rounded-xl bg-white/5 p-4 backdrop-blur-md border border-white/5">
          <div className="text-sm font-semibold text-white">{user?.name}</div>
          <div className="text-xs text-slate-400">{user?.role.replace('_', ' ')}</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5 text-slate-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
