import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt, { hash } from "bcryptjs";

interface User {
  id: string;
  name: string;
  email: string;
}

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const generateToken = (user: User): string => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key is missing");
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

export const generateVerificationToken = (email: string): string => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key is missing");
  }

  const payload = {
    email
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};
export const generatePasswordResetToken = (user: User): string => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key is missing");
  }

  const payload = {
    userId: user.id,
    email: user.email
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Authentication required: No token provided.",
      error: "missing_token"
    });
    return;
  }

  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as User;
    req.user = decoded; // Add user information to the request object
    next(); // Token is valid, proceed to the next middleware/route handler
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Authentication failed: Token expired.",
        error: "token_expired"
      });
      // 401 for expired token - still unauthorized
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        message: "Authentication failed: Invalid token.",
        error: "invalid_token"
      });
      // 403 for general invalid token (signature, format, etc.)
    } else {
      console.error("JWT Verification Error:", error);
      res.status(403).json({
        message: "Authentication failed: Token verification error.",
        error: "token_verification_failed"
      });
      // Generic 403 for other verification errors
    }
  }
};

export const verifyVerificationToken = (token: string): JwtPayload => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
    if (typeof decoded === "string") {
      throw new Error("Invalid token format");
    }
    return decoded;
  } catch (error) {
    console.log(error, "Failed to verify verification token");
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Verification failed: Token expired.");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Verification failed: Invalid token.");
    } else {
      console.error("JWT Verification Error:", error);
      throw new Error("Verification failed: Token verification error.");
    }
  }
};

export const verifyPasswordResetToken = (token: string): JwtPayload => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
    if (typeof decoded === "string") {
      throw new Error("Invalid token format");
    }
    return decoded;
  } catch (error) {
    console.log(error, "Failed to verify password reset token");
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Verification failed: Token expired.");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Verification failed: Invalid token.");
    } else {
      console.error("JWT Verification Error:", error);
      throw new Error("Verification failed: Token verification error.");
    }
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return hash(password, saltRounds);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword?: string
): Promise<boolean> => {
  if (!hashedPassword) {
    return false;
  }
  return bcrypt.compare(plainPassword, hashedPassword);
};
