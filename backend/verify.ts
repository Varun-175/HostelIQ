import http from 'http';

const API_URL = 'http://localhost:5000/api';

const fetchApi = (endpoint: string, options: any = {}) => {
  return new Promise<any>((resolve, reject) => {
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
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- HOSTELIQ BACKEND VERIFICATION ---');

  // 1. Health Check
  console.log('\n[Phase 1] Testing Health Endpoint...');
  const healthRes = await fetchApi('/health');
  console.log(`Status: ${healthRes.status}, Body:`, healthRes.body);
  if (healthRes.status !== 200 || healthRes.body.database !== 'connected') {
    console.error('FAILED: Server health check or DB connection failed.');
    process.exit(1);
  }

  // 2. Student Creation
  console.log('\n[Phase 5] Testing Student Creation...');
  const studentPayload = {
    registerNo: `23CS${Math.floor(Math.random() * 1000)}`, // Random to prevent unique constraint error on re-runs
    name: 'Varun',
    department: 'CSE',
    year: 3,
    preferences: { roomType: 'DOUBLE', floor: 2 }
  };
  const studentRes = await fetchApi('/students', { method: 'POST', body: studentPayload });
  console.log(`Status: ${studentRes.status}, Body:`, studentRes.body);
  const studentId = studentRes.body?.data?._id;
  if (!studentId) {
    console.error('FAILED: Could not create student.');
    process.exit(1);
  }

  // 3. Room Fetch
  console.log('\n[Phase 6] Testing Room Fetch...');
  const roomRes = await fetchApi('/rooms');
  console.log(`Status: ${roomRes.status}, Found ${roomRes.body?.data?.length} rooms.`);
  
  // 4. End-to-End Allocation Test
  console.log('\n[Phase 8] Testing End-to-End SmartFit Allocation...');
  const allocRes = await fetchApi('/allocations/allocate', { method: 'POST', body: { studentId } });
  console.log(`Status: ${allocRes.status}, Body:`, JSON.stringify(allocRes.body, null, 2));
  
  if (allocRes.status === 200) {
    const { roomNo, totalScore, scoreBreakdown, reason } = allocRes.body.data;
    console.log(`\n✅ ALLOCATION SUCCESS: Room ${roomNo} selected with score ${totalScore}.`);
    console.log(`Reason: ${reason}`);
    console.log(`Breakdown:`, scoreBreakdown);
  } else {
    console.error('FAILED: Allocation failed.');
  }

  // 5. Database Side Effects Validation
  console.log('\n[Phase 9] Testing Database Side Effects...');
  const studentCheckRes = await fetchApi(`/students/${studentId}`);
  console.log(`Student Allocation Status:`, studentCheckRes.body.data.allocation);

  // 6. Analytics Check
  console.log('\n[Phase 10] Testing Analytics...');
  const analyticsRes = await fetchApi('/analytics');
  console.log(`Status: ${analyticsRes.status}, Body:`, analyticsRes.body);

  // 7. Search Check
  console.log('\n[Phase 11] Testing Search...');
  const searchRes = await fetchApi('/search?q=Varun');
  console.log(`Status: ${searchRes.status}, Found Students:`, searchRes.body.data.students.length);

  console.log('\n--- VERIFICATION COMPLETE ---');
};

runTests().catch(err => console.error('Verification Script Error:', err));
