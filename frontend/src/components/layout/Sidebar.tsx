import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, BedDouble, FileText, Users, BarChart3, LogOut, Search, Clock, History } from 'lucide-react';
import { cn } from '../ui/Button';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const studentLinks = [
    { to: '/student', icon: Home, label: 'Dashboard' },
    { to: '/student/rooms', icon: Search, label: 'Explore Rooms' },
    { to: '/student/history', icon: History, label: 'Allocation History' },
  ];

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/requests', icon: FileText, label: 'Requests Queue' },
    { to: '/admin/rooms', icon: BedDouble, label: 'Room Management' },
    { to: '/admin/students', icon: Users, label: 'Student Directory' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/audit', icon: Clock, label: 'Audit Log' },
  ];

  const links = user?.role === 'STUDENT' ? studentLinks : adminLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex h-full w-72 flex-col sidebar-surface text-slate-300">
      <div className="flex h-20 items-center px-8 border-b border-white/5">
        <Logo light />
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-8 scrollbar-thin scrollbar-thumb-white/10">
        <div className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Main Menu
        </div>
        
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-primary-500/10 text-white" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary-500 shadow-[0_0_12px_rgba(79,70,229,0.6)] animate-fade-in" />
              )}
              <Icon className={cn(
                "h-5 w-5 transition-colors duration-300", 
                isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-300"
              )} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl bg-white/5 p-4 border border-white/5 backdrop-blur-md mb-4 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
             {user?.name.charAt(0)}
           </div>
           <div className="flex-1 min-w-0">
             <div className="text-sm font-bold text-white truncate">{user?.name}</div>
             <div className="text-xs text-slate-400 truncate">{user?.role.replace('_', ' ')}</div>
           </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
