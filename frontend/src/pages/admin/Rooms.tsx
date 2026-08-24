import { useState, useEffect } from 'react';
import { getRooms, Room } from '../../api/rooms.api';
import { adminCreateRoom, adminUpdateRoomStatus } from '../../api/admin.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BedDouble, Users, Building, Wrench } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ roomNo: '', floor: '', capacity: '2', roomType: 'DOUBLE' });

  const loadRooms = () => {
    getRooms().then(data => {
      setRooms(data);
      setIsLoading(false);
    }).catch(console.error);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleStatusChange = async (roomId: string, status: string) => {
    try {
      await adminUpdateRoomStatus(roomId, status);
      loadRooms();
    } catch (error) {
      setError('Unable to update room status.');
    }
  };

  const handleCreateRoom = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsCreating(true);
    try {
      await adminCreateRoom({
        roomNo: Number(form.roomNo),
        floor: Number(form.floor),
        capacity: Number(form.capacity),
        roomType: form.roomType,
      });
      setForm({ roomNo: '', floor: '', capacity: '2', roomType: 'DOUBLE' });
      setIsCreateOpen(false);
      loadRooms();
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Unable to create room.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Room Management</h1>
          <p className="text-slate-500">Manage all hostel rooms and their statuses.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Add New Room</Button>
      </div>

      {error && <p className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700" role="alert">{error}</p>}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map(room => (
            <Card key={room._id} className="hover-lift overflow-hidden group border-0 shadow-xl shadow-slate-200/50">
              <div className={`h-2 ${room.status === 'AVAILABLE' ? 'bg-success-500' : room.status === 'MAINTENANCE' ? 'bg-danger-500' : 'bg-warning-500'}`} />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{room.roomNo}</h3>
                    <p className="text-sm font-medium text-slate-500">{room.block} Block • Floor {room.floor}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={room.status === 'AVAILABLE' ? 'success' : room.status === 'MAINTENANCE' ? 'danger' : room.status === 'PARTIAL' ? 'warning' : 'secondary'}>
                      {room.status}
                    </Badge>
                  </div>
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

                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-sm text-slate-500">
                    Score: <span className="font-bold text-primary-600">{Math.round(room.utilizationScore || 0)}</span>
                  </div>
                  <div className="flex gap-2">
                    {room.status !== 'MAINTENANCE' ? (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(room._id, 'MAINTENANCE')}>
                        <Wrench className="h-4 w-4 mr-2" />
                        Maintenance
                      </Button>
                    ) : (
                      <Button variant="success" size="sm" onClick={() => handleStatusChange(room._id, 'AVAILABLE')}>
                        <BedDouble className="h-4 w-4 mr-2" />
                        Available
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add a room"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" form="create-room-form" isLoading={isCreating}>Create room</Button>
          </>
        }
      >
        <form id="create-room-form" onSubmit={handleCreateRoom} className="grid gap-4 sm:grid-cols-2">
          <Input required type="number" min="1" placeholder="Room number" value={form.roomNo} onChange={(e) => setForm({ ...form, roomNo: e.target.value })} />
          <Input required type="number" min="1" placeholder="Floor" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
          <Input required type="number" min="1" max="10" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700" value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="TRIPLE">Triple</option>
          </select>
        </form>
      </Modal>
    </div>
  );
}
