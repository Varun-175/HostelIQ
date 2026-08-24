import { Request, Response, NextFunction } from 'express';

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient role' });
    }

    next();
  };
};

export const authorizePermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const hasPermission = req.user.permissions.includes(requiredPermission) || req.user.permissions.includes('*');
    if (!hasPermission) {
      return res.status(403).json({ success: false, message: 'Forbidden: Missing permission' });
    }

    next();
  };
};

export const authorizeAnyPermission = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const hasPermission = req.user.permissions.includes('*') ||
      requiredPermissions.some((permission) => req.user?.permissions.includes(permission));
    if (!hasPermission) {
      return res.status(403).json({ success: false, message: 'Forbidden: Missing permission' });
    }

    next();
  };
};
