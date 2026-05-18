import { Request, Response, NextFunction } from "express";
export const allowRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions." });
    }
    next();
  };
};
