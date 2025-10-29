import { Request, Response, NextFunction } from "express";
import { accessTokenManager } from "@/adapters/jwt-adapter-instance";
import { UnauthorizedError } from "@domain/errors";
import { JwtPayload } from "@/utils/types/jwt-payload";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new UnauthorizedError("No token provided"));
  }
  const token = authHeader?.split(" ")[1];
  try {
    const payload = accessTokenManager.verify(token) as JwtPayload;
    if (!payload) throw new UnauthorizedError("Invalid token");
    req.user = { id: payload.userId };
    next();
  } catch (error) {
    next(error);
  }
}
