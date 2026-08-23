import { FormEvent, useState } from 'react';
import { Menu, Bell, Search, Users, BedDouble } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';
import { globalSearch, SearchResults } from '../../api/search.api';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      setResults(null);
      return;
    }
    setIsSearching(true);
    try {
      setResults(await globalSearch(query.trim()));
    } catch {
      setResults({ students: [], rooms: [] });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/60 bg-white/80 px-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        className="text-slate-500 hover:text-slate-900 lg:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center gap-4">
        <form onSubmit={handleSearch} className="relative w-full max-w-md hidden md:block group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary-500" />
          </div>
          <Input
            type="search" 
            placeholder="Search students, rooms, requests..." 
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full pl-10 bg-slate-100/50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-primary-500 focus:ring-primary-500/20 transition-all rounded-full"
          />
          {(isSearching || results) && (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              {isSearching ? <p className="px-3 py-2 text-sm text-slate-500">Searching...</p> : (
                <>
                  {results?.students.map((student) => (
                    <button key={student._id} type="button" onClick={() => navigate(user?.role === 'STUDENT' ? '/student' : '/admin/students')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50">
                      <Users className="h-4 w-4 text-primary-500" />
                      <span><strong className="text-slate-800">{student.name}</strong><small className="ml-2 text-slate-500">{student.registerNo}</small></span>
                    </button>
                  ))}
                  {results?.rooms.map((room) => (
                    <button key={room._id} type="button" onClick={() => navigate(user?.role === 'STUDENT' ? '/student/rooms' : '/admin/rooms')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50">
                      <BedDouble className="h-4 w-4 text-accent-600" />
                      <span><strong className="text-slate-800">Room {room.roomNo}</strong><small className="ml-2 text-slate-500">Floor {room.floor}</small></span>
                    </button>
                  ))}
                  {!results?.students.length && !results?.rooms.length && <p className="px-3 py-2 text-sm text-slate-500">No matches found.</p>}
                </>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => navigate(user?.role === 'STUDENT' ? '/student/history' : '/admin/requests')} className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors">
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
