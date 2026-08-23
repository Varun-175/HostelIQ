import crypto from 'crypto';
import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { User } from '../models/User';

const DEMO_PASSWORD = 'HostelIQ@2026';
const DEMO_ACCOUNTS = {
  'varun@student.com': { name: 'Varun A K', role: 'STUDENT' as const, permissions: ['allocation.request'] },
  'warden@hosteliq.com': { name: 'Warden Singh', role: 'WARDEN' as const, permissions: ['allocation.approve', 'student.read', 'room.read'] },
  'admin@hosteliq.com': { name: 'Admin Sharma', role: 'HOSTEL_ADMIN' as const, permissions: ['room.manage', 'allocation.manage', 'student.read', 'analytics.read'] },
  'super@hosteliq.com': { name: 'Super Admin', role: 'SUPER_ADMIN' as const, permissions: ['*'] },
};

const hashPassword = (password: string, salt = crypto.randomBytes(16).toString('hex')) => ({
  salt,
  hash: crypto.scryptSync(password, salt, 64).toString('hex'),
});

const matchesPassword = (password: string, stored: string) => {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const demoAccount = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS];

    if (!demoAccount || password !== DEMO_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let user = await User.findOne({ email }).select('+passwordHash');
    const passwordData = hashPassword(password);
    if (!user) {
      user = new User({
        email,
        name: demoAccount.name,
        role: demoAccount.role,
        permissions: demoAccount.permissions,
        passwordHash: `${passwordData.salt}:${passwordData.hash}`,
      });
    } else if (!user.passwordHash || !matchesPassword(password, user.passwordHash)) {
      user.passwordHash = `${passwordData.salt}:${passwordData.hash}`;
      user.name = demoAccount.name;
      user.role = demoAccount.role;
      user.permissions = demoAccount.permissions;
    }

    if (demoAccount.role === 'STUDENT' && !user.referenceId) {
      const student = await Student.findOne({ email }).sort({ createdAt: 1 }) || await Student.create({
        registerNo: `DEMO${Date.now()}`,
        name: demoAccount.name,
        department: 'CSE',
        year: 3,
        email,
        preferences: { roomType: 'DOUBLE' },
      });
      if (student) user.referenceId = student._id;
    }
    await user.save();

    const token = `${demoAccount.role}_TOKEN`;
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.referenceId?.toString() || user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
