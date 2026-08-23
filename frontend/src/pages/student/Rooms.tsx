import { useState, useEffect } from 'react';
import { getRooms, Room } from '../../api/rooms.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BedDouble, Users, Building, Filter } from 'lucide-react';
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
    r.block.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Room Explorer</h1>
          <p className="text-slate-500">Browse available rooms in the hostel.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Input
            type="search"
            placeholder="Search by room no or block..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white shadow-sm"
          />
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map(room => (
            <Card key={room._id} className="hover-lift overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600" />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{room.roomNo}</h3>
                    <p className="text-sm font-medium text-slate-500">{room.block} Block • Floor {room.floor}</p>
                  </div>
                  <Badge variant={room.status === 'AVAILABLE' ? 'success' : room.status === 'PARTIAL' ? 'warning' : 'danger'}>
                    {room.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building className="h-4 w-4 text-slate-400" />
                    {room.roomType}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4 text-slate-400" />
                    {room.occupancy?.current || 0}/{room.capacity} Occupied
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {room.facilities.map(f => (
                    <span key={f} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                      {f}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredRooms.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              <BedDouble className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p>No rooms found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
