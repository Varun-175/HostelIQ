import { useState, useEffect } from 'react';
import { getRooms, Room } from '../../api/rooms.api';
import { Badge } from '../../components/ui/Badge';
import { BedDouble, Users, Building, Filter, DoorOpen, LayoutGrid, CheckCircle2, Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';

export default function StudentRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getRooms().then(data => {
      setRooms(data);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const filteredRooms = rooms.filter(r => 
    r.roomNo.toString().includes(search) || 
    r.block.toLowerCase().includes(search.toLowerCase()) ||
    r.roomType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 display-font">Room Explorer</h1>
          </div>
          <p className="text-slate-500 font-medium pl-14">Discover and browse available living spaces across campus.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Filter className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary-500" />
          </div>
          <Input
            type="search"
            placeholder="Search by room or block..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 bg-white border-slate-200 shadow-sm focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 rounded-2xl transition-all font-medium"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[280px] bg-slate-200/50 rounded-[2rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
          {filteredRooms.map(room => {
            const currentOcc = room.occupancy?.current || 0;
            const isFull = currentOcc >= room.capacity;
            const occupancyPercentage = (currentOcc / room.capacity) * 100;
            
            return (
              <div 
                key={room._id} 
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] glass-card p-6 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.15)] hover:-translate-y-1"
              >
                {/* Status Indicator */}
                <div className="absolute top-0 right-0 p-6 flex justify-end w-full pointer-events-none">
                  <Badge variant={room.status === 'AVAILABLE' ? 'success' : room.status === 'PARTIAL' ? 'warning' : 'danger'} className="shadow-sm backdrop-blur-md bg-white/80">
                    {room.status}
                  </Badge>
                </div>
                
                <div className="mt-2 mb-6">
                  <div className="flex items-end gap-2 mb-1">
                    <DoorOpen className="h-6 w-6 text-slate-400 group-hover:text-primary-500 transition-colors mb-1.5" />
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight display-font">{room.roomNo}</h3>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-3 py-1 text-xs font-semibold text-slate-500 border border-slate-200/50">
                    <Building className="h-3.5 w-3.5 text-primary-500" />
                    {room.block} Block • Fl. {room.floor}
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Occupancy Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                      <span className={isFull ? 'text-danger-500' : 'text-slate-500'}>Occupancy</span>
                      <span className={isFull ? 'text-danger-600' : 'text-primary-600'}>{currentOcc} / {room.capacity}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isFull ? 'bg-danger-500' : 'bg-gradient-to-r from-primary-400 to-indigo-500'}`}
                        style={{ width: `${occupancyPercentage}%` }} 
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/60">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Type</span>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <BedDouble className="h-4 w-4 text-primary-500" />
                        {room.roomType}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Environment</span>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Users className="h-4 w-4 text-accent-500" />
                        Shared
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  {room.facilities && room.facilities.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {room.facilities.map(f => (
                        <span key={f} className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase text-slate-500 border border-slate-200/50">
                          <CheckCircle2 className="h-3 w-3 text-success-500" />
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-[2rem] ring-2 ring-transparent group-hover:ring-primary-500/20 transition-all pointer-events-none" />
              </div>
            );
          })}
          
          {filteredRooms.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 display-font">No rooms found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
