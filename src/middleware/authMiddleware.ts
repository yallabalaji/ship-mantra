import { error } from "console";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include user property
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

// Define JWT payload structure
interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Middleware to verify JWT token
export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token : string = req.header("Authorization")?.split(" ")[1] || ' '; // Extract token

  if (!token)  {
     res.status(401).json({ message: "Access Denied" });
     return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.decode(token);
    const verified = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.user = verified;  // Attach user info to req
    next();  // Proceed to controller
  } catch (err) {
     console.log("The Error :" , String(err));
     res.status(403).json({ message: "Invalid Token" });
     next(error);
     return;
  }
};

// Middleware for role-based authorization
export const authorizeRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRole  = req.user?.role[0];

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};
