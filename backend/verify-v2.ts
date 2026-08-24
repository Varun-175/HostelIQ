/// <reference types="node" />
import http from 'http';

const API_URL = 'http://localhost:5000/api';

const fetchApi = (endpoint: string, options: any = {}): Promise<any> => {
  return new Promise<any>((resolve: Function, reject: Function) => {
    const url = new URL(`${API_URL}${endpoint}`);
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      },
      (res: http.IncomingMessage) => {
        let data = '';
        res.on('data', (chunk: Buffer) => { data += chunk; });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );

    req.on('error', (err: Error) => reject(err));

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- HOSTELIQ V2 BACKEND VERIFICATION ---');

  // 1. Admin Dashboard (Auth Test)
  console.log('\n[Phase F] Testing Admin Dashboard (Super Admin)...');
  const dashRes = await fetchApi('/admin/dashboard', {
    headers: { 'Authorization': 'Bearer SUPER_ADMIN_TOKEN' }
  });
  console.log(`Status: ${dashRes.status}, Body:`, dashRes.body);
  if (dashRes.status !== 200) {
    console.error('FAILED: Admin Dashboard fetch failed.');
    process.exit(1);
  }

  // 2. Admin Room Management
  console.log('\n[Phase G] Testing Room Management...');
  const randomRoomNo = Math.floor(Math.random() * 1000) + 1000;
  const roomRes = await fetchApi('/admin/rooms', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer SUPER_ADMIN_TOKEN' },
    body: {
      roomNo: randomRoomNo, floor: 9, capacity: 2, roomType: 'DOUBLE'
    }
  });
  console.log(`Status: ${roomRes.status}, Body:`, roomRes.body);
  const testRoomId = roomRes.body?.data?._id;

  // 3. Admin Room Status Update
  if (testRoomId) {
    console.log('\n[Phase G] Testing Room Status Update to MAINTENANCE...');
    const updateRes = await fetchApi(`/admin/rooms/${testRoomId}/status`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer SUPER_ADMIN_TOKEN' },
      body: { status: 'MAINTENANCE' }
    });
    console.log(`Status: ${updateRes.status}, New Status: ${updateRes.body?.data?.status}`);
  }

  // 4. Test Student Creation (for Allocation Override)
  console.log('\n[Phase H] Creating test student for Override...');
  const studentRes = await fetchApi('/students', {
    method: 'POST',
    body: {
      registerNo: `24CS${Math.floor(Math.random() * 1000)}`,
      name: 'Test Override Student',
      department: 'ECE',
      year: 2,
      preferences: { roomType: 'SINGLE' }
    }
  });
  const studentId = studentRes.body?.data?._id;
  
  if (studentId) {
    console.log('\n[Phase H] Triggering Allocation...');
    const allocRes = await fetchApi('/allocations/allocate', {
      method: 'POST',
      body: { studentId }
    });
    const allocationId = allocRes.body?.data?._id;

    if (allocationId && testRoomId) {
      console.log('\n[Phase I] Testing Admin Override...');
      const overrideRes = await fetchApi(`/admin/allocations/${allocationId}/override`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer SUPER_ADMIN_TOKEN' },
        body: { roomId: testRoomId, reason: 'Testing override logic' }
      });
      console.log(`Status: ${overrideRes.status}, Body:`, overrideRes.body);
    } else {
        console.log('\n[Phase I] Skipping Admin Override test due to missing alloc or room.');
    }
  }

  // 5. Test Unauthorized Access
  console.log('\n[Phase E] Testing Unauthorized Access (No Token)...');
  const unauthRes = await fetchApi('/admin/dashboard');
  console.log(`Status: ${unauthRes.status} (Expected 401)`);

  console.log('\n--- V2 VERIFICATION COMPLETE ---');
};

runTests().catch(err => console.error('Verification Script Error:', err));
