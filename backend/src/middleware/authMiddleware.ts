import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        permissions: string[];
      };
    }
  }
}

// Simple development auth middleware
// In production, this would verify a JWT or interact with Google OAuth.
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // Very simple mock token validation for hackathon
  const token = authHeader.split(' ')[1];
  
  if (token === 'SUPER_ADMIN_TOKEN') {
    req.user = { id: '60d5ec49c6396b2e1480f001', role: 'SUPER_ADMIN', permissions: ['*'] };
  } else if (token === 'HOSTEL_ADMIN_TOKEN') {
    req.user = { id: '60d5ec49c6396b2e1480f002', role: 'HOSTEL_ADMIN', permissions: ['room.manage', 'allocation.manage', 'student.read', 'analytics.read'] };
  } else if (token === 'WARDEN_TOKEN') {
    req.user = {
      id: '60d5ec49c6396b2e1480f003',
      role: 'WARDEN',
      permissions: ['allocation.approve', 'allocation.manage', 'student.read', 'room.read', 'analytics.read'],
    };
  } else if (token === 'STUDENT_TOKEN') {
    req.user = { id: '60d5ec49c6396b2e1480f004', role: 'STUDENT', permissions: ['allocation.request'] };
  } else {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  next();
};
