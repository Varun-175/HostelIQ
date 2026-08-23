import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/50 bg-white/70 px-4 backdrop-blur-xl transition-all sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        className="text-slate-500 hover:text-slate-900 lg:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md hidden md:block group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary-500" />
          </div>
          <Input 
            type="search" 
            placeholder="Search students, rooms, requests..." 
            className="w-full pl-10 bg-slate-100/50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-primary-500 focus:ring-primary-500/20 transition-all rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
        </button>

        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</span>
            <span className="text-xs text-slate-500 mt-1">{user?.role.replace('_', ' ')}</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-100 to-violet-100 flex items-center justify-center border border-primary-200/50 text-primary-700 font-bold shadow-sm">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
