import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";

type JwtPayload = {
  sub: string;
};

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required");
  }

  const token = authorization.split(" ")[1];
  const secret = env.jwtSecret;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;

    if (!payload.sub) {
      throw new AppError(401, "Invalid token");
    }

    req.userId = payload.sub;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
};
