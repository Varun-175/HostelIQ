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
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-6 border-b border-slate-200/50 glass px-6 transition-all lg:px-10">
      <button
        onClick={onMenuClick}
        className="text-slate-500 hover:text-slate-900 lg:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center gap-4">
        <form onSubmit={handleSearch} className="relative w-full max-w-lg hidden md:block group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary-500" />
          </div>
          <Input
            type="search" 
            placeholder="Search students, rooms, requests... (Press / to focus)" 
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full pl-12 h-12 bg-slate-100/60 border-transparent hover:bg-slate-100 focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-500/10 transition-all rounded-2xl text-slate-700 shadow-sm"
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
             <kbd className="hidden sm:inline-block items-center rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-400">
                ⌘ K
             </kbd>
          </div>

          {(isSearching || results) && (
            <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-2 shadow-2xl animate-scale-in">
              {isSearching ? (
                <div className="flex items-center justify-center p-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                </div>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto">
                  {results?.students.length ? (
                    <div className="mb-2">
                       <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Students</div>
                       {results.students.map((student) => (
                        <button key={student._id} type="button" onClick={() => { setResults(null); navigate(user?.role === 'STUDENT' ? '/student' : '/admin/students'); }} className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left hover:bg-slate-50 transition-colors">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                             <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{student.name}</div>
                            <div className="text-xs text-slate-500">{student.registerNo}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  
                  {results?.rooms.length ? (
                    <div>
                       <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Rooms</div>
                       {results.rooms.map((room) => (
                        <button key={room._id} type="button" onClick={() => { setResults(null); navigate(user?.role === 'STUDENT' ? '/student/rooms' : '/admin/rooms'); }} className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left hover:bg-slate-50 transition-colors">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                             <BedDouble className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">Room {room.roomNo}</div>
                            <div className="text-xs text-slate-500">Floor {room.floor}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  
                  {!results?.students.length && !results?.rooms.length && (
                    <div className="p-8 text-center text-sm text-slate-500">
                       No results found for "<span className="font-semibold">{query}</span>"
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={() => navigate(user?.role === 'STUDENT' ? '/student/history' : '/admin/requests')} className="relative rounded-full p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
        </button>

        <div className="hidden md:flex items-center gap-4 pl-6 border-l border-slate-200/60">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 leading-none">{user?.name}</span>
            <span className="text-xs font-medium text-slate-500 mt-1">{user?.role.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
